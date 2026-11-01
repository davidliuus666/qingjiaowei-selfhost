import { Hono } from 'hono';

import {
  bulkDeleteItems,
  bulkSetPublished,
  createItem,
  deleteItem,
  isCollection,
  listAll,
  listPage,
  MAX_BULK_ITEMS,
  reorderHomeCards,
  updateItem,
} from './admin';
import { ADMIN_PAGE_HTML } from './admin_page';
import { CLASSROOM_PAGE_HTML } from './classroom_page';
import {
  createInvite,
  joinWithInvite,
  listDevices,
  readBearerToken,
  revokeAllDevices,
  revokeDevice,
  revokeDeviceByToken,
  revokeInvite,
  verifyDeviceToken,
} from './devices';
import { LOGO_WEBP_BASE64 } from './logo';
import {
  createHomework,
  deleteHomework,
  getHomeworkForAdmin,
  getHomeworkForDevice,
  getHomeworkSubmissionForAdmin,
  gradeHomeworkSubmission,
  listHomeworksForAdmin,
  listHomeworksForDevice,
  submitHomework,
  updateHomework,
} from './homework';
import {
  createNotice,
  deleteNotice,
  listNoticesForAdmin,
  listNoticesForDevice,
  loadNoticeForDevice,
  updateNotice,
} from './notices';
import {
  loadAnnouncement,
  loadCurrentMeeting,
  loadEpisode,
  loadHomeCards,
  loadLatestAnnouncement,
  loadMeeting,
  loadMeetings,
  loadSeriesDetail,
  loadSeriesList,
  loadSlides,
  pageWindow,
  searchAll,
} from './api';
import { updatesFeed } from './updates';
import {
  claimAdminPassword,
  clearSessionCookie,
  createSession,
  hasPasswordConfigured,
  isValidSession,
  loginAllowed,
  passwordProblem,
  readSessionCookie,
  recordLoginAttempt,
  revokeAllSessions,
  sessionCookie,
  setAdminPassword,
  verifyPassword,
} from './auth';
import {
  createQuiz,
  deleteQuiz,
  deleteSubmission,
  getQuizForAdmin,
  getQuizForDevice,
  getSubmissionForAdmin,
  gradeSubmission,
  listQuizzesForAdmin,
  listQuizzesForDevice,
  lockQuiz,
  restartQuiz,
  saveProgress,
  submitQuiz,
  unlockSubmission,
  updateQuiz,
} from './quiz';
import {
  getRolccStatus,
  isRolccEnabled,
  setRolccEnabled,
  syncRolcc,
} from './rolcc';
import { ensureSchema, seedIfEmpty } from './schema';
import {
  apiError,
  apiJson,
  extensionFor,
  htmlResponse,
  intId,
  jsonResponse,
  mediaHeaders,
  parseOrigins,
  publicOrigin,
  randomKey,
  readJson,
  readUpload,
  sniffType,
  trimmed,
  type Env,
} from './util';

type AppEnv = {
  Bindings: Env;
  Variables: { deviceId: number; deviceName: string };
};

const app = new Hono<AppEnv>();

// Logo 直接打包进 Worker：不依赖 R2，后台页面和 favicon 都能用
const LOGO_BYTES = Uint8Array.from(atob(LOGO_WEBP_BASE64), (char) =>
  char.charCodeAt(0),
);

app.get('/logo.webp', () =>
  new Response(LOGO_BYTES, {
    headers: {
      'content-type': 'image/webp',
      'cache-control': 'public, max-age=86400',
    },
  }),
);

/**
 * 公开读接口允许跨域：网页版 App（Flutter Web）要读同一份数据。
 * 只放开 /api 和 /media 的读取与加入请求；/admin 下的写接口仍然只认同源。
 */
const PUBLIC_CORS: Record<string, string> = {
  'access-control-allow-origin': '*',
  // 网页版 App 也要能扫码加入、退出时注销设备，所以 POST 不能少
  'access-control-allow-methods': 'GET, HEAD, POST, OPTIONS',
  'access-control-allow-headers':
    'authorization, content-type, range, if-none-match, if-modified-since',
  'access-control-expose-headers': 'content-length, content-range, accept-ranges, etag',
  'access-control-max-age': '86400',
};

for (const path of ['/api/*', '/media/*']) {
  app.use(path, async (c, next) => {
    if (c.req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: PUBLIC_CORS });
    }
    await next();
    for (const [key, value] of Object.entries(PUBLIC_CORS)) {
      c.header(key, value);
    }
  });
}

function requestOrigin(request: Request): string {
  return new URL(request.url).origin;
}

function clientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for') ??
    'unknown'
  );
}

/** 设置页/登录页的语言：?lang= > cookie > Accept-Language；默认中文。 */
function requestedLang(request: Request): 'zh' | 'en' {
  const url = new URL(request.url);
  const query = url.searchParams.get('lang');
  if (query === 'en' || query === 'zh') return query;
  const cookie = request.headers.get('cookie') ?? '';
  for (const part of cookie.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    const value = rest.join('=');
    if (name === 'qjw_lang' && (value === 'en' || value === 'zh')) {
      return value;
    }
  }
  const accept = (request.headers.get('accept-language') ?? '').toLowerCase();
  return accept.startsWith('en') ? 'en' : 'zh';
}

function localize(request: Request, zh: string, en: string): string {
  return requestedLang(request) === 'en' ? en : zh;
}

/** App 用 Authorization 头；网页图片不能加头时，允许 access_token 查询参数 */
function requestDeviceToken(request: Request): string | null {
  return (
    readBearerToken(request) ??
    new URL(request.url).searchParams.get('access_token')
  );
}

// 小组内容接口：除了健康检查和加入接口，全部要设备通行证。
app.use('/api/*', async (c, next) => {
  if (
    c.req.path === '/api/health' ||
    c.req.path === '/api/join' ||
    c.req.path.startsWith('/api/public/')
  ) {
    return next();
  }
  const token = requestDeviceToken(c.req.raw);
  const device = token ? await verifyDeviceToken(c.env, token) : null;
  if (!device) return apiError('请先加入小组', 401);
  c.set('deviceId', device.id);
  c.set('deviceName', device.name);
  return next();
});

// 媒体文件也要通行证；后台页面用管理员 Cookie 预览图片。
app.use('/media/*', async (c, next) => {
  const token = requestDeviceToken(c.req.raw);
  const device = token
    ? await verifyDeviceToken(c.env, token, false)
    : null;
  if (!device) {
    const admin = await safe(
      () => isValidSession(c.env, readSessionCookie(c.req.raw)),
      false,
    );
    if (!admin) return new Response('请先加入小组', { status: 401 });
  }
  return next();
});

