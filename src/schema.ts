import { nowIso } from './util';

export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS slides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_url TEXT NOT NULL DEFAULT '',
  link_url TEXT,
  sort INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  summary TEXT,
  body TEXT NOT NULL,
  cover_url TEXT,
  published_at TEXT NOT NULL,
  is_published INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS meetings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic TEXT NOT NULL,
  scripture TEXT,
  leader TEXT,
  place TEXT,
  cover_url TEXT,
  starts_at TEXT NOT NULL,
  ends_at TEXT,
  is_online INTEGER NOT NULL DEFAULT 0,
  online_url TEXT,
  online_override INTEGER NOT NULL DEFAULT 0,
  mode TEXT NOT NULL DEFAULT 'offline',
  repeat_weekly INTEGER NOT NULL DEFAULT 0,
  weekday INTEGER,
  start_time TEXT,
  end_time TEXT
);
CREATE TABLE IF NOT EXISTS home_cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL DEFAULT 'meeting',
  ref_id INTEGER,
  title TEXT,
  cover_url TEXT,
  sort INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS series (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  subtitle TEXT,
  cover_url TEXT,
  mark TEXT,
  category TEXT NOT NULL DEFAULT 'sermon',
  sort INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS episodes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  series_id INTEGER,
  title TEXT NOT NULL,
  episode_no INTEGER,
  speaker TEXT,
  duration TEXT,
  summary TEXT,
  media_type TEXT NOT NULL DEFAULT 'none',
  media_url TEXT,
  resource_url TEXT,
  cover_url TEXT,
  published_at TEXT,
  sort INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS group_info (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  name TEXT NOT NULL,
  intro TEXT,
  leader TEXT,
  theme_mode TEXT NOT NULL DEFAULT 'system'
);
CREATE TABLE IF NOT EXISTS prayers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  is_published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS login_attempts (
  ip TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  first_at TEXT NOT NULL,
  last_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS invites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash TEXT NOT NULL UNIQUE,
  label TEXT,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  max_uses INTEGER NOT NULL DEFAULT 1,
  used_count INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS devices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_seen_at TEXT,
  revoked_at TEXT,
  invite_id INTEGER
);
CREATE TABLE IF NOT EXISTS quizzes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  is_published INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT
);
CREATE TABLE IF NOT EXISTS quiz_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_id INTEGER NOT NULL,
  kind TEXT NOT NULL DEFAULT 'single',
  prompt TEXT NOT NULL,
  options TEXT,
  answer_key TEXT,
  sort INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS quiz_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_id INTEGER NOT NULL,
  device_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  grade TEXT,
  comment TEXT,
  show_paper INTEGER NOT NULL DEFAULT 0,
  submitted_at TEXT NOT NULL,
  graded_at TEXT,
  locked_at TEXT,
  lock_reason TEXT,
  updated_at TEXT
);
CREATE TABLE IF NOT EXISTS quiz_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  answer TEXT
);
CREATE TABLE IF NOT EXISTS class_notices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_published INTEGER NOT NULL DEFAULT 1,
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT
);
CREATE TABLE IF NOT EXISTS class_homeworks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  due_at TEXT NOT NULL,
  is_published INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT
);
CREATE TABLE IF NOT EXISTS class_homework_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  homework_id INTEGER NOT NULL,
  kind TEXT NOT NULL DEFAULT 'single',
  prompt TEXT NOT NULL,
  options TEXT,
  sort INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS class_homework_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  homework_id INTEGER NOT NULL,
  device_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted',
  submitted_at TEXT NOT NULL,
  updated_at TEXT,
  graded_at TEXT,
  returned_at TEXT
);
CREATE TABLE IF NOT EXISTS class_homework_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  answer TEXT,
  score TEXT,
  comment TEXT
);
CREATE INDEX IF NOT EXISTS idx_episodes_series ON episodes(series_id);
CREATE INDEX IF NOT EXISTS idx_episodes_media ON episodes(media_url);
CREATE INDEX IF NOT EXISTS idx_devices_token ON devices(token_hash);
CREATE INDEX IF NOT EXISTS idx_invites_token ON invites(token_hash);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_quiz ON quiz_submissions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_sub ON quiz_answers(submission_id);
CREATE INDEX IF NOT EXISTS idx_class_notices_published ON class_notices(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_homework_questions_homework ON class_homework_questions(homework_id);
CREATE INDEX IF NOT EXISTS idx_homework_submissions_homework ON class_homework_submissions(homework_id);
CREATE INDEX IF NOT EXISTS idx_homework_answers_sub ON class_homework_answers(submission_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_homework_sub_device ON class_homework_submissions(homework_id, device_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_homework_answer_question ON class_homework_answers(submission_id, question_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_quiz_sub_device ON quiz_submissions(quiz_id, device_id);
`;

/** 后加的列。CREATE TABLE IF NOT EXISTS 不会动老表，所以单独补一次 */
const ADDED_COLUMNS: Array<[string, string, string]> = [
  ['meetings', 'cover_url', 'TEXT'],
  ['meetings', 'mode', "TEXT NOT NULL DEFAULT 'offline'"],
  ['meetings', 'repeat_weekly', 'INTEGER NOT NULL DEFAULT 0'],
  ['meetings', 'weekday', 'INTEGER'],
  ['meetings', 'start_time', 'TEXT'],
  ['meetings', 'end_time', 'TEXT'],
  // App 的默认外观（跟随系统 / 浅色 / 深色）；手机自己选过就按手机的来
  ['group_info', 'theme_mode', "TEXT NOT NULL DEFAULT 'system'"],
  // 老二维码都是一次性的，补列后按 1 人处理
  // 单集的资料链接（PPT / 讲义网页），老库补一列
  ['episodes', 'resource_url', 'TEXT'],
  // 单集自己的缩略封面（生命河那种自动同步的用固定图）
  ['episodes', 'cover_url', 'TEXT'],
  ['invites', 'max_uses', 'INTEGER NOT NULL DEFAULT 1'],
  ['invites', 'used_count', 'INTEGER NOT NULL DEFAULT 0'],
  // 题目的参考答案（选填），只给后台批改用，不下发给 App
  ['quiz_questions', 'answer_key', 'TEXT'],
  // 批改后是否允许学生回看题目、自己的作答和参考答案
  ['quiz_submissions', 'show_paper', 'INTEGER NOT NULL DEFAULT 0'],
];

export async function ensureSchema(db: D1Database): Promise<void> {
  // 注意：D1 的 exec() 是按换行切语句的，多行 DDL 会被切坏，
  // 所以这里自己按分号拆成单条语句再执行。
  const statements = SCHEMA_SQL.split(';')
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0)
    .map((statement) => db.prepare(statement));
  for (const statement of statements) {
    await statement.run();
  }
  // 老库补字段：已经有了会报 duplicate column，忽略即可
  for (const [table, name, declaration] of ADDED_COLUMNS) {
    try {
      await db
        .prepare(`ALTER TABLE ${table} ADD COLUMN ${name} ${declaration}`)
        .run();
    } catch {
      /* 这一列已经有了 */
    }
  }
  await migrateData(db);
}

/**
 * 一次性的数据整形，用 settings 里的标记保证只跑一次：
 * 1. 老的「线上开关」→ 三种聚会方式
 * 2. 系列排序改成普通/特别/生命河各自编号
 * 不动聚会的时间：是否每周重复由你自己在后台勾，不替旧数据做主。
 */
async function migrateData(db: D1Database): Promise<void> {
  const flag = await db
    .prepare("SELECT value FROM settings WHERE key = 'migrated_meetings_v2'")
    .first<{ value: string }>();
  if (flag) return;

  await db
    .prepare(
      `UPDATE meetings SET mode = CASE
         WHEN is_online = 1 AND place IS NOT NULL AND place != '' THEN 'hybrid'
         WHEN is_online = 1 THEN 'online'
         ELSE 'offline'
       END`,
    )
    .run();

  const { results: seriesRows } = await db
    .prepare('SELECT id, category FROM series ORDER BY category ASC, sort ASC, id ASC')
    .all<{ id: number; category: string }>();
  const counters = new Map<string, number>();
  const renumber = [];
  for (const row of seriesRows ?? []) {
    const next = (counters.get(row.category) ?? 0) + 1;
    counters.set(row.category, next);
    renumber.push(db.prepare('UPDATE series SET sort = ? WHERE id = ?').bind(next, row.id));
  }
  if (renumber.length > 0) await db.batch(renumber);

  await db
    .prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('migrated_meetings_v2', ?)")
    .bind(nowIso())
    .run();
}

/**
 * 第一次把小组开起来：只建小组信息 + 一条欢迎公告。
 * 不再自动灌「青椒味」示例系列/聚会/祷告，避免别的组一打开就是假数据。
 */
export async function seedIfEmpty(
  db: D1Database,
  groupName = '我的小组',
  lang: 'zh' | 'en' = 'zh',
): Promise<boolean> {
  const row = await db
    .prepare('SELECT COUNT(*) AS n FROM group_info')
    .first<{ n: number }>();
  if ((row?.n ?? 0) > 0) return false;

  const en = lang === 'en';
  const now = nowIso();
  await db.batch([
    db
      .prepare(
        'INSERT INTO group_info (id, name, intro, leader) VALUES (1, ?, ?, ?)',
      )
      .bind(groupName, '', ''),
    db
      .prepare(
        'INSERT INTO announcements (title, summary, body, cover_url, published_at, is_published) VALUES (?, ?, ?, ?, ?, 1)',
      )
      .bind(
        en ? 'Welcome' : '欢迎使用',
        en ? 'Set up your group in the admin first' : '先去后台把小组信息填好',
        en
          ? `This admin belongs to your own group.\n\nThree things to do first:\n1. Fill in the group name and intro under "Group info".\n2. Add your first meeting under "Meetings".\n3. Generate a QR code under "Access" and share it with your group so people can join.\n\nYou can edit or delete this announcement under "Announcements".`
          : `这是你的小组自己的后台。\n\n建议先做三件事：\n1. 在「小组信息」里填小组名称和简介。\n2. 在「聚会」里添加第一场聚会。\n3. 在「安全」里生成二维码，发到群里让大家扫码加入。\n\n这条公告可以在「公告」里改掉或删除。`,
        null,
        now,
      ),
  ]);
  return true;
}
