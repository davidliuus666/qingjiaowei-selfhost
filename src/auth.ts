import type { Env } from './util';

const encoder = new TextEncoder();
export const SESSION_COOKIE = 'qjw_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const LOGIN_WINDOW_MINUTES = 15;
const LOGIN_MAX_FAILURES = 8;

function toBase64(bytes: Uint8Array): string {
  let text = '';
  for (const byte of bytes) text += String.fromCharCode(byte);
  return btoa(text);
}

async function sha256(bytes: Uint8Array): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return new Uint8Array(digest);
}

/** 定长时间比较，避免按字节比较泄漏信息 */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

export const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const PASSWORD_KEY = 'admin_password_hash';

/** 密码至少 8 位；返回 null 表示没问题，否则返回给用户看的说明 */
export function passwordProblem(
  password: string,
  lang: 'zh' | 'en' = 'zh',
): string | null {
  const en = lang === 'en';
  if (!password) return en ? 'Password cannot be empty' : '密码不能为空';
  if (password.length < MIN_PASSWORD_LENGTH) {
    return en
      ? `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
      : `密码至少 ${MIN_PASSWORD_LENGTH} 位`;
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return en
      ? `Password must be at most ${MAX_PASSWORD_LENGTH} characters`
      : `密码最多 ${MAX_PASSWORD_LENGTH} 位`;
  }
  return null;
}

async function verifyHash(hash: string, candidate: string): Promise<boolean> {
  const parts = hash.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
  const iterations = Number(parts[1]);
  if (!Number.isFinite(iterations) || iterations < 1) return false;
  const salt = Uint8Array.from(atob(parts[2]!), (c) => c.charCodeAt(0));
  const expected = Uint8Array.from(atob(parts[3]!), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(candidate),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  try {
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
      key,
      256,
    );
    return timingSafeEqual(new Uint8Array(bits), expected);
  } catch {
    // 数据里的迭代次数超出运行时上限之类，当成密码不对，不要 500
    return false;
  }
}

/** 后台里设的密码（存 D1，只有哈希）；表还没建时返回 null */
export async function storedPasswordHash(env: Env): Promise<string | null> {
  try {
    const row = await env.DB.prepare(
      'SELECT value FROM settings WHERE key = ?',
    )
      .bind(PASSWORD_KEY)
      .first<{ value: string }>();
    return row?.value ?? null;
  } catch {
    return null;
  }
}

export async function hasPasswordConfigured(env: Env): Promise<boolean> {
  if (env.ADMIN_PASSWORD || env.ADMIN_PASSWORD_HASH) return true;
  return Boolean(await storedPasswordHash(env));
}

/** 校验管理员密码。密码只存哈希，代码里没有明文。 */
export async function verifyPassword(env: Env, candidate: string): Promise<boolean> {
  if (!candidate) return false;

  // 后台里设置过的密码优先；部署时写的 Worker 密钥作为后备。
  const stored = await storedPasswordHash(env);
  if (stored && (await verifyHash(stored, candidate))) return true;
  if (env.ADMIN_PASSWORD_HASH && (await verifyHash(env.ADMIN_PASSWORD_HASH, candidate))) {
    return true;
  }
  if (env.ADMIN_PASSWORD) {
    const a = await sha256(encoder.encode(candidate));
    const b = await sha256(encoder.encode(env.ADMIN_PASSWORD));
    return timingSafeEqual(a, b);
  }

  return false;
}

/** 第一次设置密码：用一条原子写入占位，两个人同时点也只有一个人成功 */
export async function claimAdminPassword(
  env: Env,
  password: string,
): Promise<boolean> {
  const hash = await hashPassword(password);
  const result = await env.DB.prepare(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO NOTHING`,
  )
    .bind(PASSWORD_KEY, hash)
    .run();
  return (result.meta?.changes ?? 0) > 0;
}

/** 改密码：覆盖已有哈希 */
export async function setAdminPassword(
  env: Env,
  password: string,
): Promise<void> {
  const hash = await hashPassword(password);
  await env.DB.prepare(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
  )
    .bind(PASSWORD_KEY, hash)
    .run();
}

/**
 * Cloudflare Workers 生产环境对 PBKDF2 迭代次数有硬上限：100000，
 * 超过会报 NotSupportedError: iteration counts above 100000 are not supported。
 * 注意本地 wrangler dev 不拦这个上限，所以这个值不能写大。
 */
export const PBKDF2_ITERATIONS = 100_000;

