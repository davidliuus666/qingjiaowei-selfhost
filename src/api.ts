import { absolute, durationLabel, nextWeeklyOccurrence, trimmed } from './util';

/** 线上聚会提前多少分钟可以拿到 Zoom 链接 */
export const ONLINE_EARLY_MINUTES = 20;
/** 聚会结束后多少分钟关闭链接 */
export const ONLINE_LATE_MINUTES = 30;

export type MeetingMode = 'offline' | 'online' | 'hybrid';

export interface MeetingRow {
  id: number;
  topic: string;
  scripture: string | null;
  leader: string | null;
  place: string | null;
  cover_url?: string | null;
  starts_at: string;
  ends_at: string | null;
  is_online: number;
  online_url: string | null;
  online_override: number;
  mode?: string | null;
  repeat_weekly?: number | null;
  weekday?: number | null;
  start_time?: string | null;
  end_time?: string | null;
}

export type OnlineStatus = 'open' | 'before' | 'after' | 'off';

export interface MeetingView {
  id: number;
  topic: string;
  scripture: string | null;
  leader: string | null;
  place: string | null;
  coverUrl: string | null;
  mode: MeetingMode;
  startsAt: string;
  endsAt: string | null;
  repeatWeekly: boolean;
  weekday: number | null;
  startTime: string | null;
  endTime: string | null;
  isOnline: boolean;
  onlineStatus: OnlineStatus;
  onlineUrl: string | null;
  onlineOpensAt: string | null;
  onlineClosesAt: string | null;
  onlineNote: string | null;
}

/** 聚会方式。老数据没有 mode 字段，就按原来的「线上开关 + 地址」推出来 */
export function meetingMode(row: MeetingRow): MeetingMode {
  if (row.mode === 'offline' || row.mode === 'online' || row.mode === 'hybrid') {
    return row.mode;
  }
  if (row.is_online === 1) return row.place ? 'hybrid' : 'online';
  return 'offline';
}

/**
 * 这一次聚会的实际起止时间。
 * 每周重复的场次不存死日期，而是按「周几 + 起止时间」实时算下一次，
 * 后台设一次就能一直用，也不会因为日期过期变成过去的事。
 */
export function meetingOccurrence(
  row: MeetingRow,
  now = Date.now(),
): { start: number; end: number } | null {
  if (
    row.repeat_weekly === 1 &&
    row.weekday &&
    row.start_time &&
    row.end_time
  ) {
    return nextWeeklyOccurrence(row.weekday, row.start_time, row.end_time, now);
  }
  const start = Date.parse(row.starts_at);
  if (!Number.isFinite(start)) return null;
  const parsedEnd = row.ends_at ? Date.parse(row.ends_at) : NaN;
  const end = Number.isFinite(parsedEnd)
    ? parsedEnd
    : start + 2 * 60 * 60 * 1000;
  return { start, end };
}

/**
 * 线上链接只在窗口内返回：开始前 20 分钟～结束后 30 分钟。
 * 窗口外这个字段直接是 null，接口里根本拿不到链接。
 * 带领人可以在后台打开「手动开放」跳过时间判断（聚会时间临时改了也能用）。
 */
