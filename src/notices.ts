import { nowIso, trimmed, type Env } from './util';

/**
 * 课堂通知：后台发布，App 课堂流里按发布时间和测验混在一起显示。
 * 没有账号体系，所有已加入小组的手机都能看已发布的通知。
 */

type Row = Record<string, unknown>;
const MAX_TITLE = 120;
const MAX_BODY = 20000;

interface NoticeRow {
  id: number;
  title: string;
  body: string;
  is_published: number;
  published_at: string | null;
  created_at: string;
  updated_at: string | null;
}

function flag(value: unknown): boolean {
  return value === true || value === 1 || value === '1' || value === 'true';
}

async function loadNotice(env: Env, id: number): Promise<NoticeRow | null> {
  return env.DB.prepare(
    `SELECT id, title, body, is_published, published_at, created_at, updated_at
     FROM class_notices WHERE id = ?`,
  )
    .bind(id)
    .first<NoticeRow>();
}

/** App：只下发已发布的，最新的在最上面 */
export async function listNoticesForDevice(env: Env) {
  const { results } = await env.DB.prepare(
    `SELECT id, title, body, COALESCE(published_at, created_at) AS published_at
     FROM class_notices
     WHERE is_published = 1
     ORDER BY COALESCE(published_at, created_at) DESC, id DESC`,
  ).all<{
    id: number;
    title: string;
    body: string;
    published_at: string | null;
  }>();

  return (results ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    body: row.body,
    publishedAt: row.published_at,
  }));
}

/** App：打开单条通知时取全文；草稿不下发 */
export async function loadNoticeForDevice(env: Env, id: number) {
  const row = await env.DB.prepare(
    `SELECT id, title, body, published_at, created_at
     FROM class_notices
     WHERE id = ? AND is_published = 1`,
  )
    .bind(id)
    .first<{
      id: number;
      title: string;
      body: string;
      published_at: string | null;
      created_at: string;
    }>();
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    publishedAt: row.published_at ?? row.created_at,
  };
}

/** 后台：草稿也在列表里 */
export async function listNoticesForAdmin(env: Env) {
  const { results } = await env.DB.prepare(
    `SELECT id, title, body, is_published, published_at, created_at, updated_at
     FROM class_notices
     ORDER BY created_at DESC, id DESC`,
  ).all<NoticeRow>();

  return (results ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    body: row.body,
    isPublished: row.is_published === 1,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function createNotice(env: Env, body: Row) {
  const title = trimmed(body.title, MAX_TITLE);
  if (!title) throw new Error('通知标题不能为空');
  const text = trimmed(body.body, MAX_BODY);
  if (!text) throw new Error('通知内容不能为空');
  const published = flag(body.isPublished);
  const now = nowIso();
  const result = await env.DB.prepare(
    `INSERT INTO class_notices
       (title, body, is_published, published_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  )
    .bind(title, text, published ? 1 : 0, published ? now : null, now, now)
    .run();
  return { ok: true, id: Number(result.meta?.last_row_id ?? 0) };
}

export async function updateNotice(env: Env, id: number, body: Row) {
  const notice = await loadNotice(env, id);
  if (!notice) throw new Error('找不到这条通知');
  const title = trimmed(body.title, MAX_TITLE);
  if (!title) throw new Error('通知标题不能为空');
  const text = trimmed(body.body, MAX_BODY);
  if (!text) throw new Error('通知内容不能为空');
  const published = flag(body.isPublished);
  const now = nowIso();
  const publishedAt =
    published && !notice.published_at ? now : notice.published_at;
  await env.DB.prepare(
    `UPDATE class_notices
     SET title = ?, body = ?, is_published = ?, published_at = ?, updated_at = ?
     WHERE id = ?`,
  )
    .bind(title, text, published ? 1 : 0, publishedAt, now, id)
    .run();
  return { ok: true };
}

export async function deleteNotice(env: Env, id: number): Promise<void> {
  await env.DB.prepare('DELETE FROM class_notices WHERE id = ?').bind(id).run();
}