/** 写操作必须是同源请求，挡住 CSRF；除了请求本身的地址，也接受 PUBLIC_ORIGINS 里配的 */
function isSameOrigin(request: Request, env: Env): boolean {
  if (request.headers.get('sec-fetch-site') === 'cross-site') return false;
  const origin = request.headers.get('origin');
  if (!origin) return true;
  const normalized = origin.replace(/\/+$/, '');
  if (normalized === requestOrigin(request)) return true;
  return parseOrigins(env.PUBLIC_ORIGINS).allowed.includes(normalized);
}

/** 数据库出错时不返回 500，而是按「没有内容」处理（表还没建的情况） */
async function safe<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (error) {
    console.error('query failed', error);
    return fallback;
  }
}

async function isInitialized(env: Env): Promise<boolean> {
  return safe(async () => {
    const row = await env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'group_info'",
    ).first();
    return Boolean(row);
  }, false);
}

async function requireAdmin(
  request: Request,
  env: Env,
): Promise<Response | null> {
  if (!isSameOrigin(request, env)) return apiError('来源不合法', 403);
  const cookie = readSessionCookie(request);
  if (!(await isValidSession(env, cookie))) return apiError('请先登录', 401);
  return null;
}

// ---------------------------------------------------------------- 公开读接口

app.get('/api/health', async (c) =>
  apiJson({ ok: true, initialized: await isInitialized(c.env) }),
);

// 官网门面用的公开数据：只给小组介绍、聚会时间、公开讲道和公告。
// 线上链接、详细地址、祷告、课堂、成绩这些不在这里出现。
app.get('/api/public/site', async (c) => {
  const origin = publicOrigin(c.req.raw, c.env);
  const group = await safe(
    () =>
      c.env.DB.prepare(
        'SELECT name, intro, leader FROM group_info WHERE id = 1',
      ).first<{ name: string; intro: string | null; leader: string | null }>(),
    null,
  );
  const meeting = await safe(
    () => loadCurrentMeeting(c.env.DB, Date.now(), origin),
    null,
  );
  const announcement = await safe(
    () => loadLatestAnnouncement(c.env.DB, origin),
    null,
  );
  const series = await safe(
    () => loadSeriesList(c.env.DB, origin, null, 8, 0),
    [] as Awaited<ReturnType<typeof loadSeriesList>>,
  );
  const stats = await safe(async () => {
    const seriesRow = await c.env.DB.prepare(
      'SELECT COUNT(*) AS n FROM series',
    ).first<{ n: number }>();
    const episodeRow = await c.env.DB.prepare(
      'SELECT COUNT(*) AS n FROM episodes',
    ).first<{ n: number }>();
    return {
      series: Number(seriesRow?.n ?? 0),
      episodes: Number(episodeRow?.n ?? 0),
    };
  }, { series: 0, episodes: 0 });
  // 轻量版没有 R2：官网安装包不从这里出，直接跳过。
  const apk = c.env.FILES
    ? await safe(
        () => c.env.FILES!.head('downloads/qingjiaowei-latest.apk'),
        null,
      )
    : null;

  return apiJson({
    group: group
      ? { name: group.name, intro: group.intro, leader: group.leader }
      : null,
    meeting: meeting
      ? {
          ...meeting,
          // 官网不公开 Zoom 链接和具体门牌地址
          onlineUrl: null,
          onlineNote: null,
          place: meeting.mode === 'online' ? null : '线下聚会',
          coverUrl: publicCoverUrl(origin, meeting.coverUrl),
        }
      : null,
    announcement: announcement
      ? {
          ...announcement,
          coverUrl: publicCoverUrl(origin, announcement.coverUrl),
        }
      : null,
    series: series.map((item) => ({
      ...item,
      coverUrl: publicCoverUrl(origin, item.coverUrl),
    })),
    stats,
    // 安装包还没上传时不要给出下载地址：官网会显示「安装包准备中」，
    // 否则按钮和二维码都指向一个 404 的地址。
    app: apk
      ? {
          version: '1.0.0',
          downloadUrl: `${origin}/download/app.apk`,
          fileName: 'qingjiaowei.apk',
          size: apk.size ?? null,
          updatedAt: apk.uploaded?.toISOString() ?? null,
        }
      : null,
  });
});

// 安卓安装包：放在 R2 的 downloads/qingjiaowei-latest.apk。
// 自部署轻量版没有 R2，这个地址不可用；安装包统一走官网发布后台。
app.get('/download/app.apk', async (c) => {
  const files = c.env.FILES;
  if (!files) return new Response('这个版本没有开启文件存储', { status: 404 });
  const object = await files.get('downloads/qingjiaowei-latest.apk');
  if (!object) return new Response('安装包还没上传', { status: 404 });
  return new Response(object.body, {
    headers: {
      'content-type': 'application/vnd.android.package-archive',
      'content-disposition': 'attachment; filename="qingjiaowei.apk"',
      'content-length': String(object.size),
      'cache-control': 'public, max-age=300',
    },
  });
});

// 用小组二维码换设备通行证。App 扫码后带着这里返回的 token 读内容。
app.post('/api/join', async (c) => {
  const body = await readJson(c.req.raw);
  const invite = trimmed(body?.invite, 200);
  if (!invite) return apiError('没有读到二维码');
  await ensureSchema(c.env.DB);
  const result = await joinWithInvite(
    c.env,
    invite,
    trimmed(body?.deviceName, 80) ?? '新设备',
  );
  if ('error' in result) return apiError(result.error, 401);
  return apiJson({
    token: result.token,
    groupName: result.groupName,
    deviceName: result.deviceName,
    themeMode: result.themeMode,
  });
});

app.get('/api/session', async (c) => {
  const token = requestDeviceToken(c.req.raw);
  if (!token) return apiError('请先加入小组', 401);
  const device = await verifyDeviceToken(c.env, token, false);
  if (!device) return apiError('请先加入小组', 401);
  // 老库可能还没加 theme_mode 列，先按新结构读，失败就退回只读名字，
  // 不能因为一个外观字段把小组名也弄丢。
  const group = await safe(
    () =>
      c.env.DB.prepare(
        'SELECT name, theme_mode FROM group_info WHERE id = 1',
      ).first<{ name: string; theme_mode: string | null }>(),
    null,
  );
  let groupName: string | null = group?.name ?? null;
  let themeMode = group?.theme_mode ?? 'system';
  if (!group) {
    const legacy = await safe(
      () =>
        c.env.DB.prepare('SELECT name FROM group_info WHERE id = 1').first<{
          name: string;
        }>(),
      null,
    );
    groupName = legacy?.name ?? null;
    themeMode = 'system';
  }
  return apiJson({ groupName, deviceName: device.name, themeMode });
});