export function meetingView(
  row: MeetingRow | null,
  now = Date.now(),
  origin = '',
): MeetingView | null {
  if (!row) return null;
  const occurrence = meetingOccurrence(row, now);
  if (!occurrence) return null;

  const { start: startsAt, end: endsAt } = occurrence;
  const opensAt = startsAt - ONLINE_EARLY_MINUTES * 60_000;
  const closesAt = endsAt + ONLINE_LATE_MINUTES * 60_000;
  const mode = meetingMode(row);

  const hasLink = Boolean(row.online_url) && mode !== 'offline';
  let status: OnlineStatus = 'off';
  if (hasLink) {
    if (row.online_override === 1) status = 'open';
    else if (now < opensAt) status = 'before';
    else if (now > closesAt) status = 'after';
    else status = 'open';
  }

  return {
    id: row.id,
    topic: row.topic,
    scripture: row.scripture,
    leader: row.leader,
    // 纯线上没有线下地址，老数据里残留的地址也不往外发
    place: mode === 'online' ? null : row.place,
    // 首页「参加聚会」卡片的背景图，后台没传就是 null（App 用纯色渐变）
    coverUrl: absolute(origin, row.cover_url ?? null),
    mode,
    startsAt: new Date(startsAt).toISOString(),
    endsAt: new Date(endsAt).toISOString(),
    repeatWeekly: row.repeat_weekly === 1,
    weekday: row.weekday ?? null,
    startTime: row.start_time ?? null,
    endTime: row.end_time ?? null,
    isOnline: mode !== 'offline',
    onlineStatus: status,
    onlineUrl: status === 'open' ? row.online_url : null,
    onlineOpensAt: hasLink ? new Date(opensAt).toISOString() : null,
    onlineClosesAt: hasLink ? new Date(closesAt).toISOString() : null,
    onlineNote: hasLink
      ? `开始前 ${ONLINE_EARLY_MINUTES} 分钟可以进来，聚会结束后会关闭`
      : null,
  };
}

export async function loadCurrentMeeting(
  db: D1Database,
  now = Date.now(),
  origin = '',
): Promise<MeetingView | null> {
  const { results } = await db.prepare('SELECT * FROM meetings').all<MeetingRow>();
  let ongoing: { row: MeetingRow; start: number; end: number } | null = null;
  let latest: { row: MeetingRow; start: number } | null = null;
  for (const row of results ?? []) {
    const occurrence = meetingOccurrence(row, now);
    if (!occurrence) continue;
    // 优先：还没结束的最近一次；否则：历史上最近的一次
    if (
      occurrence.end >= now &&
      (!ongoing || occurrence.start < ongoing.start)
    ) {
      ongoing = { row, ...occurrence };
    }
    if (!latest || occurrence.start > latest.start) {
      latest = { row, start: occurrence.start };
    }
  }
  const chosen = ongoing ?? latest;
  return chosen ? meetingView(chosen.row, now, origin) : null;
}

/** 全部聚会，顺序跟后台列表一致：每周重复的在前，再按最近一次时间。 */
export async function loadMeetings(
  db: D1Database,
  now = Date.now(),
  origin = '',
): Promise<MeetingView[]> {
  const { results } = await db
    .prepare(
      'SELECT * FROM meetings ORDER BY repeat_weekly DESC, starts_at ASC, id ASC',
    )
    .all<MeetingRow>();
  return (results ?? [])
    .map((row) => meetingView(row, now, origin))
    .filter((item): item is MeetingView => item !== null);
}

/** 指定一场聚会；App 从首页卡片点进来时用 */
export async function loadMeeting(
  db: D1Database,
  id: number,
  now = Date.now(),
  origin = '',
): Promise<MeetingView | null> {
  const row = await db
    .prepare('SELECT * FROM meetings WHERE id = ?')
    .bind(id)
    .first<MeetingRow>();
  return meetingView(row ?? null, now, origin);
}

interface HomeCardRow {
  id: number;
  kind: string;
  ref_id: number | null;
  title: string | null;
  cover_url: string | null;
  sort: number;
}

export interface HomeCardView {
  id: number;
  kind: 'meeting' | 'announcement';
  title: string;
  coverUrl: string | null;
  meeting?: MeetingView;
  announcement?: Record<string, unknown>;
}

/**
 * 首页轮播下面的卡片。后台没配过卡片时返回空数组，App 继续用原来的
 * 「最近一场聚会 + 最新公告」兜底，不会突然变成空白首页。
 */