/** 生成 pbkdf2 哈希串（供需要时离线生成密码用） */
export async function hashPassword(
  password: string,
  iterations = PBKDF2_ITERATIONS,
): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    key,
    256,
  );
  return `pbkdf2$${iterations}$${toBase64(salt)}$${toBase64(new Uint8Array(bits))}`;
}

async function sessionSecret(env: Env): Promise<string | null> {
  if (env.SESSION_SECRET) return env.SESSION_SECRET;
  // 用密码哈希派生的密钥：改密码后旧会话自然失效（哈希里有随机盐，不是明文）
  const stored = await storedPasswordHash(env);
  if (stored) return `qjw:${stored}`;
  if (env.ADMIN_PASSWORD) return `qjw:${env.ADMIN_PASSWORD}`;
  if (env.ADMIN_PASSWORD_HASH) return `qjw:${env.ADMIN_PASSWORD_HASH}`;
  return null;
}

async function hmac(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return toBase64(new Uint8Array(sig));
}

/** 会话版本号：退出登录时 +1，之前发出去的会话立刻失效 */
export async function sessionVersion(env: Env): Promise<string> {
  try {
    const row = await env.DB.prepare(
      "SELECT value FROM settings WHERE key = 'session_version'",
    ).first<{ value: string }>();
    return row?.value ?? '0';
  } catch {
    return '0';
  }
}

export async function revokeAllSessions(env: Env): Promise<void> {
  const next = String((Number(await sessionVersion(env)) || 0) + 1);
  await env.DB.prepare(
    'CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)',
  ).run();
  await env.DB.prepare(
    `INSERT INTO settings (key, value) VALUES ('session_version', ?)
     ON CONFLICT(key) DO UPDATE SET value = ?`,
  )
    .bind(next, next)
    .run();
}

export async function createSession(env: Env): Promise<string | null> {
  const secret = await sessionSecret(env);
  if (!secret) return null;
  const payload = `v1.${await sessionVersion(env)}.${Date.now() + SESSION_TTL_MS}`;
  return `${payload}.${await hmac(secret, payload)}`;
}

export async function isValidSession(
  env: Env,
  cookie: string | undefined,
): Promise<boolean> {
  const secret = await sessionSecret(env);
  if (!secret || !cookie) return false;
  const parts = cookie.split('.');
  if (parts.length !== 4) return false;
  const [prefix, version, expiresAt, signature] = parts;
  if (prefix !== 'v1') return false;
  const expires = Number(expiresAt);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;
  if (version !== (await sessionVersion(env))) return false;
  const expected = await hmac(secret, `${prefix}.${version}.${expiresAt}`);
  return timingSafeEqual(encoder.encode(expected), encoder.encode(signature!));
}

export function sessionCookie(value: string): string {
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  return `${SESSION_COOKIE}=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

export function readSessionCookie(request: Request): string | undefined {
  const header = request.headers.get('cookie');
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name === SESSION_COOKIE) return rest.join('=');
  }
  return undefined;
}

/** 登录失败次数限制：同一 IP 15 分钟内失败 8 次就暂时拒绝 */
export async function loginAllowed(env: Env, ip: string): Promise<boolean> {
  const row = await env.DB.prepare(
    'SELECT count, first_at FROM login_attempts WHERE ip = ?',
  )
    .bind(ip)
    .first<{ count: number; first_at: string }>();
  if (!row) return true;
  const firstAt = Date.parse(row.first_at);
  if (!Number.isFinite(firstAt)) return true;
  if (Date.now() - firstAt > LOGIN_WINDOW_MINUTES * 60_000) return true;
  return row.count < LOGIN_MAX_FAILURES;
}

export async function recordLoginAttempt(
  env: Env,
  ip: string,
  success: boolean,
): Promise<void> {
  if (success) {
    await env.DB.prepare('DELETE FROM login_attempts WHERE ip = ?').bind(ip).run();
    return;
  }
  await env.DB.prepare(
    `INSERT INTO login_attempts (ip, count, first_at, last_at)
     VALUES (?, 1, ?, ?)
     ON CONFLICT(ip) DO UPDATE SET
       count = CASE
         WHEN (julianday(?) - julianday(first_at)) * 1440 > ?
           THEN 1
         ELSE count + 1
       END,
       first_at = CASE
         WHEN (julianday(?) - julianday(first_at)) * 1440 > ?
           THEN ?
         ELSE first_at
       END,
       last_at = ?`,
  )
    .bind(
      ip,
      new Date().toISOString(),
      new Date().toISOString(),
      new Date().toISOString(),
      LOGIN_WINDOW_MINUTES,
      new Date().toISOString(),
      LOGIN_WINDOW_MINUTES,
      new Date().toISOString(),
      new Date().toISOString(),
    )
    .run();
}
