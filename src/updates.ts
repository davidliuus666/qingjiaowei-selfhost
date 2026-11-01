import { nowIso, type Env } from './util';

/**
 * App 通知用的统一更新流。
 *
 * 只汇总「已发布」的内容，按发布时间从新到旧；App 拿本地见过的记录跟它比对，
 * 决定哪些是新通知。不新建表，也不改后台的发布流程。
 */

type UpdateKind = 'announcement' | 'notice' | 'quiz' | 'homework' | 'episode';

interface UpdateRow {
  kind: UpdateKind;
  id: number;
  title: string;
  body: string | null;
  subtitle: string | null;
  cover_url: string | null;
  published_at: string;
  due_at: string | null;
}

export interface UpdateItem {
  kind: UpdateKind;
  id: number;
  title: string;
  body: string;
  subtitle: string | null;
  coverUrl: string | null;
  publishedAt: string;
  dueAt: string | null;
}

const MAX_ITEMS = 100;
const MAX_BODY = 180;

function excerpt(value: string | null, max = MAX_BODY): string {
  const text = (value ?? '').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

/** 数据库里可能存相对路径，App 需要能直接加载的绝对地址 */
function absolute(origin: string, value: string | null): string | null {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('//')) return `https:${value}`;
  return `${origin}${value.startsWith('/') ? '' : '/'}${value}`;
}

export async function listUpdates(
  env: Env,
  origin: string,
): Promise<UpdateItem[]> {
  const { results } = await env.DB.prepare(
    `SELECT * FROM (
       SELECT 'announcement' AS kind, a.id, a.title,
              COALESCE(a.body, a.summary, '') AS body,
              a.summary AS subtitle,
              a.cover_url AS cover_url,
              a.published_at AS published_at,
              NULL AS due_at
       FROM announcements a
       WHERE a.is_published = 1 AND a.published_at IS NOT NULL

       UNION ALL

       SELECT 'notice' AS kind, n.id, n.title,
              n.body AS body,
              NULL AS subtitle,
              NULL AS cover_url,
              COALESCE(n.published_at, n.created_at) AS published_at,
              NULL AS due_at
       FROM class_notices n
       WHERE n.is_published = 1

       UNION ALL

       SELECT 'quiz' AS kind, q.id, q.title,
              COALESCE(q.description, '') AS body,
              NULL AS subtitle,
              NULL AS cover_url,
              COALESCE(q.published_at, q.created_at) AS published_at,
              NULL AS due_at
       FROM quizzes q
       WHERE q.is_published = 1

       UNION ALL

       SELECT 'homework' AS kind, h.id, h.title,
              COALESCE(h.description, '') AS body,
              NULL AS subtitle,
              NULL AS cover_url,
              COALESCE(h.published_at, h.created_at) AS published_at,
              h.due_at AS due_at
       FROM class_homeworks h
       WHERE h.is_published = 1

       UNION ALL

       SELECT 'episode' AS kind, e.id, e.title,
              COALESCE(e.summary, '') AS body,
              s.title AS subtitle,
              COALESCE(e.cover_url, s.cover_url) AS cover_url,
              e.published_at AS published_at,
              NULL AS due_at
       FROM episodes e
       LEFT JOIN series s ON s.id = e.series_id
       WHERE e.published_at IS NOT NULL
     )
     ORDER BY published_at DESC, id DESC
     LIMIT ?`,
  )
    .bind(MAX_ITEMS)
    .all<UpdateRow>();

  return (results ?? []).map((row) => ({
    kind: row.kind,
    id: row.id,
    title: row.title,
    body: excerpt(row.body),
    subtitle: row.subtitle,
    coverUrl: absolute(origin, row.cover_url),
    publishedAt: row.published_at,
    dueAt: row.due_at,
  }));
}

/** 接口返回值：内容列表 + 服务器时间，App 用服务器时间做「最近一次检查」 */
export async function updatesFeed(env: Env, origin: string) {
  return {
    serverTime: nowIso(),
    items: await listUpdates(env, origin),
  };
}