export async function loadHomeCards(
  db: D1Database,
  now = Date.now(),
  origin = '',
): Promise<HomeCardView[]> {
  const { results } = await db
    .prepare('SELECT * FROM home_cards ORDER BY sort ASC, id ASC')
    .all<HomeCardRow>();
  if (!results?.length) return [];

  const meetingList = await loadMeetings(db, now, origin);
  const meetings = new Map(meetingList.map((item) => [item.id, item]));
  const { results: announcementRows } = await db
    .prepare(
      `SELECT id, title, summary, cover_url, published_at
         FROM announcements WHERE is_published = 1`,
    )
    .all<{
      id: number;
      title: string;
      summary: string | null;
      cover_url: string | null;
      published_at: string;
    }>();
  const announcements = new Map(
    (announcementRows ?? []).map((row) => [
      row.id,
      {
        id: row.id,
        title: row.title,
        summary: row.summary,
        date: row.published_at,
        coverUrl: absolute(origin, row.cover_url),
      },
    ]),
  );

  const cards: HomeCardView[] = [];
  for (const row of results) {
    const refId = Number(row.ref_id);
    if (row.kind === 'meeting') {
      const meeting = meetings.get(refId);
      if (!meeting) continue;
      cards.push({
        id: row.id,
        kind: 'meeting',
        // 后台可以改卡片标题；留空就用固定文案
        title: trimmed(row.title) ?? '参加聚会',
        coverUrl: absolute(origin, row.cover_url) ?? meeting.coverUrl,
        meeting,
      });
      continue;
    }
    if (row.kind === 'announcement') {
      const announcement = announcements.get(refId);
      if (!announcement) continue;
      cards.push({
        id: row.id,
        kind: 'announcement',
        title: trimmed(row.title) ?? String(announcement.title),
        coverUrl:
          absolute(origin, row.cover_url) ??
          (announcement.coverUrl as string | null),
        announcement,
      });
    }
  }
  return cards;
}

export async function loadSlides(
  db: D1Database,
  origin: string,
): Promise<Array<{ id: number; imageUrl: string | null; linkUrl: string | null }>> {
  const { results } = await db
    .prepare('SELECT * FROM slides WHERE published = 1 ORDER BY sort ASC, id ASC')
    .all<{ id: number; image_url: string; link_url: string | null }>();
  return (results ?? []).map((row) => ({
    id: row.id,
    imageUrl: absolute(origin, row.image_url),
    linkUrl: row.link_url,
  }));
}

export async function loadLatestAnnouncement(
  db: D1Database,
  origin: string,
): Promise<Record<string, unknown> | null> {
  const row = await db
    .prepare(
      'SELECT * FROM announcements WHERE is_published = 1 ORDER BY published_at DESC LIMIT 1',
    )
    .first<{
      id: number;
      title: string;
      summary: string | null;
      body: string;
      cover_url: string | null;
      published_at: string;
    }>();
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    date: row.published_at,
    coverUrl: absolute(origin, row.cover_url),
  };
}

export async function loadAnnouncement(
  db: D1Database,
  origin: string,
  id: number,
): Promise<Record<string, unknown> | null> {
  const row = await db
    .prepare('SELECT * FROM announcements WHERE id = ? AND is_published = 1')
    .bind(id)
    .first<{
      id: number;
      title: string;
      summary: string | null;
      body: string;
      cover_url: string | null;
      published_at: string;
    }>();
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    date: row.published_at,
    coverUrl: absolute(origin, row.cover_url),
    paragraphs: (trimmed(row.body, 8000) ?? '')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0),
  };
}

/** 一页最多多少条，防止有人手动改请求参数一次拉几千条 */
export const MAX_PAGE_SIZE = 100;

/** 把 App 传来的 limit / offset 收成安全的整数；没传 limit 表示要全部（老版本兼容） */
export function pageWindow(
  rawLimit: string | null | undefined,
  rawOffset: string | null | undefined,
): { limit: number | null; offset: number } {
  const parsedLimit = Number(rawLimit);
  const limit =
    Number.isFinite(parsedLimit) && parsedLimit > 0
      ? Math.min(MAX_PAGE_SIZE, Math.trunc(parsedLimit))
      : null;
  const parsedOffset = Number(rawOffset);
  const offset =
    Number.isFinite(parsedOffset) && parsedOffset > 0
      ? Math.trunc(parsedOffset)
      : 0;
  return { limit, offset };
}

