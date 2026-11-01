import qrcode from 'qrcode-generator';

import { nowIso, type Env } from './util';

const encoder = new TextEncoder();
// 小组二维码统一 24 小时有效；人数由后台选择。
const INVITE_TTL_MS = 24 * 60 * 60_000;
export const MAX_INVITE_USES = 20;
export const DEFAULT_INVITE_USES = 5;

function toBase64Url(bytes: Uint8Array): string {
  let text = '';
  for (const byte of bytes) text += String.fromCharCode(byte);
  return btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function randomToken(bytes = 32): string {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(bytes)));
}

function toHex(bytes: Uint8Array): string {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(token));
  return toHex(new Uint8Array(digest));
}

function qrSvg(url: string): string {
  const qr = qrcode(0, 'M');
  qr.addData(url);
  qr.make();
  return qr.createSvgTag({ cellSize: 7, margin: 2, scalable: true });
}

export interface CreatedInvite {
  id: number;
  expiresAt: string;
  maxUses: number;
  usedCount: number;
  qrSvg: string;
}

export interface JoinedDevice {
  token: string;
  deviceName: string;
  groupName: string | null;
  themeMode: string;
}

export interface DeviceSummary {
  id: number;
  name: string;
  createdAt: string;
  lastSeenAt: string | null;
}

/**
 * 生成小组二维码。数据库只存 token 的哈希，二维码内容只返回这一次。
 * 一个码可以让多台手机加入，但有 24 小时和人数上限；每台手机拿到独立通行证。
 * 二维码编码成 App 专用协议，不是网址，避免被当成链接转发。
 */
export async function createInvite(
  env: Env,
  origin: string,
  maxUses = DEFAULT_INVITE_USES,
): Promise<CreatedInvite> {
  const token = randomToken(24);
  const tokenHash = await hashToken(token);
  const createdAt = nowIso();
  const expiresAt = new Date(Date.now() + INVITE_TTL_MS).toISOString();
  const uses = Math.min(
    MAX_INVITE_USES,
    Math.max(1, Math.trunc(Number(maxUses) || DEFAULT_INVITE_USES)),
  );
  const result = await env.DB.prepare(
    `INSERT INTO invites
       (token_hash, label, created_at, expires_at, max_uses, used_count)
     VALUES (?, ?, ?, ?, ?, 0)`,
  )
    .bind(tokenHash, '小组二维码', createdAt, expiresAt, uses)
    .run();
  const id = Number(result.meta?.last_row_id ?? 0);
  const payload = `qingjiaowei://join?v=1&server=${encodeURIComponent(origin)}&invite=${token}`;
  return {
    id,
    expiresAt,
    maxUses: uses,
    usedCount: 0,
    qrSvg: qrSvg(payload),
  };
}

/** 用小组二维码换设备通行证；到期或用完都拒绝 */
export async function joinWithInvite(
  env: Env,
  invite: string,
  deviceName: string,
): Promise<JoinedDevice | { error: string }> {
  const tokenHash = await hashToken(invite);
  const inviteRow = await env.DB.prepare(
    `SELECT id, expires_at, used_at, max_uses, used_count
     FROM invites WHERE token_hash = ?`,
  )
    .bind(tokenHash)
    .first<{
      id: number;
      expires_at: string;
      used_at: string | null;
      max_uses: number;
      used_count: number;
    }>();
  if (!inviteRow) return { error: '二维码无效，请让管理员重新生成' };
  const maxUses = Math.max(1, inviteRow.max_uses ?? 1);
  if (inviteRow.used_at || (inviteRow.used_count ?? 0) >= maxUses) {
    return { error: '这个二维码已经用完了，请让管理员重新生成' };
  }
  const expires = Date.parse(inviteRow.expires_at);
  if (!Number.isFinite(expires) || expires < Date.now()) {
    return { error: '二维码已过期，请让管理员重新生成' };
  }

  // 条件更新抢占一个名额：多台手机同时扫，也不会超过人数上限
  const now = nowIso();
  const claimed = await env.DB.prepare(
    `UPDATE invites
     SET used_count = used_count + 1,
         used_at = CASE WHEN used_count + 1 >= max_uses THEN ? ELSE used_at END
     WHERE id = ?
       AND used_at IS NULL
       AND used_count < max_uses
       AND expires_at > ?`,
  )
    .bind(now, inviteRow.id, now)
    .run();
  if ((claimed.meta?.changes ?? 0) === 0) {
    return { error: '这个二维码已经用完或过期了，请让管理员重新生成' };
  }

  const token = randomToken(32);
  const tokenHashForDevice = await hashToken(token);
  const name = deviceName.trim().slice(0, 80) || '新设备';
  await env.DB.prepare(
    `INSERT INTO devices (token_hash, name, created_at, last_seen_at, invite_id)
     VALUES (?, ?, ?, ?, ?)`,
  )
    .bind(tokenHashForDevice, name, now, now, inviteRow.id)
    .run();

  const group = await env.DB.prepare(
    'SELECT name, theme_mode FROM group_info WHERE id = 1',
  ).first<{ name: string; theme_mode: string | null }>();

  return {
    token,
    deviceName: name,
    groupName: group?.name ?? null,
    themeMode: group?.theme_mode ?? 'system',
  };
}