app.post('/api/device/revoke', async (c) => {
  const token = requestDeviceToken(c.req.raw);
  if (!token) return apiError('请先加入小组', 401);
  await revokeDeviceByToken(c.env, token);
  return apiJson({ ok: true });
});

app.get('/api/home', async (c) => {
  const origin = publicOrigin(c.req.raw, c.env);
  const slides = await safe(() => loadSlides(c.env.DB, origin), []);
  const meeting = await safe(
    () => loadCurrentMeeting(c.env.DB, Date.now(), origin),
    null,
  );
  const announcement = await safe(
    () => loadLatestAnnouncement(c.env.DB, origin),
    null,
  );
  const cards = await safe(
    () => loadHomeCards(c.env.DB, Date.now(), origin),
    [],
  );
  return apiJson({ slides, meeting, announcement, cards });
});

// App 通知：最近发布的内容，App 自己跟本地记录比对，决定哪些是新通知。
// App 每 60 秒轮询一次，建表只在当前 Worker 实例里做一次，不能每次轮询都跑一遍 DDL。
let updatesSchemaReady = false;
app.get('/api/updates', async (c) => {
  if (!updatesSchemaReady) {
    await ensureSchema(c.env.DB);
    updatesSchemaReady = true;
  }
  const origin = publicOrigin(c.req.raw, c.env);
  return apiJson(
    await safe(() => updatesFeed(c.env, origin), {
      serverTime: new Date().toISOString(),
      items: [],
    }),
  );
});

// 全部聚会：顺序跟后台一致，小组页按这个顺序显示
app.get('/api/meetings', async (c) => {
  const origin = publicOrigin(c.req.raw, c.env);
  return apiJson(
    await safe(() => loadMeetings(c.env.DB, Date.now(), origin), []),
  );
});

app.get('/api/meetings/current', async (c) => {
  const origin = publicOrigin(c.req.raw, c.env);
  const meeting = await safe(
    () => loadCurrentMeeting(c.env.DB, Date.now(), origin),
    null,
  );
  if (!meeting) return apiError('还没有安排聚会', 404);
  return apiJson(meeting);
});

// 指定一场聚会：首页卡片可以选具体哪一场
app.get('/api/meetings/:id', async (c) => {
  const id = intId(c.req.param('id'));
  if (!id) return apiError('参数不对');
  const origin = publicOrigin(c.req.raw, c.env);
  const meeting = await safe(
    () => loadMeeting(c.env.DB, id, Date.now(), origin),
    null,
  );
  if (!meeting) return apiError('找不到这场聚会', 404);
  return apiJson(meeting);
});

app.get('/api/announcements/:id', async (c) => {
  const id = intId(c.req.param('id'));
  if (!id) return apiError('参数不对');
  const item = await safe(
    () => loadAnnouncement(c.env.DB, publicOrigin(c.req.raw, c.env), id),
    null,
  );
  if (!item) return apiError('找不到这条公告', 404);
  return apiJson(item);
});

app.get('/api/series', async (c) => {
  const window = pageWindow(c.req.query('limit'), c.req.query('offset'));
  return apiJson(
    await safe(
      () =>
        loadSeriesList(
          c.env.DB,
          publicOrigin(c.req.raw, c.env),
          c.req.query('category'),
          window.limit,
          window.offset,
        ),
      [],
    ),
  );
});

/** App 搜索：公告、系列、单集分组返回 */
app.get('/api/search', async (c) => {
  const query = c.req.query('q') ?? '';
  const empty = {
    query: query.trim(),
    announcements: [],
    series: [],
    episodes: [],
  };
  const results = await safe(
    () => searchAll(c.env.DB, publicOrigin(c.req.raw, c.env), query),
    empty,
  );
  return apiJson(results);
});

app.get('/api/series/:id', async (c) => {
  const id = intId(c.req.param('id'));
  if (!id) return apiError('参数不对');
  const window = pageWindow(c.req.query('limit'), c.req.query('offset'));
  const item = await safe(
    () =>
      loadSeriesDetail(
        c.env.DB,
        publicOrigin(c.req.raw, c.env),
        id,
        window.limit,
        window.offset,
      ),
    null,
  );
  if (!item) return apiError('找不到这个系列', 404);
  return apiJson(item);
});

app.get('/api/episodes/:id', async (c) => {
  const id = intId(c.req.param('id'));
  if (!id) return apiError('参数不对');
  const item = await safe(
    () => loadEpisode(c.env.DB, publicOrigin(c.req.raw, c.env), id),
    null,
  );
  if (!item) return apiError('找不到这一讲', 404);
  return apiJson(item);
});

app.get('/api/group', async (c) => {
  const origin = publicOrigin(c.req.raw, c.env);
  const group = await safe(
    () =>
      c.env.DB.prepare(
        'SELECT name, intro, leader FROM group_info WHERE id = 1',
      ).first<{ name: string; intro: string | null; leader: string | null }>(),
    null,
  );
  const now = Date.now();
  const meeting = await safe(
    () => loadCurrentMeeting(c.env.DB, now, origin),
    null,
  );
  const meetings = await safe(
    () => loadMeetings(c.env.DB, now, origin),
    [] as Awaited<ReturnType<typeof loadMeetings>>,
  );
  const prayers = await safe(async () => {
    const { results } = await c.env.DB.prepare(
      `SELECT id, author, content, created_at FROM prayers
       WHERE is_published = 1 ORDER BY created_at DESC, id DESC LIMIT 50`,
    ).all<{
      id: number;
      author: string;
      content: string;
      created_at: string;
    }>();
    return (results ?? []).map((row) => ({
      id: row.id,
      author: row.author,
      content: row.content,
      createdAt: row.created_at,
    }));
  }, [] as Array<Record<string, unknown>>);
  return apiJson({ group: group ?? null, meeting, meetings, prayers });
});

// --------------------------------------------------------------------- 测验

/** 课堂页：已发布的测验，最新发布的在最上面 */
app.get('/api/quizzes', async (c) => {
  await ensureSchema(c.env.DB);
  return apiJson(
    await safe(() => listQuizzesForDevice(c.env, c.get('deviceId')), []),
  );
});

app.get('/api/quizzes/:id', async (c) => {
  const id = intId(c.req.param('id'));
  if (!id) return apiError('参数不对');
  await ensureSchema(c.env.DB);
  const quiz = await safe(
    () => getQuizForDevice(c.env, id, c.get('deviceId')),
    null,
  );
  if (!quiz) return apiError('找不到这个测验', 404);
  return apiJson(quiz);
});

