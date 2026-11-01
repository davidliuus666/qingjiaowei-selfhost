import type { Env } from './util';
import { nowIso } from './util';
import { ensureSchema } from './schema';

/**
 * 生命河（ROLCC）主日讲道自动同步。
 *
 * 来源页面是一张固定的表：日期 / 崇拜 / 講員 / 主題 / 大綱。
 * 只取「主題」这一列的 MP3，敬拜诗歌不导入。
 *
 * 讲义 PDF 跟音频是同一套文件名，只是大小写不同：
 *   20261025_sermon.mp3 → 20261025_Sermon.pdf
 * 表格里「大綱」那列有链接就用它，没有就按这个规律推出来。
 * 封面统一用生命河的标志图（R2 里的固定文件）。
 */

const SOURCE_URL = 'https://rolcc.net/rolcc2/sunday-media/';
const SOURCE_ORIGIN = 'https://rolcc.net';
const SOURCE_LABEL = '矽谷生命河灵粮堂';

/** 自动建出来的系列：放在「生命河」分类下 */
const SERIES_TITLE = '主日讲道';
const SERIES_SUBTITLE = `转播自${SOURCE_LABEL}`;
const SERIES_MARK = '主';
/** R2 里的生命河标志，所有自动同步的单集都拿它当缩略图 */
export const ROLCC_COVER = '/media/img/rolcc-logo.webp';
export const ROLCC_CATEGORY = 'rolcc';

const KEY_SERIES_ID = 'rolcc_series_id';
const KEY_LAST_DATE = 'rolcc_last_date';
const KEY_ENABLED = 'rolcc_auto_sync';
const KEY_LAST_RUN = 'rolcc_last_run';

/** 页面会挑 User-Agent，用普通浏览器 UA 才稳定返回 200 */
const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

export interface RolccRow {
  date: string;
  title: string;
  speaker: string;
  audioUrl: string;
  pdfUrl: string | null;
}

export interface RolccLastRun {
  at: string;
  ok: boolean;
  imported: number;
  skipped: number;
  latest: {
    date: string;
    title: string;
    speaker: string;
  } | null;
  message: string;
  trigger: 'cron' | 'manual';
}

export interface RolccStatus {
  enabled: boolean;
  series: { id: number; title: string } | null;
  lastDate: string | null;
  lastRun: RolccLastRun | null;
  sourceUrl: string;
  sourceLabel: string;
  schedule: string;
}

async function getSetting(db: D1Database, key: string): Promise<string | null> {
  try {
    const row = await db
      .prepare('SELECT value FROM settings WHERE key = ?')
      .bind(key)
      .first<{ value: string }>();
    return row?.value ?? null;
  } catch {
    // 第一次部署、表还没建的时候按「没有设置」处理
    return null;
  }
}

async function setSetting(
  db: D1Database,
  key: string,
  value: string,
): Promise<void> {
  await db
    .prepare(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    )
    .bind(key, value)
    .run();
}

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, n: string) =>
      String.fromCodePoint(Number(n)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) =>
      String.fromCodePoint(parseInt(n, 16)),
    );
}

function plainText(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function firstHref(html: string): string | null {
  const match = html.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
  if (!match) return null;
  const href = (match[1] || match[2] || '').trim();
  return href || null;
}

/**
 * 从音频地址推讲义地址：只换文件名里的 sermon 大小写和扩展名。
 * 不是 _sermon.mp3 这种命名就返回 null，不乱拼。
 */
export function derivePdfUrl(audioUrl: string): string | null {
  try {
    const url = new URL(audioUrl);
    const path = url.pathname.replace(/_sermon\.mp3$/i, '_Sermon.pdf');
    if (path === url.pathname) return null;
    url.pathname = path;
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return null;
  }
}

function absoluteUrl(href: string): string | null {
  try {
    const url = new URL(href, SOURCE_ORIGIN);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    // 网页版 App 是 https，音频也统一走 https，免得混合内容被浏览器拦
    if (url.protocol === 'http:') url.protocol = 'https:';
    return url.toString();
  } catch {
    return null;
  }
}

function cellsIn(row: string, tag: 'td' | 'th'): string[] {
  const pattern = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
  const cells: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(row)) !== null) {
    cells.push(match[1] ?? '');
  }
  return cells;
}