export async function loadSeriesList(
  db: D1Database,
  origin: string,
  category?: string | null,
  limit: number | null = null,
  offset = 0,
): Promise<Array<Record<string, unknown>>> {
  // 普通、特别、生命河各自排序：先按分类分组，再按分类里的 sort
  const filter =
    category === 'sermon' || category === 'study' || category === 'rolcc'
      ? category
      : null;
  const paged = limit != null;
  const statement = db.prepare(
    `SELECT s.*, (SELECT COUNT(*) FROM episodes e WHERE e.series_id = s.id) AS episode_count
       FROM series s
       ${filter ? 'WHERE s.category = ?' : ''}
       ORDER BY s.category ASC, s.sort ASC, s.id DESC
       ${paged ? 'LIMIT ? OFFSET ?' : ''}`,
  );
  const bindings: Array<string | number> = [];
  if (filter) bindings.push(filter);
  if (paged) bindings.push(limit as number, offset);
  const { results } = await statement
    .bind(...bindings)
    .all<{
      id: number;
      title: string;
      subtitle: string | null;
      cover_url: string | null;
      mark: string | null;
      category: string;
      episode_count: number;
    }>();
  return (results ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    mark: row.mark,
    coverUrl: absolute(origin, row.cover_url),
    category: row.category,
    episodeCount: row.episode_count,
  }));
}

export function episodeJson(
  row: {
    id: number;
    series_id: number | null;
    title: string;
    episode_no: number | null;
    speaker: string | null;
    duration: string | null;
    summary: string | null;
    media_type: string;
    media_url: string | null;
    resource_url: string | null;
    cover_url: string | null;
    published_at: string | null;
  },
  seriesTitle: string | null,
  origin: string,
  seriesCoverPath: string | null = null,
): Record<string, unknown> {
  return {
    id: row.id,
    seriesId: row.series_id,
    seriesTitle,
    // 单集详情页顶部用系列封面；单集自己没封面时由前端决定怎么退化
    seriesCoverUrl: absolute(origin, seriesCoverPath),
    title: row.title,
    episodeNo: row.episode_no,
    speaker: row.speaker,
    duration: durationLabel(row.duration),
    summary: row.summary,
    mediaType: row.media_type,
    mediaUrl: row.media_url,
    resourceUrl: row.resource_url,
    coverUrl: absolute(origin, row.cover_url),
    publishedAt: row.published_at,
  };
}

export async function loadSeriesDetail(
  db: D1Database,
  origin: string,
  id: number,
  limit: number | null = null,
  offset = 0,
): Promise<Record<string, unknown> | null> {
  const series = await db
    .prepare('SELECT * FROM series WHERE id = ?')
    .bind(id)
    .first<{
      id: number;
      title: string;
      subtitle: string | null;
      cover_url: string | null;
      mark: string | null;
      category: string;
    }>();
  if (!series) return null;
  const totalRow = await db
    .prepare('SELECT COUNT(*) AS total FROM episodes WHERE series_id = ?')
    .bind(id)
    .first<{ total: number }>();
  const episodeTotal = Number(totalRow?.total ?? 0);
  const paged = limit != null;
  const { results } = await db
    .prepare(
      `SELECT * FROM episodes WHERE series_id = ? ORDER BY sort ASC, id ASC
       ${paged ? 'LIMIT ? OFFSET ?' : ''}`,
    )
    .bind(...(paged ? [id, limit as number, offset] : [id]))
    .all<Parameters<typeof episodeJson>[0]>();
  const episodes = (results ?? []).map((row) =>
    episodeJson(row, series.title, origin, series.cover_url),
  );
  return {
    id: series.id,
    title: series.title,
    subtitle: series.subtitle,
    mark: series.mark,
    coverUrl: absolute(origin, series.cover_url),
    category: series.category,
    episodeTotal,
    episodes,
    hasMore: paged ? offset + episodes.length < episodeTotal : false,
  };
}

/**
 * App 里的搜索：公告、系列、单集各查各的，返回给前端分组显示。
 * 用 instr(lower(...)) 而不是 LIKE，这样用户输入 % 或 _ 也会按普通字符搜。
 */
