export interface Env {
  DB: D1Database;
  /** 轻量版不绑定 R2；有 FILES 时才开启上传和 /media 文件服务 */
  FILES?: R2Bucket;
  /** 一键部署时生成/填写的设置码，只在第一次设置管理员密码时用 */
  SETUP_CODE?: string;
  /** 管理员密码（明文，存在 Worker secret 里，不进代码仓库） */
  ADMIN_PASSWORD?: string;
  /** 也可以只存哈希：pbkdf2$迭代次数$salt$hash（base64） */
  ADMIN_PASSWORD_HASH?: string;
  /** 会话签名密钥，没设就退回用密码派生 */
  SESSION_SECRET?: string;
  /**
   * 允许访问本站的地址，逗号分隔，例如
   * "https://qjw.example.com,https://your-worker.workers.dev"。
   * 第一个当作对外的规范地址（图片/音频绝对链接用它）。不设就用请求本身的地址。
   */
  PUBLIC_ORIGINS?: string;
}

/** 把 PUBLIC_ORIGINS 解析成【规范地址 + 全部允许的地址】 */
export function parseOrigins(value: string | undefined): {
  canonical: string | null;
  allowed: string[];
} {
  const allowed = (value ?? '')
    .split(',')
    .map((item) => item.trim().replace(/\/+$/, ''))
    .filter((item) => /^https?:\/\/[^/\s]+$/.test(item));
  return { canonical: allowed[0] ?? null, allowed };
}

/**
 * 对外绝对地址用哪个域名：
 * 同一份内容可能同时从免费地址和你的域名进来，所以用配置里第一个地址，
 * 跟请求从哪来无关，换域名时链接不会跟着变。
 */
export function publicOrigin(request: Request, env: Env): string {
  return parseOrigins(env.PUBLIC_ORIGINS).canonical ?? new URL(request.url).origin;
}

const BASE_HEADERS: Record<string, string> = {
  'x-robots-tag': 'noindex, nofollow',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
};

export function jsonResponse(
  data: unknown,
  opts: { status?: number; cache?: string; headers?: Record<string, string> } = {},
): Response {
  return new Response(JSON.stringify(data), {
    status: opts.status ?? 200,
    headers: {
      ...BASE_HEADERS,
      'content-type': 'application/json; charset=utf-8',
      'cache-control': opts.cache ?? 'no-store',
      ...(opts.headers ?? {}),
    },
  });
}

/** 媒体文件（图片、音频、视频）的响应头 */
export function mediaHeaders(
  contentType: string,
  extra: Record<string, string> = {},
): Record<string, string> {
  return {
    ...BASE_HEADERS,
    'content-type': contentType,
    'cache-control': 'public, max-age=31536000, immutable',
    'accept-ranges': 'bytes',
    ...extra,
  };
}

/**
 * 公开只读接口。内容量很小（一个小组几百次请求），所以不缓存：
 * 后台改完内容、App 下拉刷新就能立刻看到。
 */
export function apiJson(data: unknown): Response {
  return jsonResponse(data, { cache: 'no-store' });
}

export function apiError(message: string, status = 400): Response {
  return jsonResponse({ error: message }, { status });
}

export function htmlResponse(html: string, status = 200): Response {
  return new Response(html, {
    status,
    headers: {
      ...BASE_HEADERS,
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'content-security-policy':
        "default-src 'self'; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
    },
  });
}

export function binaryResponse(
  body: ReadableStream | ArrayBuffer,
  contentType: string,
  extra: Record<string, string> = {},
): Response {
  return new Response(body, {
    headers: {
      ...BASE_HEADERS,
      'content-type': contentType,
      'cache-control': 'public, max-age=31536000, immutable',
      ...extra,
    },
  });
}

export async function readJson(
  request: Request,
): Promise<Record<string, unknown> | null> {
  const type = request.headers.get('content-type') ?? '';
  if (!type.includes('application/json')) return null;
  const length = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(length) && length > 1_000_000) return null;
  try {
    const body: unknown = await request.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return null;
    }
    return body as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function trimmed(value: unknown, max = 200): string | null {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  if (text.length === 0) return null;
  return text.slice(0, max);
}