/** 答题过程中存草稿：切题、锁定都走这里 */
app.post('/api/quizzes/:id/progress', async (c) => {
  const id = intId(c.req.param('id'));
  if (!id) return apiError('参数不对');
  const body = await readJson(c.req.raw);
  if (!body) return apiError('请求内容不合法');
  await ensureSchema(c.env.DB);
  const result = await saveProgress(c.env, id, c.get('deviceId'), body);
  if ('error' in result) return apiError(result.error, result.status);
  return apiJson(result);
});

app.post('/api/quizzes/:id/submit', async (c) => {
  const id = intId(c.req.param('id'));
  if (!id) return apiError('参数不对');
  const body = await readJson(c.req.raw);
  if (!body) return apiError('请求内容不合法');
  await ensureSchema(c.env.DB);
  const result = await submitQuiz(c.env, id, c.get('deviceId'), body);
  if ('error' in result) return apiError(result.error, result.status);
  return apiJson(result);
});

/** 课堂通知：和测验一起出现在课堂流里 */
app.get('/api/notices', async (c) => {
  await ensureSchema(c.env.DB);
  return apiJson(await safe(() => listNoticesForDevice(c.env), []));
});

app.get('/api/notices/:id', async (c) => {
  const id = intId(c.req.param('id'));
  if (!id) return apiError('参数不对');
  await ensureSchema(c.env.DB);
  const notice = await safe(
    () => loadNoticeForDevice(c.env, id),
    null,
  );
  if (!notice) return apiError('找不到这条通知', 404);
  return apiJson(notice);
});

/** 课堂作业：已发布的问卷，带这台手机的提交状态 */
app.get('/api/homeworks', async (c) => {
  await ensureSchema(c.env.DB);
  return apiJson(
    await safe(() => listHomeworksForDevice(c.env, c.get('deviceId')), []),
  );
});

app.get('/api/homeworks/:id', async (c) => {
  const id = intId(c.req.param('id'));
  if (!id) return apiError('参数不对');
  await ensureSchema(c.env.DB);
  const homework = await safe(
    () => getHomeworkForDevice(c.env, id, c.get('deviceId')),
    null,
  );
  if (!homework) return apiError('找不到这份作业', 404);
  return apiJson(homework);
});

/** 交作业：客户端只提交完整的一份，草稿留在手机上 */
app.post('/api/homeworks/:id/submit', async (c) => {
  const id = intId(c.req.param('id'));
  if (!id) return apiError('参数不对');
  const body = await readJson(c.req.raw);
  if (!body) return apiError('请求内容不合法');
  await ensureSchema(c.env.DB);
  const result = await submitHomework(c.env, id, c.get('deviceId'), body);
  if ('error' in result) return apiError(result.error, result.status);
  return apiJson(result);
});

/** 离开应用太久 / 截屏：锁定作答 */
app.post('/api/quizzes/:id/lock', async (c) => {
  const id = intId(c.req.param('id'));
  if (!id) return apiError('参数不对');
  const body = await readJson(c.req.raw);
  if (!body) return apiError('请求内容不合法');
  await ensureSchema(c.env.DB);
  const result = await lockQuiz(c.env, id, c.get('deviceId'), body);
  if ('error' in result) return apiError(result.error, result.status);
  return apiJson(result);
});

/** 清空重做：锁定或还没交的时候可以重来 */
app.post('/api/quizzes/:id/restart', async (c) => {
  const id = intId(c.req.param('id'));
  if (!id) return apiError('参数不对');
  await ensureSchema(c.env.DB);
  const result = await restartQuiz(c.env, id, c.get('deviceId'));
  if ('error' in result) return apiError(result.error, result.status);
  return apiJson(result);
});

// ------------------------------------------------------------------- 媒体文件

async function serveMedia(
  request: Request,
  env: Env,
  key: string,
): Promise<Response> {
  // 轻量版没有 R2，/media 下的文件一律不存在。
  const files = env.FILES;
  if (!files) return new Response('Not found', { status: 404 });
  if (!key || key.includes('..') || key.length > 200) {
    return new Response('Not found', { status: 404 });
  }
  const hasRange = Boolean(request.headers.get('range'));
  const object = await files.get(
    key,
    hasRange ? { range: request.headers } : undefined,
  );
  if (!object) return new Response('Not found', { status: 404 });

  const contentType =
    object.httpMetadata?.contentType ?? 'application/octet-stream';
  const range = object.range;
  if (hasRange && range && 'offset' in range && typeof range.offset === 'number') {
    const offset = range.offset;
    const length = range.length ?? object.size - offset;
    return new Response(request.method === 'HEAD' ? null : object.body, {
      status: 206,
      headers: mediaHeaders(contentType, {
        'content-range': `bytes ${offset}-${offset + length - 1}/${object.size}`,
        'content-length': String(length),
        etag: object.httpEtag,
      }),
    });
  }
  return new Response(request.method === 'HEAD' ? null : object.body, {
    status: 200,
    headers: mediaHeaders(contentType, {
      'content-length': String(object.size),
      etag: object.httpEtag,
    }),
  });
}

/** 官网是公开页面，用不了带通行证的 /media/；只把封面图换成公开图片地址。 */
function publicCoverUrl(origin: string, value: unknown): string | null {
  if (typeof value !== 'string' || !value) return null;
  if (value.startsWith('/media/')) {
    return `/api/public/media/${value.slice('/media/'.length)}`;
  }
  const prefix = `${origin}/media/`;
  if (value.startsWith(prefix)) {
    return `${origin}/api/public/media/${value.slice(prefix.length)}`;
  }
  return value;
}

app.on(['GET', 'HEAD'], '/media/*', (c) => {
  const key = decodeURIComponent(c.req.path.slice('/media/'.length));
  return serveMedia(c.req.raw, c.env, key);
});

// 官网封面图：不需要通行证，但只开放 img/ 下的图片，音频视频和别的文件仍然要通行证。
app.on(['GET', 'HEAD'], '/api/public/media/*', (c) => {
  const key = decodeURIComponent(
    c.req.path.slice('/api/public/media/'.length),
  );
  if (!key.startsWith('img/')) {
    return new Response('Not found', { status: 404 });
  }
  return serveMedia(c.req.raw, c.env, key);
});

// ----------------------------------------------------------------- 管理后台

app.get('/', (c) => Response.redirect(`${publicOrigin(c.req.raw, c.env)}/admin`, 302));

app.get('/admin', (c) => {
  const lang = requestedLang(c.req.raw);
  return htmlResponse(
    ADMIN_PAGE_HTML.replaceAll('__QJW_LANG__', lang)
      .replaceAll('__QJW_LANG_ATTR__', lang === 'en' ? 'en' : 'zh-CN')
      .replaceAll('__QJW_TITLE__', lang === 'en' ? 'QJW · Admin' : '青椒味 · 管理后台')
      .replaceAll('__QJW_LOADING__', lang === 'en' ? 'Loading…' : '正在加载…'),
  );
});

