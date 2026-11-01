import type { Env } from './util';
import {
  absolute,
  beijingInput,
  clockTime,
  durationLabel,
  nextWeeklyOccurrence,
  nowIso,
  toFlag,
  toIso,
  toInt,
  trimmed,
} from './util';

type Row = Record<string, unknown>;
type SqlValue = string | number | null;

export interface CollectionDef {
  table: string;
  order: string;
  /** 单行配置（小组信息），没有列表 */
  single?: boolean;
  /** 有这一列的内容可以在列表里批量发布 / 隐藏 */
  publishColumn?: 'is_published' | 'published';
  parse: (body: Row) => Record<string, SqlValue>;
  toJson: (row: Row, origin: string) => Row;
}

const MEDIA_TYPES = ['none', 'youtube', 'video', 'audio'];
const CATEGORIES = ['sermon', 'study', 'rolcc'];
const MEETING_MODES = ['offline', 'online', 'hybrid'];
const HOME_CARD_KINDS = ['meeting', 'announcement'];
const THEME_MODES = ['system', 'light', 'dark'];

function required(value: unknown, max: number, label: string): string {
  const text = trimmed(value, max);
  if (!text) throw new Error(`${label}不能为空`);
  return text;
}

export const collections: Record<string, CollectionDef> = {
  home: {
    table: 'home_cards',
    order: 'sort ASC, id ASC',
    parse: (body) => {
      const kind = trimmed(body.kind, 20) ?? 'meeting';
      if (!HOME_CARD_KINDS.includes(kind)) {
        throw new Error('卡片类型只能是参加聚会或本周公告');
      }
      const refId = toInt(
        kind === 'meeting' ? body.meetingId : body.announcementId,
        0,
      );
      if (!refId) {
        throw new Error(
          kind === 'meeting' ? '请选择要显示的聚会' : '请选择要显示的公告',
        );
      }
      return {
        kind,
        ref_id: refId,
        title: trimmed(body.title, 120),
        cover_url: trimmed(body.coverUrl, 500),
        sort: toInt(body.sort, 0),
      };
    },
    toJson: (row, origin) => ({
      id: row.id,
      kind: row.kind,
      meetingId: row.kind === 'meeting' ? row.ref_id : null,
      announcementId: row.kind === 'announcement' ? row.ref_id : null,
      title: row.title,
      coverUrl: absolute(origin, row.cover_url as string | null),
      sort: row.sort,
    }),
  },
  announcements: {
    table: 'announcements',
    order: 'published_at DESC, id DESC',
    publishColumn: 'is_published',
    parse: (body) => ({
      title: required(body.title, 120, '标题'),
      summary: trimmed(body.summary, 300),
      body: required(body.body, 8000, '正文'),
      cover_url: trimmed(body.coverUrl, 500),
      published_at: toIso(body.publishedAt) ?? nowIso(),
      is_published: toFlag(body.isPublished, 1),
    }),
    toJson: (row, origin) => ({
      id: row.id,
      title: row.title,
      summary: row.summary,
      body: row.body,
      coverUrl: absolute(origin, row.cover_url as string | null),
      publishedAt: row.published_at,
      isPublished: row.is_published,
    }),
  },
  meetings: {
    table: 'meetings',
    // 每周重复的排在前面，同组内按最近一次
    order: 'repeat_weekly DESC, starts_at ASC, id ASC',
    parse: (body) => {
      const mode = trimmed(body.mode, 10) ?? 'offline';
      if (!MEETING_MODES.includes(mode)) {
        throw new Error('聚会方式只能是线下 / 线上 / 线上线下同步进行');
      }
      const repeatWeekly = toFlag(body.repeatWeekly, 0);
      // 纯线上不留线下地址；纯线下也不留线上链接，避免出现「说是线下却有 Zoom」的混乱
      const place = mode === 'online' ? null : trimmed(body.place, 200);
      const onlineUrl =
        mode === 'offline' ? null : trimmed(body.onlineUrl, 600);
      const base = {
        topic: required(body.topic, 160, '聚会主题'),
        scripture: trimmed(body.scripture, 120),
        leader: trimmed(body.leader, 60),
        place,
        cover_url: trimmed(body.coverUrl, 500),
        mode,
        repeat_weekly: repeatWeekly,
        is_online: mode === 'offline' ? 0 : 1,
        online_url: onlineUrl,
        online_override: mode === 'offline' ? 0 : toFlag(body.onlineOverride, 0),
      };
      if (repeatWeekly === 1) {
        const weekday = toInt(body.weekday, 0);
        if (weekday < 1 || weekday > 7) throw new Error('每周重复要选周几');
        const startTime = clockTime(body.startTime);
        const endTime = clockTime(body.endTime);
        if (!startTime || !endTime) {
          throw new Error('每周重复要填开始和结束时间（北京时间）');
        }
        // starts_at / ends_at 存「下一次」的具体时刻，方便后台列表展示和排序；
        // 真正的起止时间每次读的时候按周几实时算。
        const next = nextWeeklyOccurrence(weekday, startTime, endTime);
        return {
          ...base,
          weekday,
          start_time: startTime,
          end_time: endTime,
          starts_at: new Date(next.start).toISOString(),
          ends_at: new Date(next.end).toISOString(),
        };
      }
      const startsAt = toIso(body.startsAt);
      if (!startsAt) {
        throw new Error('聚会时间不能为空');
      }
      return {
        ...base,
        weekday: null,
        start_time: null,
        end_time: null,
        starts_at: startsAt,
        ends_at: toIso(body.endsAt),
      };
    },
    toJson: (row, origin) => ({
      id: row.id,
      topic: row.topic,
      scripture: row.scripture,
      leader: row.leader,
      place: row.place,
      coverUrl: absolute(origin, row.cover_url as string | null),
      mode: row.mode ?? 'offline',
      startsAt: row.starts_at,
      endsAt: row.ends_at,
      repeatWeekly: row.repeat_weekly ?? 0,
      weekday: row.weekday,
      startTime: row.start_time,
      endTime: row.end_time,
      isOnline: row.is_online,
      onlineUrl: row.online_url,
      onlineOverride: row.online_override,
      // 后台表单里的时间按北京时间显示
      startsAtInput: beijingInput(row.starts_at),
      endsAtInput: beijingInput(row.ends_at),
    }),
  },
  slides: {
    table: 'slides',
    order: 'sort ASC, id ASC',
    publishColumn: 'published',
    parse: (body) => ({
      image_url: trimmed(body.imageUrl, 500) ?? '',
      link_url: trimmed(body.linkUrl, 500),
      sort: toInt(body.sort, 0),
      published: toFlag(body.published, 1),
    }),
    toJson: (row, origin) => ({
      id: row.id,
      imageUrl: absolute(origin, row.image_url as string | null) ?? '',
      linkUrl: row.link_url,
      sort: row.sort,
      published: row.published,
    }),
  },
  series: {
    table: 'series',
    // 普通、特别和生命河各自排序，不在同一个序列里混着编。
    // 没填排序（0）的按添加时间新的在前，id 是自增的，越大越新。
    order: 'category ASC, sort ASC, id DESC',
    parse: (body) => {
      const category = trimmed(body.category, 20) ?? 'sermon';
      if (!CATEGORIES.includes(category)) {
        throw new Error('分类只能是普通、特别或生命河');
      }
      return {
        title: required(body.title, 120, '系列名'),
        subtitle: trimmed(body.subtitle, 200),
        cover_url: trimmed(body.coverUrl, 500),
        mark: trimmed(body.mark, 4),
        category,
        sort: toInt(body.sort, 0),
      };
    },
    toJson: (row, origin) => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      coverUrl: absolute(origin, row.cover_url as string | null),
      mark: row.mark,
      category: row.category,
      sort: row.sort,
    }),
  },
  episodes: {
    table: 'episodes',
    order: 'series_id ASC, sort ASC, id ASC',
    parse: (body) => {
      const mediaType = trimmed(body.mediaType, 20) ?? 'none';
      if (!MEDIA_TYPES.includes(mediaType)) {
        throw new Error('音视频类型只能是 none / youtube / video / audio');
      }
      // 单集必须挂在系列下面：不再有「不属于任何系列」的单集
      const seriesId =
        body.seriesId === null || body.seriesId === ''
          ? null
          : toInt(body.seriesId, 0) || null;
      if (!seriesId) throw new Error('单集必须属于一个系列');
      return {
        series_id: seriesId,
        title: required(body.title, 160, '标题'),
        episode_no: toInt(body.episodeNo, 0) || null,
        speaker: trimmed(body.speaker, 60),
        duration: durationLabel(body.duration),
        summary: trimmed(body.summary, 2000),
        media_type: mediaType,
        media_url: trimmed(body.mediaUrl, 800),
        resource_url: trimmed(body.resourceUrl, 800),
        cover_url: trimmed(body.coverUrl, 500),
        published_at: toIso(body.publishedAt) ?? nowIso(),
        sort: toInt(body.sort, 0),
      };
    },
    toJson: (row, origin) => ({
      id: row.id,
      seriesId: row.series_id,
      title: row.title,
      episodeNo: row.episode_no,
      speaker: row.speaker,
      duration: durationLabel(row.duration),
      summary: row.summary,
      mediaType: row.media_type,
      mediaUrl: row.media_url,
      resourceUrl: row.resource_url,
      coverUrl: absolute(origin, row.cover_url as string | null),
      publishedAt: row.published_at,
      sort: row.sort,
    }),
  },
  prayers: {
    table: 'prayers',
    order: 'is_published DESC, created_at DESC, id DESC',
    publishColumn: 'is_published',
    parse: (body) => ({
      author: required(body.author, 60, '代祷人'),
      content: required(body.content, 1000, '祷告内容'),
      is_published: toFlag(body.isPublished, 1),
      created_at: toIso(body.createdAt) ?? nowIso(),
    }),
    toJson: (row) => ({
      id: row.id,
      author: row.author,
      content: row.content,
      isPublished: row.is_published,
      createdAt: row.created_at,
    }),
  },
  group: {
    table: 'group_info',
    order: 'id ASC',
    single: true,
    parse: (body) => {
      const themeMode = trimmed(body.themeMode, 10) ?? 'system';
      if (!THEME_MODES.includes(themeMode)) {
        throw new Error('App 默认外观只能是跟随系统、浅色或深色');
      }
      return {
        name: required(body.name, 80, '小组名称'),
        intro: trimmed(body.intro, 300),
        leader: trimmed(body.leader, 60),
        theme_mode: themeMode,
      };
    },
    toJson: (row) => ({
      id: row.id,
      name: row.name,
      intro: row.intro,
      leader: row.leader,
      themeMode: row.theme_mode ?? 'system',
    }),
  },
};