/**
 * 解析来源页面。按表头认列，不写死第几列；页面以后加一列也不会串位。
 * 导出出来是为了让本地测试可以直接拿保存下来的 HTML 跑。
 */
export function parseRolccPage(html: string): RolccRow[] {
  const table = html.match(/<table\b[\s\S]*?<\/table>/i);
  if (!table) throw new Error('来源页面里没找到讲道表格');

  const rows = table[0].match(/<tr\b[\s\S]*?<\/tr>/gi) ?? [];
  if (rows.length < 2) throw new Error('来源页面的讲道表格是空的');

  const header = (
    cellsIn(rows[0]!, 'th').length
      ? cellsIn(rows[0]!, 'th')
      : cellsIn(rows[0]!, 'td')
  ).map(plainText);
  const dateIndex = header.findIndex(
    (value) => value === '日期' || value === '日期 ',
  );
  const speakerIndex = header.findIndex(
    (value) => value === '講員' || value === '讲员',
  );
  const titleIndex = header.findIndex(
    (value) => value === '主題' || value === '主题',
  );
  const pdfIndex = header.findIndex(
    (value) => value === '大綱' || value === '大纲',
  );
  if (dateIndex < 0 || speakerIndex < 0 || titleIndex < 0) {
    throw new Error('来源页面的表头变了，暂时抓不到日期 / 讲员 / 主题');
  }

  const output: RolccRow[] = [];
  for (const row of rows.slice(1)) {
    const cells = cellsIn(row, 'td');
    if (cells.length <= Math.max(dateIndex, speakerIndex, titleIndex)) {
      continue;
    }
    const date = plainText(cells[dateIndex] ?? '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    const title = plainText(cells[titleIndex] ?? '');
    const speaker = plainText(cells[speakerIndex] ?? '');
    const href = firstHref(cells[titleIndex] ?? '');
    if (!title || !href) continue;
    const audioUrl = absoluteUrl(href);
    if (!audioUrl) continue;
    const pdfHref =
      pdfIndex >= 0 ? firstHref(cells[pdfIndex] ?? '') : null;
    output.push({
      date,
      title,
      speaker,
      audioUrl,
      pdfUrl: pdfHref ? absoluteUrl(pdfHref) : null,
    });
  }

  if (!output.length) {
    throw new Error('来源页面里没有可用的讲道音频');
  }
  output.sort((a, b) => b.date.localeCompare(a.date));
  return output;
}

async function fetchSourceHtml(): Promise<string> {
  // 加一个时间戳，绕过 CDN 缓存；来源页面本身是服务端渲染的，不跑 JS
  const url = new URL(SOURCE_URL);
  url.searchParams.set('_', String(Date.now()));
  const response = await fetch(url.toString(), {
    headers: {
      'user-agent': BROWSER_UA,
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
    },
    redirect: 'follow',
  });
  if (!response.ok) {
    throw new Error(`来源页面暂时打不开（${response.status}）`);
  }
  const html = await response.text();
  if (html.length < 2000) {
    throw new Error('来源页面返回的内容不完整');
  }
  return html;
}

/** 第一次同步时自动建系列；之后认 settings 里记的 id，改名字也不会丢 */
async function findOrCreateSeries(
  env: Env,
): Promise<{ id: number; created: boolean }> {
  const stored = Number((await getSetting(env.DB, KEY_SERIES_ID)) ?? '0');
  if (Number.isInteger(stored) && stored > 0) {
    const existing = await env.DB.prepare(
      'SELECT id FROM series WHERE id = ?',
    )
      .bind(stored)
      .first<{ id: number }>();
    if (existing) return { id: existing.id, created: false };
  }

  const sameName = await env.DB.prepare(
    `SELECT id FROM series
      WHERE category = ? AND title = ?
      ORDER BY id ASC LIMIT 1`,
  )
    .bind(ROLCC_CATEGORY, SERIES_TITLE)
    .first<{ id: number }>();
  if (sameName) {
    await setSetting(env.DB, KEY_SERIES_ID, String(sameName.id));
    return { id: sameName.id, created: false };
  }

  const inserted = await env.DB.prepare(
    `INSERT INTO series (title, subtitle, cover_url, mark, category, sort)
     VALUES (?, ?, NULL, ?, ?, 1)`,
  )
    .bind(SERIES_TITLE, SERIES_SUBTITLE, SERIES_MARK, ROLCC_CATEGORY)
    .run();
  const id = Number(inserted.meta.last_row_id ?? 0);
  if (!id) throw new Error('自动创建系列失败');
  await setSetting(env.DB, KEY_SERIES_ID, String(id));
  return { id, created: true };
}

async function countEpisodes(env: Env, seriesId: number): Promise<number> {
  const row = await env.DB.prepare(
    'SELECT COUNT(*) AS n FROM episodes WHERE series_id = ?',
  )
    .bind(seriesId)
    .first<{ n: number }>();
  return Number(row?.n ?? 0);
}

/** 新的一集放最上面：sort 1 是最新，依次往后 */
async function renumberSeries(env: Env, seriesId: number): Promise<void> {
  const { results } = await env.DB.prepare(
    `SELECT id FROM episodes
      WHERE series_id = ?
      ORDER BY published_at DESC, id DESC`,
  )
    .bind(seriesId)
    .all<{ id: number }>();
  const rows = results ?? [];
  if (!rows.length) return;
  await env.DB.batch(
    rows.map((row, index) =>
      env.DB.prepare('UPDATE episodes SET sort = ? WHERE id = ?').bind(
        index + 1,
        row.id,
      ),
    ),
  );
}

function publishedAt(date: string): string {
  // 来源只有日期；按北京时间当天中午存，App 不显示，只用来排序
  return new Date(`${date}T12:00:00+08:00`).toISOString();
}

async function storeLastRun(
  env: Env,
  result: RolccLastRun,
): Promise<void> {
  try {
    await setSetting(env.DB, KEY_LAST_RUN, JSON.stringify(result));
  } catch {
    // 同步结果记录失败不影响已经导入的内容
  }
}

/**
 * 抓一次。默认只导入「比上次更新的」内容；第一次（或系列为空）只导入最新一期。
 * 这样你删掉的旧集不会被反复加回来；漏了一周也会在下次自动补上。
 */
export async function syncRolcc(
  env: Env,
  options: { trigger?: 'cron' | 'manual' } = {},
): Promise<RolccLastRun> {
  const trigger = options.trigger ?? 'manual';
  const at = nowIso();

  try {
    await ensureSchema(env.DB);
    const html = await fetchSourceHtml();
    const rows = parseRolccPage(html);
    const latest = rows[0]!;

    const series = await findOrCreateSeries(env);
    const isNewSeries =
      series.created || (await countEpisodes(env, series.id)) === 0;
    const lastDate = isNewSeries
      ? null
      : await getSetting(env.DB, KEY_LAST_DATE);

    const candidates = lastDate
      ? rows.filter((row) => row.date > lastDate)
      : [latest];

    let imported = 0;
    let skipped = 0;
    // 从旧到新插入，id 的顺序跟讲道日期一致
    for (const row of [...candidates].reverse()) {
      const exists = await env.DB.prepare(
        'SELECT id FROM episodes WHERE media_url = ? LIMIT 1',
      )
        .bind(row.audioUrl)
        .first<{ id: number }>();
      if (exists) {
        skipped += 1;
        continue;
      }
      await env.DB.prepare(
        `INSERT INTO episodes
           (series_id, title, episode_no, speaker, duration, summary,
            media_type, media_url, resource_url, cover_url, published_at, sort)
         VALUES (?, ?, NULL, ?, NULL, NULL, 'audio', ?, ?, ?, ?, 0)`,
      )
        .bind(
          series.id,
          row.title,
          row.speaker || null,
          row.audioUrl,
          row.pdfUrl ?? derivePdfUrl(row.audioUrl),
          ROLCC_COVER,
          publishedAt(row.date),
        )
        .run();
      imported += 1;
    }

    // 以前同步进来的单集没有封面 / 讲义：补上，但不覆盖后台手动改过的
    await env.DB.prepare(
      `UPDATE episodes SET cover_url = ?
        WHERE series_id = ? AND (cover_url IS NULL OR cover_url = '')`,
    )
      .bind(ROLCC_COVER, series.id)
      .run();
    await env.DB.batch(
      rows.map((row) =>
        env.DB.prepare(
          `UPDATE episodes SET resource_url = ?
            WHERE series_id = ? AND media_url = ?
              AND (resource_url IS NULL OR resource_url = '')`,
        ).bind(
          row.pdfUrl ?? derivePdfUrl(row.audioUrl),
          series.id,
          row.audioUrl,
        ),
      ),
    );

    await renumberSeries(env, series.id);

    // 水位只往前推，不因为来源页面回滚而倒退
    if (!lastDate || latest.date > lastDate) {
      await setSetting(env.DB, KEY_LAST_DATE, latest.date);
    }

    const result: RolccLastRun = {
      at,
      ok: true,
      imported,
      skipped,
      latest: {
        date: latest.date,
        title: latest.title,
        speaker: latest.speaker,
      },
      message:
        imported > 0
          ? `新导入 ${imported} 期`
          : skipped > 0
            ? '这一期已经在内容里了'
            : '没有新内容',
      trigger,
    };
    await storeLastRun(env, result);
    return result;
  } catch (error) {
    const result: RolccLastRun = {
      at,
      ok: false,
      imported: 0,
      skipped: 0,
      latest: null,
      message: error instanceof Error ? error.message : '同步失败',
      trigger,
    };
    await storeLastRun(env, result);
    console.error('rolcc sync failed', error);
    return result;
  }
}

export async function isRolccEnabled(env: Env): Promise<boolean> {
  // 自部署版默认关闭：别的组不会莫名多出一个「生命河」系列。
  // 需要在后台「自动同步」里明确打开。
  return (await getSetting(env.DB, KEY_ENABLED)) === '1';
}

export async function setRolccEnabled(
  env: Env,
  enabled: boolean,
): Promise<void> {
  await ensureSchema(env.DB);
  await setSetting(env.DB, KEY_ENABLED, enabled ? '1' : '0');
}

export async function getRolccStatus(env: Env): Promise<RolccStatus> {
  await ensureSchema(env.DB);
  const seriesId = Number((await getSetting(env.DB, KEY_SERIES_ID)) ?? '0');
  let series: { id: number; title: string } | null = null;
  if (Number.isInteger(seriesId) && seriesId > 0) {
    series = await env.DB.prepare(
      'SELECT id, title FROM series WHERE id = ?',
    )
      .bind(seriesId)
      .first<{ id: number; title: string }>();
  }

  const rawRun = await getSetting(env.DB, KEY_LAST_RUN);
  let lastRun: RolccLastRun | null = null;
  if (rawRun) {
    try {
      lastRun = JSON.parse(rawRun) as RolccLastRun;
    } catch {
      lastRun = null;
    }
  }

  return {
    enabled: await isRolccEnabled(env),
    series,
    lastDate: await getSetting(env.DB, KEY_LAST_DATE),
    lastRun,
    sourceUrl: SOURCE_URL,
    sourceLabel: SOURCE_LABEL,
    schedule: '每周一 21:00（北京时间）',
  };
}