// 课堂是独立的一套管理页：测验、以后的作业和通知都放这里，不挤在主后台的栏目里
app.get('/classroom', async (c) => {
  const authed = await safe(
    () => isValidSession(c.env, readSessionCookie(c.req.raw)),
    false,
  );
  if (!authed) {
    return Response.redirect(`${publicOrigin(c.req.raw, c.env)}/admin`, 302);
  }
  const lang = requestedLang(c.req.raw);
  return htmlResponse(
    CLASSROOM_PAGE_HTML
      .replaceAll('__QJW_LANG__', lang)
      .replaceAll('__QJW_LANG_ATTR__', lang === 'en' ? 'en' : 'zh-CN')
      .replaceAll('__QJW_TITLE__', lang === 'en' ? 'QJW · Classroom' : '青椒味 · 课堂')
      .replaceAll('__QJW_LOADING__', lang === 'en' ? 'Opening classroom…' : '正在打开课堂…'),
  );
});

app.get('/admin/api/status', async (c) => {
  const hasPassword = await hasPasswordConfigured(c.env);
  return jsonResponse({
    hasPassword,
    // 还没有密码时，允许在浏览器里第一次设置（设好这个窗口就关了）
    canSetup: !hasPassword,
    initialized: await isInitialized(c.env),
    // 轻量版没有 FILES 时，后台隐藏图片库和上传按钮，只留外链输入。
    mediaEnabled: Boolean(c.env.FILES),
    // 自部署版强制要求设置码，防止公开地址被陌生人抢先设管理员。
    requiresSetupCode: true,
  });
});

app.get('/admin/api/session', async (c) =>
  jsonResponse({
    authenticated: await isValidSession(c.env, readSessionCookie(c.req.raw)),
  }),
);

// 第一次使用：在浏览器里设置管理员密码（只允许在还没有密码时执行一次）
app.post('/admin/api/setup', async (c) => {
  const req = c.req.raw;
  const body = await readJson(req);
  const lang = body?.lang === 'en' || body?.lang === 'zh' ? body.lang : requestedLang(req);
  const en = lang === 'en';
  const alreadySet = en
    ? 'An admin password is already set. Just sign in.'
    : '已经设置过管理员密码了，直接登录就行';
  if (!isSameOrigin(req, c.env)) {
    return apiError(en ? 'Invalid request origin' : '来源不合法', 403);
  }
  if (await hasPasswordConfigured(c.env)) {
    return apiError(alreadySet, 409);
  }
  const expectedCode = (c.env.SETUP_CODE ?? '').trim();
  if (!expectedCode) {
    return apiError(
      en
        ? 'SETUP_CODE is not configured. Set it in Cloudflare first.'
        : '还没有配置部署设置码，请先在 Cloudflare 里设置 SETUP_CODE',
      503,
    );
  }
  if (expectedCode === 'please-change-this-setup-code') {
    return apiError(
      en
        ? 'SETUP_CODE is still the example value. Change it to your own.'
        : '部署设置码还是示例值，请先改成你自己的',
      503,
    );
  }
  if (expectedCode.length < 8) {
    return apiError(
      en ? 'SETUP_CODE is too short. Use at least 8 characters.' : '部署设置码太短，请至少用 8 位',
      503,
    );
  }
  const providedCode =
    typeof body?.setupCode === 'string' ? body.setupCode.trim() : '';
  if (!providedCode) {
    return apiError(en ? 'Enter the setup code' : '请填部署设置码');
  }
  if (providedCode !== expectedCode) {
    return apiError(
      en ? 'Wrong setup code. Use the one from deployment.' : '设置码不对，请用部署时填的那个',
      403,
    );
  }
  const groupName = trimmed(body?.groupName, 40);
  if (!groupName) {
    return apiError(en ? 'Enter a group name' : '请填小组名称');
  }
  const password = typeof body?.password === 'string' ? body.password : '';
  const problem = passwordProblem(password, lang);
  if (problem) return apiError(problem);

  await ensureSchema(c.env.DB);
  if (!(await claimAdminPassword(c.env, password))) {
    return apiError(alreadySet, 409);
  }
  const seeded = await seedIfEmpty(c.env.DB, groupName, lang);
  const session = await createSession(c.env);
  if (!session) {
    return apiError(en ? 'Could not start a session. Try again.' : '会话没建起来，请重试', 500);
  }
  return jsonResponse(
    { ok: true, seeded },
    { headers: { 'set-cookie': sessionCookie(session) } },
  );
});

app.post('/admin/api/login', async (c) => {
  const req = c.req.raw;
  const body = await readJson(req);
  const lang = body?.lang === 'en' || body?.lang === 'zh' ? body.lang : requestedLang(req);
  const en = lang === 'en';
  if (!isSameOrigin(req, c.env)) {
    return apiError(en ? 'Invalid request origin' : '来源不合法', 403);
  }
  if (!(await hasPasswordConfigured(c.env))) {
    return apiError(
      en ? 'No admin password yet. Reload this page to set one.' : '还没设置管理员密码，刷新这一页设置一下',
      409,
    );
  }
  const ip = clientIp(req);
  if (!(await safe(() => loginAllowed(c.env, ip), true))) {
    return apiError(
      en ? 'Too many attempts. Try again in 15 minutes.' : '失败次数太多，请过 15 分钟再试',
      429,
    );
  }
  const password = typeof body?.password === 'string' ? body.password : '';
  const ok = await verifyPassword(c.env, password);
  await safe(() => recordLoginAttempt(c.env, ip, ok), undefined);
  if (!ok) return apiError(en ? 'Wrong password' : '密码不对', 401);
  // 登录时顺手把表建齐（已有就什么都不做）；不再自动灌示例内容。
  await safe(async () => {
    await ensureSchema(c.env.DB);
  }, undefined);
  const session = await createSession(c.env);
  if (!session) return apiError('会话密钥没配置好', 500);
  return jsonResponse({ ok: true }, { headers: { 'set-cookie': sessionCookie(session) } });
});

// 改密码（需要已经登录，并且知道现在的密码）
app.post('/admin/api/password', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const body = await readJson(c.req.raw);
  const current = typeof body?.currentPassword === 'string' ? body.currentPassword : '';
  const next = typeof body?.newPassword === 'string' ? body.newPassword : '';
  if (!(await verifyPassword(c.env, current))) {
    return apiError('现在的密码不对', 401);
  }
  const problem = passwordProblem(next, requestedLang(c.req.raw));
  if (problem) return apiError(problem);
  await setAdminPassword(c.env, next);
  // 旧会话全部作废，并给当前浏览器发一个新会话
  await safe(() => revokeAllSessions(c.env), undefined);
  const session = await createSession(c.env);
  return jsonResponse(
    { ok: true },
    session ? { headers: { 'set-cookie': sessionCookie(session) } } : {},
  );
});