export function isCollection(name: string): boolean {
  return Object.hasOwn(collections, name);
}

/** 后台列表里这两栏内容会长得很快，走服务端分页，不再整包下发 */
const SERVER_PAGED_COLLECTIONS = new Set(['series', 'episodes']);

/** 一页最多 50 条，免得上面的人一次拉太多把 Worker 拖死 */
export const MAX_LIST_PAGE_SIZE = 50;

export interface CollectionPage {
  items: Row[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 后台的一页列表。搜索在 SQL 里做，只把当前这页的数据发给浏览器。
 * 目前只开放给系列和单集：其他栏目的数据量很小，维持原样最稳。
 */
export async function listPage(
  env: Env,
  origin: string,
  name: string,
  query: {
    page?: number;
    pageSize?: number;
    q?: string;
    category?: string | null;
    seriesId?: number | null;
  },
): Promise<CollectionPage> {
  const def = collections[name]!;
  if (!SERVER_PAGED_COLLECTIONS.has(name)) {
    throw new Error('这个栏目不支持分页');
  }
  const page = Math.max(1, Math.trunc(Number(query.page) || 1));
  const pageSize = Math.min(
    MAX_LIST_PAGE_SIZE,
    Math.max(1, Math.trunc(Number(query.pageSize) || 10)),
  );
  const keyword = (query.q ?? '').trim().slice(0, 60).toLowerCase();
  const category =
    query.category === 'sermon' ||
    query.category === 'study' ||
    query.category === 'rolcc'
      ? query.category
      : null;
  const offset = (page - 1) * pageSize;

  if (name === 'series') {
    const where: string[] = [];
    const args: SqlValue[] = [];
    if (keyword) {
      where.push(
        `(instr(lower(s.title), ?) > 0
          OR instr(lower(COALESCE(s.subtitle, '')), ?) > 0
          OR instr(lower(COALESCE(s.mark, '')), ?) > 0)`,
      );
      args.push(keyword, keyword, keyword);
    }
    if (category) {
      where.push('s.category = ?');
      args.push(category);
    }
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const totalRow = await env.DB.prepare(
      `SELECT COUNT(*) AS total FROM series s ${clause}`,
    )
      .bind(...args)
      .first<{ total: number }>();
    const { results } = await env.DB.prepare(
      `SELECT s.*, (SELECT COUNT(*) FROM episodes e WHERE e.series_id = s.id) AS episode_count
         FROM series s
         ${clause}
         ORDER BY s.category ASC, s.sort ASC, s.id DESC
         LIMIT ? OFFSET ?`,
    )
      .bind(...args, pageSize, offset)
      .all<Row>();
    return {
      items: (results ?? []).map((row) => ({
        ...def.toJson(row, origin),
        episodeCount: Number(row.episode_count ?? 0),
      })),
      total: Number(totalRow?.total ?? 0),
      page,
      pageSize,
    };
  }

  const where: string[] = [];
  const args: SqlValue[] = [];
  if (keyword) {
    where.push(
      `(instr(lower(e.title), ?) > 0
        OR instr(lower(COALESCE(e.summary, '')), ?) > 0
        OR instr(lower(COALESCE(e.speaker, '')), ?) > 0
        OR instr(lower(COALESCE(s.title, '')), ?) > 0)`,
    );
    args.push(keyword, keyword, keyword, keyword);
  }
  const seriesId = Number(query.seriesId);
  if (Number.isInteger(seriesId) && seriesId > 0) {
    where.push('e.series_id = ?');
    args.push(seriesId);
  }
  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const totalRow = await env.DB.prepare(
    `SELECT COUNT(*) AS total
       FROM episodes e
       LEFT JOIN series s ON s.id = e.series_id
       ${clause}`,
  )
    .bind(...args)
    .first<{ total: number }>();
  const { results } = await env.DB.prepare(
    `SELECT e.*, s.title AS series_title
       FROM episodes e
       LEFT JOIN series s ON s.id = e.series_id
       ${clause}
       ORDER BY e.series_id ASC, e.sort ASC, e.id ASC
       LIMIT ? OFFSET ?`,
  )
    .bind(...args, pageSize, offset)
    .all<Row>();
  return {
    items: (results ?? []).map((row) => ({
      ...def.toJson(row, origin),
      seriesTitle: row.series_title ?? null,
    })),
    total: Number(totalRow?.total ?? 0),
    page,
    pageSize,
  };
}

export async function listAll(env: Env, origin: string): Promise<Row> {
  const output: Row = {};
  for (const [name, def] of Object.entries(collections)) {
    // 单集可能上千条，只走 listPage；这里整包下发会又慢又占内存。
    // 系列只有几十个，而且编辑单集时下拉框要用，继续整包带着。
    if (name === 'episodes') continue;
    const { results } = await env.DB.prepare(
      `SELECT * FROM ${def.table} ORDER BY ${def.order}`,
    ).all<Row>();
    const rows = (results ?? []).map((row) => def.toJson(row, origin));
    output[name] = def.single ? (rows[0] ?? null) : rows;
  }
  // 栏目上的「系列 6 / 单集 3」用总数显示，不用为了数字把全部内容读出来
  const totals: Row = {};
  for (const [name, def] of Object.entries(collections)) {
    const row = await env.DB.prepare(
      `SELECT COUNT(*) AS total FROM ${def.table}`,
    ).first<{ total: number }>();
    totals[name] = Number(row?.total ?? 0);
  }
  output._totals = totals;
  return output;
}

/** 单集不能挂在不存在的系列上（系列刚被删掉、或者请求是手改的） */
async function requireSeries(env: Env, seriesId: SqlValue): Promise<void> {
  const row = await env.DB.prepare('SELECT id FROM series WHERE id = ?')
    .bind(seriesId)
    .first<{ id: number }>();
  if (!row) throw new Error('这个系列不存在，可能已经被删掉了');
}

export async function createItem(
  env: Env,
  name: string,
  body: Row,
): Promise<boolean> {
  const def = collections[name]!;
  const values = def.parse(body);
  if (name === 'episodes') await requireSeries(env, values.series_id);
  if (name === 'home' && !Number(values.sort ?? 0)) {
    // 新卡片默认排在最后，不会被插到已经调好顺序的卡片中间
    const last = await env.DB.prepare(
      'SELECT COALESCE(MAX(sort), 0) AS total FROM home_cards',
    ).first<{ total: number }>();
    values.sort = Number(last?.total ?? 0) + 10;
  }
  const columns = Object.keys(values);
  if (def.single) {
    const sql = `INSERT OR REPLACE INTO ${def.table} (id, ${columns.join(', ')})
       VALUES (1, ${columns.map(() => '?').join(', ')})`;
    await env.DB.prepare(sql)
      .bind(...columns.map((column) => values[column]!))
      .run();
    return true;
  }
  const sql = `INSERT INTO ${def.table} (${columns.join(', ')})
     VALUES (${columns.map(() => '?').join(', ')})`;
  await env.DB.prepare(sql)
    .bind(...columns.map((column) => values[column]!))
    .run();
  return true;
}

export async function updateItem(
  env: Env,
  name: string,
  id: number,
  body: Row,
): Promise<boolean> {
  const def = collections[name]!;
  const values = def.parse(body);
  if (name === 'episodes') await requireSeries(env, values.series_id);
  const columns = Object.keys(values);
  const sql = `UPDATE ${def.table} SET ${columns
    .map((column) => `${column} = ?`)
    .join(', ')} WHERE id = ?`;
  const result = await env.DB.prepare(sql)
    .bind(...columns.map((column) => values[column]!), id)
    .run();
  return Boolean(result.success);
}

export async function deleteItem(
  env: Env,
  name: string,
  id: number,
): Promise<void> {
  const def = collections[name]!;
  const statements = [];
  // 删系列时把下面的单集一起删掉，不然会留下永远看不到的孤儿单集。
  if (name === 'series') {
    statements.push(
      env.DB.prepare('DELETE FROM episodes WHERE series_id = ?').bind(id),
    );
  }
  statements.push(
    env.DB.prepare(`DELETE FROM ${def.table} WHERE id = ?`).bind(id),
  );
  await env.DB.batch(statements);
}

/** 首页卡片上移 / 下移：按传入的 id 顺序重排 */
export async function reorderHomeCards(
  env: Env,
  ids: unknown[],
): Promise<number> {
  const clean = cleanIds(ids);
  if (!clean.length) throw new Error('没有卡片');
  const statements = clean.map((id, index) =>
    env.DB.prepare('UPDATE home_cards SET sort = ? WHERE id = ?').bind(
      (index + 1) * 10,
      id,
    ),
  );
  await env.DB.batch(statements);
  return clean.length;
}

/** 后台一次最多勾选这么多条，防止误操作或请求过大 */
export const MAX_BULK_ITEMS = 200;

function cleanIds(ids: unknown[]): number[] {
  const unique = new Set<number>();
  for (const value of ids) {
    const id = Number(value);
    if (Number.isInteger(id) && id > 0) unique.add(id);
    if (unique.size >= MAX_BULK_ITEMS) break;
  }
  return [...unique];
}

/** 批量删除；返回实际删掉的条数 */
export async function bulkDeleteItems(
  env: Env,
  name: string,
  ids: unknown[],
): Promise<number> {
  const def = collections[name]!;
  const clean = cleanIds(ids);
  if (!clean.length) return 0;
  const marks = clean.map(() => '?').join(', ');
  const statements = [];
  if (name === 'series') {
    statements.push(
      env.DB.prepare(`DELETE FROM episodes WHERE series_id IN (${marks})`).bind(
        ...clean,
      ),
    );
  }
  statements.push(
    env.DB.prepare(`DELETE FROM ${def.table} WHERE id IN (${marks})`).bind(
      ...clean,
    ),
  );
  await env.DB.batch(statements);
  return clean.length;
}

/** 批量发布 / 隐藏；只有带发布状态的栏目能用 */
export async function bulkSetPublished(
  env: Env,
  name: string,
  ids: unknown[],
  published: boolean,
): Promise<number> {
  const def = collections[name]!;
  if (!def.publishColumn) throw new Error('这类内容没有发布状态');
  const clean = cleanIds(ids);
  if (!clean.length) return 0;
  const marks = clean.map(() => '?').join(', ');
  await env.DB.prepare(
    `UPDATE ${def.table} SET ${def.publishColumn} = ? WHERE id IN (${marks})`,
  )
    .bind(published ? 1 : 0, ...clean)
    .run();
  return clean.length;
}