/** 立即作废一个二维码：只停止新手机加入，不影响已经加入的设备 */
export async function revokeInvite(env: Env, id: number): Promise<boolean> {
  const result = await env.DB.prepare(
    `UPDATE invites
     SET used_count = max_uses,
         used_at = COALESCE(used_at, ?)
     WHERE id = ? AND used_at IS NULL`,
  )
    .bind(nowIso(), id)
    .run();
  return (result.meta?.changes ?? 0) > 0;
}

/** 校验设备通行证；touch=false 时只读，图片请求不要每次都写库 */
export async function verifyDeviceToken(
  env: Env,
  token: string,
  touch = true,
): Promise<{ id: number; name: string } | null> {
  const tokenHash = await hashToken(token);
  const row = await env.DB.prepare(
    'SELECT id, name, revoked_at FROM devices WHERE token_hash = ?',
  )
    .bind(tokenHash)
    .first<{ id: number; name: string; revoked_at: string | null }>();
  if (!row || row.revoked_at) return null;
  if (touch) {
    // 小群组，直接更新；失败不影响这次请求
    await env.DB.prepare('UPDATE devices SET last_seen_at = ? WHERE id = ?')
      .bind(nowIso(), row.id)
      .run()
      .catch(() => undefined);
  }
  return { id: row.id, name: row.name };
}

export async function revokeDeviceByToken(
  env: Env,
  token: string,
): Promise<void> {
  const tokenHash = await hashToken(token);
  await env.DB.prepare(
    'UPDATE devices SET revoked_at = ? WHERE token_hash = ? AND revoked_at IS NULL',
  )
    .bind(nowIso(), tokenHash)
    .run();
}

export async function listDevices(env: Env): Promise<DeviceSummary[]> {
  const { results } = await env.DB.prepare(
    `SELECT id, name, created_at, last_seen_at FROM devices
     WHERE revoked_at IS NULL ORDER BY created_at DESC, id DESC`,
  ).all<{
    id: number;
    name: string;
    created_at: string;
    last_seen_at: string | null;
  }>();
  return (results ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    lastSeenAt: row.last_seen_at,
  }));
}

export async function revokeDevice(env: Env, id: number): Promise<void> {
  await env.DB.prepare(
    'UPDATE devices SET revoked_at = ? WHERE id = ? AND revoked_at IS NULL',
  )
    .bind(nowIso(), id)
    .run();
}

export async function revokeAllDevices(env: Env): Promise<void> {
  await env.DB.prepare(
    'UPDATE devices SET revoked_at = ? WHERE revoked_at IS NULL',
  )
    .bind(nowIso())
    .run();
}

export function readBearerToken(request: Request): string | null {
  const header = request.headers.get('authorization') ?? '';
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match?.[1]?.trim() || null;
}