// 以后加字段/加表时用：登录后调一次，幂等地把表建齐（不会动已有数据）
app.post('/admin/api/migrate', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  await ensureSchema(c.env.DB);
  return jsonResponse({ ok: true });
});

app.post('/admin/api/logout', async (c) => {
  if (!isSameOrigin(c.req.raw, c.env)) return apiError('来源不合法', 403);
  // 无状态签名 Cookie 没法单独失效，所以退出时把会话版本 +1，
  // 之前发出去的所有会话立刻作废。
  await safe(() => revokeAllSessions(c.env), undefined);
  return jsonResponse({ ok: true }, { headers: { 'set-cookie': clearSessionCookie() } });
});

// 生成小组二维码：24 小时有效，最多 20 台；后台只显示这一次。
app.post('/admin/api/invites', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const body = await readJson(c.req.raw);
  await ensureSchema(c.env.DB);
  const requested = Number(body?.maxUses);
  const invite = await createInvite(
    c.env,
    publicOrigin(c.req.raw, c.env),
    Number.isFinite(requested) ? requested : undefined,
  );
  return jsonResponse(invite);
});

// 立即作废正在显示的二维码：只阻止新手机加入，已经加入的设备不动。
app.post('/admin/api/invites/:id/revoke', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const id = intId(c.req.param('id'));
  if (!id) return apiError('参数不对');
  await ensureSchema(c.env.DB);
  const revoked = await revokeInvite(c.env, id);
  return jsonResponse({ ok: true, revoked });
});

// 生命河主日讲道自动同步：状态、手动抓一次、开关
app.get('/admin/api/rolcc/status', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  await ensureSchema(c.env.DB);
  return jsonResponse(await getRolccStatus(c.env));
});

app.post('/admin/api/rolcc/sync', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  return jsonResponse(await syncRolcc(c.env, { trigger: 'manual' }));
});

app.post('/admin/api/rolcc/enabled', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const body = await readJson(c.req.raw);
  await setRolccEnabled(c.env, Boolean(body?.enabled));
  return jsonResponse({ ok: true, ...(await getRolccStatus(c.env)) });
});

app.get('/admin/api/devices', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  await ensureSchema(c.env.DB);
  return jsonResponse({ items: await listDevices(c.env) });
});

app.delete('/admin/api/devices/:id', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const id = intId(c.req.param('id'));
  if (!id) return apiError('参数不对');
  await ensureSchema(c.env.DB);
  await revokeDevice(c.env, id);
  return jsonResponse({ ok: true });
});

app.post('/admin/api/devices/revoke-all', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  await ensureSchema(c.env.DB);
  await revokeAllDevices(c.env);
  return jsonResponse({ ok: true });
});

app.get('/admin/api/data', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  // 每次打开后台都顺手把表建齐、把老数据整理好。
  // 幂等：字段有了、迁移跑过了就什么都不做，所以已经登录的浏览器升级后也能直接用。
  await safe(() => ensureSchema(c.env.DB), undefined);
  return jsonResponse(await listAll(c.env, publicOrigin(c.req.raw, c.env)));
});

// 后台分页列表：系列、单集内容多的时候按页拉，搜索也在数据库里做。
app.get('/admin/api/list/:name', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const name = c.req.param('name');
  if (!isCollection(name)) return apiError('没有这个内容类型', 404);
  await ensureSchema(c.env.DB);
  try {
    const page = await listPage(c.env, publicOrigin(c.req.raw, c.env), name, {
      page: Number(c.req.query('page')),
      pageSize: Number(c.req.query('pageSize')),
      q: c.req.query('q'),
      category: c.req.query('category'),
      seriesId: Number(c.req.query('seriesId')),
    });
    return jsonResponse(page);
  } catch (error) {
    return apiError(error instanceof Error ? error.message : '读取失败');
  }
});

app.post('/admin/api/data/:name', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const name = c.req.param('name');
  if (!isCollection(name)) return apiError('没有这个内容类型', 404);
  const body = await readJson(c.req.raw);
  if (!body) return apiError('请求内容不合法');
  try {
    await createItem(c.env, name, body);
  } catch (error) {
    return apiError(error instanceof Error ? error.message : '保存失败');
  }
  return jsonResponse({ ok: true });
});

app.put('/admin/api/data/:name/:id', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const name = c.req.param('name');
  const id = intId(c.req.param('id'));
  if (!isCollection(name) || !id) return apiError('请求地址不对', 404);
  const body = await readJson(c.req.raw);
  if (!body) return apiError('请求内容不合法');
  try {
    await updateItem(c.env, name, id, body);
  } catch (error) {
    return apiError(error instanceof Error ? error.message : '保存失败');
  }
  return jsonResponse({ ok: true });
});

app.delete('/admin/api/data/:name/:id', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const name = c.req.param('name');
  const id = intId(c.req.param('id'));
  if (!isCollection(name) || !id) return apiError('请求地址不对', 404);
  try {
    await deleteItem(c.env, name, id);
  } catch (error) {
    return apiError(error instanceof Error ? error.message : '删除失败');
  }
  return jsonResponse({ ok: true });
});

/** 批量操作：删除、发布、隐藏。一次最多 200 条。 */
app.post('/admin/api/data/:name/bulk', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const name = c.req.param('name');
  if (!isCollection(name)) return apiError('没有这个内容类型', 404);
  const body = await readJson(c.req.raw);
  const ids = Array.isArray(body?.ids) ? body.ids : [];
  if (!ids.length) return apiError('没有选中内容');
  if (ids.length > MAX_BULK_ITEMS) {
    return apiError(`一次最多操作 ${MAX_BULK_ITEMS} 条`);
  }
  const action = body?.action;
  try {
    let count = 0;
    if (action === 'delete') {
      count = await bulkDeleteItems(c.env, name, ids);
    } else if (action === 'publish' || action === 'unpublish') {
      count = await bulkSetPublished(c.env, name, ids, action === 'publish');
    } else {
      return apiError('不支持的操作');
    }
    return jsonResponse({ ok: true, count });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : '操作失败');
  }
});

/** 首页卡片排序：只接受一组 id，按传入顺序写回 sort */
app.post('/admin/api/home/reorder', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const body = await readJson(c.req.raw);
  const ids = Array.isArray(body?.ids) ? body.ids : [];
  try {
    const count = await reorderHomeCards(c.env, ids);
    return jsonResponse({ ok: true, count });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : '排序失败');
  }
});

// -------------------------------------------------------------- 后台：通知