/**
 * 时长只填了数字就自动补「分钟」：38 -> 38 分钟。
 * 已经带单位（38 分钟、1 小时 20 分钟）就原样保留。
 * 读旧数据时也走这里，所以以前只存了「90」的也不用改库。
 */
export function durationLabel(value: unknown): string | null {
  const text = trimmed(value, 40);
  if (!text) return null;
  const bare = /^(\d+(?:\.\d+)?)$/.exec(text);
  if (bare) return `${bare[1]} 分钟`;
  const minutes = /^(\d+(?:\.\d+)?)\s*分钟$/.exec(text);
  if (minutes) return `${minutes[1]} 分钟`;
  return text;
}

export function toInt(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.trunc(n);
}

export function toFlag(value: unknown, fallback = 0): number {
  if (value === true || value === 1 || value === '1' || value === 'true') return 1;
  if (value === false || value === 0 || value === '0' || value === 'false') return 0;
  return fallback;
}

export function intId(value: string | undefined): number | null {
  if (!value) return null;
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
}

/** 数据库里存相对路径（/media/xxx），出接口时补成绝对地址，换域名不会坏 */
export function absolute(origin: string, path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return origin + (path.startsWith('/') ? path : `/${path}`);
}

/** 北京时间固定东八区，没有夏令时 */
export const CN_OFFSET_MINUTES = 480;
const CN_OFFSET_MS = CN_OFFSET_MINUTES * 60_000;
const DAY_MS = 86_400_000;

/** 把某一刻挪到「北京时间的墙上时间」，配合 getUTC* 读年月日 */
function beijingWall(ms: number): Date {
  return new Date(ms + CN_OFFSET_MS);
}

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * 时间统一存 UTC ISO。
 * 后台表单提交的是浏览器转好的带时区 ISO；
 * 也接受 '2026-10-30 19:30' 这种不带时区的写法，一律按北京时间解释，
 * 这样脚本、旧数据、后台手填都在同一个时区上，不受服务器/浏览器在哪影响。
 */
export function toIso(value: unknown): string | null {
  const text = trimmed(value, 40);
  if (!text) return null;
  const bare = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/.exec(text);
  const ms = bare
    ? Date.UTC(
        +bare[1]!,
        +bare[2]! - 1,
        +bare[3]!,
        +bare[4]!,
        +bare[5]!,
        +(bare[6] ?? 0),
      ) - CN_OFFSET_MS
    : Date.parse(text);
  if (!Number.isFinite(ms)) return null;
  return new Date(ms).toISOString();
}