export async function searchAll(
  db: D1Database,
  origin: string,
  rawQuery: string,
  limit = 20,
): Promise<Record<string, unknown>> {
  const query = trimmed(rawQuery, 60) ?? '';
  if (!query) {
    return { query: '', announcements: [], series: [], episodes: [] };
  }

  const [announcementResult, seriesResult, episodeResult] = await Promise.all([
    db
      .prepare(
        `SELECT id, title, summary, cover_url, published_at
           FROM announcements
          WHERE is_published = 1
            AND (instr(lower(title), lower(?)) > 0
              OR instr(lower(COALESCE(summary, '')), lower(?)) > 0
              OR instr(lower(body), lower(?)) > 0)
          ORDER BY published_at DESC, id DESC
          LIMIT ?`,
      )
      .bind(query, query, query, limit)
      .all<{
        id: number;
        title: string;
        summary: string | null;
        cover_url: string | null;
        published_at: string;
      }>(),
    db
      .prepare(
        `SELECT s.id, s.title, s.subtitle, s.cover_url, s.mark, s.category,
                (SELECT COUNT(*) FROM episodes e WHERE e.series_id = s.id) AS episode_count
           FROM series s
          WHERE instr(lower(s.title), lower(?)) > 0
             OR instr(lower(COALESCE(s.subtitle, '')), lower(?)) > 0
          ORDER BY s.category ASC, s.sort ASC, s.id DESC
          LIMIT ?`,
      )
      .bind(query, query, limit)
      .all<{
        id: number;
        title: string;
        subtitle: string | null;
        cover_url: string | null;
        mark: string | null;
        category: string;
        episode_count: number;
      }>(),
    db
      .prepare(
        `SELECT e.id, e.series_id, e.title, e.episode_no, e.speaker, e.duration,
                e.summary, e.media_type, e.media_url, e.resource_url,
                e.cover_url, e.published_at,
                s.title AS series_title, s.cover_url AS series_cover_url
           FROM episodes e
           LEFT JOIN series s ON s.id = e.series_id
          WHERE instr(lower(e.title), lower(?)) > 0
             OR instr(lower(COALESCE(e.summary, '')), lower(?)) > 0
             OR instr(lower(COALESCE(e.speaker, '')), lower(?)) > 0
             OR instr(lower(COALESCE(s.title, '')), lower(?)) > 0
          ORDER BY e.published_at DESC, e.id DESC
          LIMIT ?`,
      )
      .bind(query, query, query, query, limit)
      .all<
        Parameters<typeof episodeJson>[0] & {
          series_title: string | null;
          series_cover_url: string | null;
        }
      >(),
  ]);

  return {
    query,
    announcements: (announcementResult.results ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      summary: row.summary,
      date: row.published_at,
      coverUrl: absolute(origin, row.cover_url),
    })),
    series: (seriesResult.results ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      mark: row.mark,
      coverUrl: absolute(origin, row.cover_url),
      category: row.category,
      episodeCount: row.episode_count,
    })),
    episodes: (episodeResult.results ?? []).map((row) =>
      episodeJson(row, row.series_title, origin, row.series_cover_url),
    ),
  };
}

export async function loadEpisode(
  db: D1Database,
  origin: string,
  id: number,
): Promise<Record<string, unknown> | null> {
  const row = await db
    .prepare('SELECT * FROM episodes WHERE id = ?')
    .bind(id)
    .first<Parameters<typeof episodeJson>[0]>();
  if (!row) return null;
  let seriesTitle: string | null = null;
  let seriesCover: string | null = null;
  if (row.series_id) {
    const series = await db
      .prepare('SELECT title, cover_url FROM series WHERE id = ?')
      .bind(row.series_id)
      .first<{ title: string; cover_url: string | null }>();
    seriesTitle = series?.title ?? null;
    seriesCover = series?.cover_url ?? null;
  }
  return episodeJson(row, seriesTitle, origin, seriesCover);
}