app.get('/admin/api/notices', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  await ensureSchema(c.env.DB);
  try {
    return jsonResponse({ items: await listNoticesForAdmin(c.env) });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : '读取失败');
  }
});

app.post('/admin/api/notices', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const body = await readJson(c.req.raw);
  if (!body) return apiError('请求内容不合法');
  await ensureSchema(c.env.DB);
  try {
    return jsonResponse(await createNotice(c.env, body));
  } catch (error) {
    return apiError(error instanceof Error ? error.message : '保存失败');
  }
});

app.put('/admin/api/notices/:id', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const id = intId(c.req.param('id'));
  if (!id) return apiError('参数不对');
  const body = await readJson(c.req.raw);
  if (!body) return apiError('请求内容不合法');
  await ensureSchema(c.env.DB);
  try {
    return jsonResponse(await updateNotice(c.env, id, body));
  } catch (error) {
    return apiError(error instanceof Error ? error.message : '保存失败');
  }
});

app.delete('/admin/api/notices/:id', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const id = intId(c.req.param('id'));
  if (!id) return apiError('参数不对');
  await ensureSchema(c.env.DB);
  try {
    await deleteNotice(c.env, id);
    return jsonResponse({ ok: true });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : '删除失败');
  }
});

// -------------------------------------------------------------- 后台：作业

app.get('/admin/api/homeworks', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  await ensureSchema(c.env.DB);
  try {
    return jsonResponse({ items: await listHomeworksForAdmin(c.env) });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : '读取失败');
  }
});

app.post('/admin/api/homeworks', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const body = await readJson(c.req.raw);
  if (!body) return apiError('请求内容不合法');
  await ensureSchema(c.env.DB);
  try {
    return jsonResponse(await createHomework(c.env, body));
  } catch (error) {
    return apiError(error instanceof Error ? error.message : '保存失败');
  }
});

app.get('/admin/api/homeworks/:id', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const id = intId(c.req.param('id'));
  if (!id) return apiError('参数不对');
  await ensureSchema(c.env.DB);
  const homework = await getHomeworkForAdmin(c.env, id);
  if (!homework) return apiError('找不到这份作业', 404);
  return jsonResponse(homework);
});

app.put('/admin/api/homeworks/:id', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const id = intId(c.req.param('id'));
  if (!id) return apiError('参数不对');
  const body = await readJson(c.req.raw);
  if (!body) return apiError('请求内容不合法');
  await ensureSchema(c.env.DB);
  try {
    return jsonResponse(await updateHomework(c.env, id, body));
  } catch (error) {
    return apiError(error instanceof Error ? error.message : '保存失败');
  }
});

app.delete('/admin/api/homeworks/:id', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const id = intId(c.req.param('id'));
  if (!id) return apiError('参数不对');
  await ensureSchema(c.env.DB);
  try {
    await deleteHomework(c.env, id);
    return jsonResponse({ ok: true });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : '删除失败');
  }
});

app.get('/admin/api/homeworks/:id/submissions/:submissionId', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const id = intId(c.req.param('id'));
  const submissionId = intId(c.req.param('submissionId'));
  if (!id || !submissionId) return apiError('参数不对');
  await ensureSchema(c.env.DB);
  const sheet = await getHomeworkSubmissionForAdmin(c.env, id, submissionId);
  if (!sheet) return apiError('找不到这份作业', 404);
  return jsonResponse(sheet);
});

app.post('/admin/api/homeworks/:id/submissions/:submissionId/grade', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const id = intId(c.req.param('id'));
  const submissionId = intId(c.req.param('submissionId'));
  if (!id || !submissionId) return apiError('参数不对');
  const body = await readJson(c.req.raw);
  if (!body) return apiError('请求内容不合法');
  await ensureSchema(c.env.DB);
  const result = await gradeHomeworkSubmission(c.env, id, submissionId, body);
  if ('error' in result) return apiError(result.error, result.status);
  return jsonResponse(result);
});

// -------------------------------------------------------------- 后台：测验

app.get('/admin/api/quizzes', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  await ensureSchema(c.env.DB);
  try {
    return jsonResponse({ items: await listQuizzesForAdmin(c.env) });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : '读取失败');
  }
});

app.post('/admin/api/quizzes', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const body = await readJson(c.req.raw);
  if (!body) return apiError('请求内容不合法');
  await ensureSchema(c.env.DB);
  try {
    return jsonResponse(await createQuiz(c.env, body));
  } catch (error) {
    return apiError(error instanceof Error ? error.message : '保存失败');
  }
});

app.get('/admin/api/quizzes/:id', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const id = intId(c.req.param('id'));
  if (!id) return apiError('参数不对');
  await ensureSchema(c.env.DB);
  const quiz = await getQuizForAdmin(c.env, id);
  if (!quiz) return apiError('找不到这个测验', 404);
  return jsonResponse(quiz);
});

app.put('/admin/api/quizzes/:id', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const id = intId(c.req.param('id'));
  if (!id) return apiError('参数不对');
  const body = await readJson(c.req.raw);
  if (!body) return apiError('请求内容不合法');
  await ensureSchema(c.env.DB);
  try {
    return jsonResponse(await updateQuiz(c.env, id, body));
  } catch (error) {
    return apiError(error instanceof Error ? error.message : '保存失败');
  }
});

app.delete('/admin/api/quizzes/:id', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const id = intId(c.req.param('id'));
  if (!id) return apiError('参数不对');
  await ensureSchema(c.env.DB);
  try {
    await deleteQuiz(c.env, id);
    return jsonResponse({ ok: true });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : '删除失败');
  }
});

app.get('/admin/api/quizzes/:id/submissions/:submissionId', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const id = intId(c.req.param('id'));
  const submissionId = intId(c.req.param('submissionId'));
  if (!id || !submissionId) return apiError('参数不对');
  await ensureSchema(c.env.DB);
  const sheet = await getSubmissionForAdmin(c.env, id, submissionId);
  if (!sheet) return apiError('找不到这份作答', 404);
  return jsonResponse(sheet);
});

app.post('/admin/api/quizzes/:id/submissions/:submissionId/grade', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const id = intId(c.req.param('id'));
  const submissionId = intId(c.req.param('submissionId'));
  if (!id || !submissionId) return apiError('参数不对');
  const body = await readJson(c.req.raw);
  if (!body) return apiError('请求内容不合法');
  await ensureSchema(c.env.DB);
  const result = await gradeSubmission(c.env, id, submissionId, body);
  if ('error' in result) return apiError(result.error, result.status);
  return jsonResponse(result);
});