/** UTC ISO → 北京时间 'YYYY-MM-DDTHH:mm'，给后台表单的 datetime-local 用 */
export function beijingInput(value: unknown): string {
  const ms = typeof value === 'string' ? Date.parse(value) : NaN;
  if (!Number.isFinite(ms)) return '';
  const d = beijingWall(ms);
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}T${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}`;
}

/** 毫秒时间戳 → 北京时间的 'HH:mm' */
export function beijingClock(ms: number): string {
  const d = beijingWall(ms);
  return `${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}`;
}

/** 'HH:MM' 规范成两位；不合法返回 null */
export function clockTime(value: unknown): string | null {
  const text = trimmed(value, 5);
  const match = text ? /^(\d{1,2}):(\d{2})$/.exec(text) : null;
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return `${pad2(hours)}:${pad2(minutes)}`;
}

function minutesOfDay(value: string): number {
  const [hours, minutes] = value.split(':').map(Number);
  return (hours ?? 0) * 60 + (minutes ?? 0);
}

export interface WeeklyOccurrence {
  /** 毫秒时间戳 */
  start: number;
  end: number;
}

/**
 * 每周重复的下一次（正在进行中的那一次也算），按北京时间算。
 * weekday 用 1=周一 … 7=周日，和 Dart 的 DateTime.weekday 一致。
 */
export function nextWeeklyOccurrence(
  weekday: number,
  startTime: string,
  endTime: string,
  now = Date.now(),
): WeeklyOccurrence {
  const startMinutes = minutesOfDay(startTime);
  let endMinutes = minutesOfDay(endTime);
  // 结束时间不晚于开始时间时，按两小时算，避免算出负数长度
  if (endMinutes <= startMinutes) endMinutes = startMinutes + 120;
  const wall = beijingWall(now);
  const today = wall.getUTCDay() === 0 ? 7 : wall.getUTCDay();
  const midnightUtc =
    Date.UTC(wall.getUTCFullYear(), wall.getUTCMonth(), wall.getUTCDate()) -
    CN_OFFSET_MS;
  let start =
    midnightUtc + ((weekday - today + 7) % 7) * DAY_MS + startMinutes * 60_000;
  let end = start + (endMinutes - startMinutes) * 60_000;
  // 这一次已经结束了，就顺延到下周同一天
  if (end < now) {
    start += 7 * DAY_MS;
    end += 7 * DAY_MS;
  }
  return { start, end };
}

/** 从毫秒时间戳拿到北京时间的星期（1=周一 … 7=周日） */
export function beijingWeekday(ms: number): number {
  const day = beijingWall(ms).getUTCDay();
  return day === 0 ? 7 : day;
}

export function nowIso(): string {
  return new Date().toISOString();
}

/** 从 multipart 或原始请求体里读上传内容 */
export async function readUpload(
  request: Request,
): Promise<
  { bytes: Uint8Array; filename: string } | { error: string; status: number }
> {
  const type = request.headers.get('content-type') ?? '';
  const maxBytes = 200 * 1024 * 1024;
  const length = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(length) && length > maxBytes) {
    return { error: '文件太大', status: 413 };
  }
  try {
    if (type.includes('multipart/form-data')) {
      const form = await request.formData();
      const file = form.get('file');
      if (!(file instanceof File)) return { error: '没有收到文件', status: 400 };
      if (file.size > maxBytes) return { error: '文件太大', status: 413 };
      const bytes = new Uint8Array(await file.arrayBuffer());
      return { bytes, filename: file.name };
    }
    const buf = await request.arrayBuffer();
    if (buf.byteLength > maxBytes) return { error: '文件太大', status: 413 };
    return {
      bytes: new Uint8Array(buf),
      filename: trimmed(request.headers.get('x-filename'), 120) ?? 'upload.bin',
    };
  } catch {
    return { error: '读取上传内容失败', status: 400 };
  }
}

/** 按文件头判类型，不信扩展名、不信浏览器报的 content-type */
export function sniffType(bytes: Uint8Array): string | null {
  const startsWith = (sig: number[], offset = 0) =>
    sig.every((b, i) => bytes[offset + i] === b);
  const ascii = (text: string, offset = 0) =>
    [...text].every((ch, i) => bytes[offset + i] === ch.charCodeAt(0));

  if (startsWith([0xff, 0xd8, 0xff])) return 'image/jpeg';
  if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return 'image/png';
  }
  if (ascii('RIFF') && ascii('WEBP', 8)) return 'image/webp';
  if (ascii('GIF8')) return 'image/gif';
  if (ascii('ID3')) return 'audio/mpeg';
  if (bytes[0] === 0xff && (bytes[1]! & 0xe0) === 0xe0) return 'audio/mpeg';
  if (ascii('OggS')) return 'audio/ogg';
  if (ascii('RIFF') && ascii('WAVE', 8)) return 'audio/wav';
  if (ascii('ftyp', 4)) return 'video/mp4';
  if (startsWith([0x1a, 0x45, 0xdf, 0xa3])) return 'video/webm';
  return null;
}

const IMAGE_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};
const AUDIO_EXT: Record<string, string> = {
  'audio/mpeg': 'mp3',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
};

export function extensionFor(mime: string): string | null {
  return IMAGE_EXT[mime] ?? AUDIO_EXT[mime] ?? null;
}

export function randomKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}