app.post('/admin/api/quizzes/:id/submissions/:submissionId/unlock', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const id = intId(c.req.param('id'));
  const submissionId = intId(c.req.param('submissionId'));
  if (!id || !submissionId) return apiError('参数不对');
  await ensureSchema(c.env.DB);
  const result = await unlockSubmission(c.env, id, submissionId);
  if ('error' in result) return apiError(result.error, result.status);
  return jsonResponse(result);
});

app.delete('/admin/api/quizzes/:id/submissions/:submissionId', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const id = intId(c.req.param('id'));
  const submissionId = intId(c.req.param('submissionId'));
  if (!id || !submissionId) return apiError('参数不对');
  await ensureSchema(c.env.DB);
  try {
    await deleteSubmission(c.env, id, submissionId);
    return jsonResponse({ ok: true });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : '删除失败');
  }
});

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_MEDIA_BYTES = 120 * 1024 * 1024;

/** 图片库：直接列 R2 里 img/ 下的文件，所以以前传过的图也能在库里看到 */
app.get('/admin/api/media', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const files = c.env.FILES;
  if (!files) return jsonResponse({ items: [] });
  const origin = publicOrigin(c.req.raw, c.env);
  const items: Array<{
    key: string;
    path: string;
    url: string;
    name: string;
    size: number;
    uploadedAt: string | null;
  }> = [];
  let cursor: string | undefined;
  try {
    // R2 一次最多 1000 个；最多翻 10 页，一个小组用绰绰有余
    for (let page = 0; page < 10; page += 1) {
      const listing = await files.list({
        prefix: 'img/',
        limit: 1000,
        // 不显式要的话，列表里拿不到上传时存的原文件名
        include: ['customMetadata'],
        ...(cursor ? { cursor } : {}),
      });
      for (const object of listing.objects) {
        items.push({
          key: object.key,
          // path 给后台预览和表单用（相对路径，换域名也不会坏）；url 给复制用
          path: `/media/${object.key}`,
          url: `${origin}/media/${object.key}`,
          name: originalMediaName(object),
          size: object.size,
          uploadedAt: object.uploaded ? object.uploaded.toISOString() : null,
        });
      }
      if (!listing.truncated || !listing.cursor) break;
      cursor = listing.cursor;
    }
  } catch (error) {
    console.error('media list failed', error);
    return apiError('读取图片库失败，请重试', 500);
  }
  items.sort((a, b) =>
    String(b.uploadedAt ?? '').localeCompare(String(a.uploadedAt ?? '')),
  );
  return jsonResponse({ items });
});

/** 图片库删除：只允许删 img/ 下的文件，真的从 R2 删掉 */
app.delete('/admin/api/media', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const files = c.env.FILES;
  if (!files) return apiError('这个版本没有开启文件存储，请用外链', 503);
  const key = (c.req.query('key') ?? '').trim();
  if (!key.startsWith('img/') || key.includes('..') || key.length > 200) {
    return apiError('图片地址不合法');
  }
  try {
    await files.delete(key);
  } catch (error) {
    console.error('media delete failed', error);
    return apiError('删除失败，请重试', 500);
  }
  return jsonResponse({ ok: true });
});

/** 图片库批量删除：同样是真删 R2 */
app.post('/admin/api/media/bulk-delete', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const files = c.env.FILES;
  if (!files) return apiError('这个版本没有开启文件存储，请用外链', 503);
  const body = await readJson(c.req.raw);
  const raw = Array.isArray(body?.keys) ? body.keys : [];
  if (!raw.length) return apiError('没有选中图片');
  if (raw.length > 200) return apiError('一次最多删除 200 张');
  const keys: string[] = [];
  for (const value of raw) {
    const key = typeof value === 'string' ? value.trim() : '';
    if (
      !key.startsWith('img/') ||
      key.includes('..') ||
      key.length > 200
    ) {
      return apiError('图片地址不合法');
    }
    keys.push(key);
  }
  try {
    await files.delete([...new Set(keys)]);
  } catch (error) {
    console.error('media bulk delete failed', error);
    return apiError('删除失败，请重试', 500);
  }
  return jsonResponse({ ok: true, count: new Set(keys).size });
});

/** 上传时把原文件名放在 customMetadata 里（HTTP 头只能 ASCII，所以编码过） */
function originalMediaName(object: R2Object): string {
  const stored = object.customMetadata?.name;
  if (stored) {
    try {
      return decodeURIComponent(stored);
    } catch {
      return stored;
    }
  }
  return object.key.split('/').pop() ?? object.key;
}

app.post('/admin/api/upload', async (c) => {
  const denied = await requireAdmin(c.req.raw, c.env);
  if (denied) return denied;
  const files = c.env.FILES;
  if (!files) return apiError('这个版本没有开启文件存储，请用外链', 503);

  const uploaded = await readUpload(c.req.raw);
  if ('error' in uploaded) return apiError(uploaded.error, uploaded.status);

  const mime = sniffType(uploaded.bytes);
  if (!mime) {
    return apiError('只收 jpg / png / webp / gif 图片，和 mp3 / m4a / wav / ogg 音频', 415);
  }
  const extension = extensionFor(mime);
  if (!extension) return apiError('不支持的文件类型', 415);

  const isImage = mime.startsWith('image/');
  const limit = isImage ? MAX_IMAGE_BYTES : MAX_MEDIA_BYTES;
  if (uploaded.bytes.byteLength > limit) {
    return apiError(
      isImage ? '图片不能超过 10 MB' : '音视频文件不能超过 120 MB',
      413,
    );
  }

  const key = `${isImage ? 'img' : 'media'}/${randomKey()}.${extension}`;
  const name = uploaded.filename.slice(0, 120);
  await files.put(key, uploaded.bytes, {
    httpMetadata: { contentType: mime },
    customMetadata: { name: encodeURIComponent(name) },
  });
  return jsonResponse({
    path: `/media/${key}`,
    url: `${publicOrigin(c.req.raw, c.env)}/media/${key}`,
    name,
    size: uploaded.bytes.byteLength,
    mime,
  });
});

// --------------------------------------------------------------------- 兜底

app.notFound((c) =>
  c.req.path.startsWith('/api/')
    ? apiError('接口不存在', 404)
    : new Response('Not found', { status: 404 }),
);

app.onError((error, c) => {
  console.error('unhandled error', error);
  return apiError('服务器出错了', 500);
});

export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) =>
    app.fetch(request, env, ctx),
  // Cloudflare 定时任务：每周一 13:00 UTC = 北京周一 21:00
  scheduled: async (
    _controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ) => {
    ctx.waitUntil(
      (async () => {
        try {
          await ensureSchema(env.DB);
          if (!(await isRolccEnabled(env))) return;
          await syncRolcc(env, { trigger: 'cron' });
        } catch (error) {
          console.error('rolcc scheduled sync failed', error);
        }
      })(),
    );
  },
};
