import { nowIso, trimmed, type Env } from './util';

/**
 * 课堂作业：一份轻量问卷。
 * 学生在截止前随便改，草稿只留在手机上，提交后老师才看得到；
 * 老师逐题打分 / 写评语，最后选「无需修正」定稿或者「发回修正」。
 * 没有账号体系，一台手机（设备通行证）同一份作业只能有一份提交。
 */

type Row = Record<string, unknown>;

export const MAX_HOMEWORK_QUESTIONS = 30;
const MAX_OPTIONS = 8;
const MAX_NAME = 40;
const MAX_SCORE = 40;
const MAX_COMMENT = 1000;

const QUESTION_KINDS = ['single', 'essay'];

export interface HomeworkQuestion {
  id: number;
  kind: string;
  prompt: string;
  options: string[];
  sort: number;
}

export interface HomeworkAnswerInput {
  questionId: number;
  answer: string;
}

interface HomeworkRow {
  id: number;
  title: string;
  description: string | null;
  due_at: string;
  is_published: number;
  published_at: string | null;
  created_at: string;
  updated_at: string | null;
}

interface SubmissionRow {
  id: number;
  homework_id: number;
  device_id: number;
  name: string;
  status: string;
  submitted_at: string;
  updated_at: string | null;
  graded_at: string | null;
  returned_at: string | null;
}

interface AnswerRow {
  question_id: number;
  answer: string | null;
  score: string | null;
  comment: string | null;
}

function parseOptions(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim().slice(0, 300))
      .filter((item) => item.length > 0)
      .slice(0, MAX_OPTIONS);
  }
  if (typeof value === 'string' && value.trim()) {
    try {
      return parseOptions(JSON.parse(value));
    } catch {
      return [];
    }
  }
  return [];
}

function parseAnswers(value: unknown): HomeworkAnswerInput[] {
  if (!Array.isArray(value)) return [];
  const out: HomeworkAnswerInput[] = [];
  for (const item of value.slice(0, MAX_HOMEWORK_QUESTIONS * 2)) {
    if (!item || typeof item !== 'object') continue;
    const row = item as Row;
    const questionId = Number(row.questionId);
    if (!Number.isInteger(questionId) || questionId <= 0) continue;
    out.push({
      questionId,
      answer: typeof row.answer === 'string' ? row.answer.trim().slice(0, 5000) : '',
    });
  }
  return out;
}

function homeworkName(value: unknown): string {
  return trimmed(value, MAX_NAME) ?? '';
}

function flag(value: unknown): boolean {
  return value === true || value === 1 || value === '1' || value === 'true';
}

function dueAt(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('请设置截止时间');
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error('截止时间格式不对');
  return date.toISOString();
}

function isOverdue(due: string): boolean {
  const at = Date.parse(due);
  return Number.isFinite(at) && Date.now() > at;
}

async function loadHomework(
  env: Env,
  id: number,
  onlyPublished: boolean,
): Promise<HomeworkRow | null> {
  return env.DB.prepare(
    `SELECT id, title, description, due_at, is_published, published_at, created_at, updated_at
     FROM class_homeworks WHERE id = ?${onlyPublished ? ' AND is_published = 1' : ''}`,
  )
    .bind(id)
    .first<HomeworkRow>();
}

async function loadQuestions(
  env: Env,
  homeworkId: number,
): Promise<HomeworkQuestion[]> {
  const { results } = await env.DB.prepare(
    `SELECT id, kind, prompt, options, sort FROM class_homework_questions
     WHERE homework_id = ? ORDER BY sort ASC, id ASC`,
  )
    .bind(homeworkId)
    .all<{
      id: number;
      kind: string;
      prompt: string;
      options: string | null;
      sort: number;
    }>();
  return (results ?? []).map((row) => ({
    id: row.id,
    kind: row.kind === 'essay' ? 'essay' : 'single',
    prompt: row.prompt,
    options: parseOptions(row.options),
    sort: row.sort,
  }));
}

async function loadSubmission(
  env: Env,
  homeworkId: number,
  deviceId: number,
): Promise<SubmissionRow | null> {
  return env.DB.prepare(
    `SELECT id, homework_id, device_id, name, status, submitted_at, updated_at,
            graded_at, returned_at
     FROM class_homework_submissions WHERE homework_id = ? AND device_id = ?`,
  )
    .bind(homeworkId, deviceId)
    .first<SubmissionRow>();
}

async function loadAnswers(
  env: Env,
  submissionId: number,
): Promise<AnswerRow[]> {
  const { results } = await env.DB.prepare(
    `SELECT question_id, answer, score, comment FROM class_homework_answers
     WHERE submission_id = ?`,
  )
    .bind(submissionId)
    .all<AnswerRow>();
  return results ?? [];
}

// ------------------------------------------------------------------ App 接口

/** 课堂流的作业列表：已发布的，最新发布的在前，带这台手机的状态 */
export async function listHomeworksForDevice(env: Env, deviceId: number) {
  const { results } = await env.DB.prepare(
    `SELECT h.id, h.title, h.description, h.due_at,
            COALESCE(h.published_at, h.created_at) AS published_at,
            (SELECT COUNT(*) FROM class_homework_questions q
              WHERE q.homework_id = h.id) AS question_count,
            s.status AS my_status,
            s.submitted_at AS my_submitted_at
     FROM class_homeworks h
     LEFT JOIN class_homework_submissions s ON s.homework_id = h.id AND s.device_id = ?
     WHERE h.is_published = 1
     ORDER BY COALESCE(h.published_at, h.created_at) DESC, h.id DESC`,
  )
    .bind(deviceId)
    .all<{
      id: number;
      title: string;
      description: string | null;
      due_at: string;
      published_at: string | null;
      question_count: number;
      my_status: string | null;
      my_submitted_at: string | null;
    }>();

  return (results ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    dueAt: row.due_at,
    publishedAt: row.published_at,
    questionCount: row.question_count ?? 0,
    myStatus: row.my_status ?? 'none',
    mySubmittedAt: row.my_submitted_at,
  }));
}

/** 单个作业：草稿不在服务器上，所以这里只会有已提交/已批改/已发回的状态 */
export async function getHomeworkForDevice(
  env: Env,
  homeworkId: number,
  deviceId: number,
) {
  const homework = await loadHomework(env, homeworkId, true);
  if (!homework) return null;
  const questions = await loadQuestions(env, homeworkId);
  const submission = await loadSubmission(env, homeworkId, deviceId);
  const answers = submission ? await loadAnswers(env, submission.id) : [];
  const answerMap = new Map<number, AnswerRow>(
    answers.map((row) => [row.question_id, row]),
  );
  const showFeedback =
    submission?.status === 'graded' || submission?.status === 'returned';
  const duePassed = isOverdue(homework.due_at);
  const canEdit =
    submission != null
      ? submission.status === 'returned'
      : !duePassed && questions.length > 0;

  return {
    id: homework.id,
    title: homework.title,
    description: homework.description,
    dueAt: homework.due_at,
    publishedAt: homework.published_at,
    questionCount: questions.length,
    duePassed,
    canEdit,
    questions: questions.map((question) => ({
      id: question.id,
      kind: question.kind,
      prompt: question.prompt,
      options: question.options,
    })),
    mySubmission: submission
      ? {
          id: submission.id,
          name: submission.name,
          status: submission.status,
          submittedAt: submission.submitted_at,
          gradedAt: submission.graded_at,
          returnedAt: submission.returned_at,
          answers: questions.map((question) => {
            const row = answerMap.get(question.id);
            return {
              questionId: question.id,
              answer: row?.answer ?? '',
              score: showFeedback ? row?.score ?? null : null,
              comment: showFeedback ? row?.comment ?? null : null,
            };
          }),
        }
      : null,
  };
}

/**
 * 交作业：必须是完整的一份（所有题都答了）。
 * 提交后学生不能再改；老师发回修正后可以重新提交，旧批改清空、重新逐题批。
 */
export async function submitHomework(
  env: Env,
  homeworkId: number,
  deviceId: number,
  body: Row,
): Promise<{ ok: true; status: string } | { error: string; status: number }> {
  const homework = await loadHomework(env, homeworkId, true);
  if (!homework) return { error: '这份作业已经下架了', status: 404 };
  const questions = await loadQuestions(env, homeworkId);
  if (!questions.length) return { error: '这份作业还没有题目', status: 400 };

  const submission = await loadSubmission(env, homeworkId, deviceId);
  if (submission?.status === 'submitted') {
    return { error: '已经提交了，等老师批改', status: 409 };
  }
  if (submission?.status === 'graded') {
    return { error: '作业已经批改完成，不能再改', status: 409 };
  }
  const returning = submission?.status === 'returned';
  if (!returning && isOverdue(homework.due_at)) {
    return { error: '作业已经截止，不能再提交', status: 400 };
  }

  const name = homeworkName(body.name) || submission?.name || '';
  if (!name) return { error: '请先填写姓名', status: 400 };

  const allowed = new Map(questions.map((question) => [question.id, question]));
  const input = parseAnswers(body.answers);
  const answerMap = new Map<number, string>();
  for (const item of input) {
    const question = allowed.get(item.questionId);
    if (!question) continue;
    let value = item.answer;
    if (question.kind === 'single' && !question.options.includes(value)) {
      value = '';
    }
    answerMap.set(item.questionId, value);
  }
  for (const question of questions) {
    if (!(answerMap.get(question.id) ?? '').trim()) {
      return { error: '还有题目没有作答', status: 400 };
    }
  }

  const now = nowIso();
  let submissionId = submission?.id ?? 0;
  if (!submissionId) {
    const result = await env.DB.prepare(
      `INSERT INTO class_homework_submissions
         (homework_id, device_id, name, status, submitted_at, updated_at)
       VALUES (?, ?, ?, 'submitted', ?, ?)`,
    )
      .bind(homeworkId, deviceId, name, now, now)
      .run();
    submissionId = Number(result.meta?.last_row_id ?? 0);
    if (!submissionId) return { error: '提交失败，请再试一次', status: 500 };
  } else {
    await env.DB.prepare(
      `UPDATE class_homework_submissions
       SET name = ?, status = 'submitted', submitted_at = ?, updated_at = ?,
           graded_at = NULL, returned_at = NULL
       WHERE id = ?`,
    )
      .bind(name, now, now, submissionId)
      .run();
  }

  const existing = new Set((await loadAnswers(env, submissionId)).map((row) => row.question_id));
  const statements: D1PreparedStatement[] = [];
  for (const question of questions) {
    const value = answerMap.get(question.id) ?? '';
    if (existing.has(question.id)) {
      statements.push(
        env.DB.prepare(
          'UPDATE class_homework_answers SET answer = ? WHERE submission_id = ? AND question_id = ?',
        ).bind(value, submissionId, question.id),
      );
    } else {
      statements.push(
        env.DB.prepare(
          'INSERT INTO class_homework_answers (submission_id, question_id, answer) VALUES (?, ?, ?)',
        ).bind(submissionId, question.id, value),
      );
    }
  }
  const keep = questions.map((question) => question.id);
  if (keep.length) {
    statements.push(
      env.DB.prepare(
        `DELETE FROM class_homework_answers
         WHERE submission_id = ? AND question_id NOT IN (${keep.map(() => '?').join(',')})`,
      ).bind(submissionId, ...keep),
    );
  } else {
    statements.push(
      env.DB.prepare('DELETE FROM class_homework_answers WHERE submission_id = ?').bind(
        submissionId,
      ),
    );
  }
  // 发回修正后重新提交：上一轮的分数和评语全部清掉，老师必须重新逐题批。
  // 否则老师可以直接点定稿，旧的批改会被当成这一轮的结果。
  if (returning) {
    statements.push(
      env.DB.prepare(
        'UPDATE class_homework_answers SET score = NULL, comment = NULL WHERE submission_id = ?',
      ).bind(submissionId),
    );
  }
  if (statements.length) await env.DB.batch(statements);
  return { ok: true, status: 'submitted' };
}

// ---------------------------------------------------------------- 后台接口

export async function listHomeworksForAdmin(env: Env) {
  const { results } = await env.DB.prepare(
    `SELECT h.id, h.title, h.description, h.due_at, h.is_published, h.published_at,
            h.created_at, h.updated_at,
            (SELECT COUNT(*) FROM class_homework_questions q
              WHERE q.homework_id = h.id) AS question_count,
            (SELECT COUNT(*) FROM class_homework_submissions s
              WHERE s.homework_id = h.id) AS submission_count,
            (SELECT COUNT(*) FROM class_homework_submissions s
              WHERE s.homework_id = h.id AND s.status = 'submitted') AS pending_count,
            (SELECT COUNT(*) FROM class_homework_submissions s
              WHERE s.homework_id = h.id AND s.status = 'graded') AS graded_count,
            (SELECT COUNT(*) FROM class_homework_submissions s
              WHERE s.homework_id = h.id AND s.status = 'returned') AS returned_count
     FROM class_homeworks h
     ORDER BY h.created_at DESC, h.id DESC`,
  ).all<{
    id: number;
    title: string;
    description: string | null;
    due_at: string;
    is_published: number;
    published_at: string | null;
    created_at: string;
    updated_at: string | null;
    question_count: number;
    submission_count: number;
    pending_count: number;
    graded_count: number;
    returned_count: number;
  }>();

  return (results ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    dueAt: row.due_at,
    isPublished: row.is_published === 1,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    questionCount: row.question_count ?? 0,
    submissionCount: row.submission_count ?? 0,
    pendingCount: row.pending_count ?? 0,
    gradedCount: row.graded_count ?? 0,
    returnedCount: row.returned_count ?? 0,
  }));
}

export async function getHomeworkForAdmin(env: Env, id: number) {
  const homework = await loadHomework(env, id, false);
  if (!homework) return null;
  const questions = await loadQuestions(env, id);
  const { results } = await env.DB.prepare(
    `SELECT s.id, s.name, s.status, s.submitted_at, s.updated_at, s.graded_at,
            s.returned_at, d.name AS device_name
     FROM class_homework_submissions s
     LEFT JOIN devices d ON d.id = s.device_id
     WHERE s.homework_id = ?
     ORDER BY s.submitted_at DESC, s.id DESC`,
  )
    .bind(id)
    .all<{
      id: number;
      name: string;
      status: string;
      submitted_at: string;
      updated_at: string | null;
      graded_at: string | null;
      returned_at: string | null;
      device_name: string | null;
    }>();

  return {
    id: homework.id,
    title: homework.title,
    description: homework.description,
    dueAt: homework.due_at,
    isPublished: homework.is_published === 1,
    publishedAt: homework.published_at,
    createdAt: homework.created_at,
    updatedAt: homework.updated_at,
    questions,
    submissions: (results ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      deviceName: row.device_name,
      status: row.status,
      submittedAt: row.submitted_at,
      updatedAt: row.updated_at,
      gradedAt: row.graded_at,
      returnedAt: row.returned_at,
    })),
  };
}

interface QuestionInput {
  id: number;
  kind: string;
  prompt: string;
  options: string[];
}

function questionInput(value: unknown): QuestionInput {
  if (!value || typeof value !== 'object') throw new Error('题目格式不对');
  const row = value as Row;
  const prompt = trimmed(row.prompt, 2000);
  if (!prompt) throw new Error('题干不能为空');
  const kind = QUESTION_KINDS.includes(String(row.kind)) ? String(row.kind) : 'single';
  const options = kind === 'single' ? parseOptions(row.options) : [];
  if (kind === 'single' && options.length < 2) {
    throw new Error('单选题至少要两个选项');
  }
  return { id: Number(row.id) || 0, kind, prompt, options };
}

export async function createHomework(env: Env, body: Row) {
  const title = trimmed(body.title, 120);
  if (!title) throw new Error('作业标题不能为空');
  const description = trimmed(body.description, 5000);
  const due = dueAt(body.dueAt);
  const published = flag(body.isPublished);
  if (published && Array.isArray(body.questions) && !body.questions.length) {
    throw new Error('至少加一道题再发布');
  }
  const now = nowIso();
  const result = await env.DB.prepare(
    `INSERT INTO class_homeworks
       (title, description, due_at, is_published, published_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(title, description, due, published ? 1 : 0, published ? now : null, now, now)
    .run();
  const id = Number(result.meta?.last_row_id ?? 0);
  if (!id) throw new Error('保存失败，请再试一次');
  if (Array.isArray(body.questions)) {
    await syncQuestions(env, id, body.questions);
  }
  return { ok: true, id };
}

export async function updateHomework(env: Env, id: number, body: Row) {
  const homework = await loadHomework(env, id, false);
  if (!homework) throw new Error('找不到这份作业');
  const title = trimmed(body.title, 120);
  if (!title) throw new Error('作业标题不能为空');
  const description = trimmed(body.description, 5000);
  const due = dueAt(body.dueAt);
  const published = flag(body.isPublished);
  if (published && Array.isArray(body.questions) && !body.questions.length) {
    throw new Error('至少加一道题再发布');
  }
  const now = nowIso();
  const publishedAt = published && !homework.published_at ? now : homework.published_at;
  await env.DB.prepare(
    `UPDATE class_homeworks
     SET title = ?, description = ?, due_at = ?, is_published = ?, published_at = ?, updated_at = ?
     WHERE id = ?`,
  )
    .bind(title, description, due, published ? 1 : 0, publishedAt, now, id)
    .run();
  if (Array.isArray(body.questions)) {
    await syncQuestions(env, id, body.questions);
  }
  return { ok: true };
}

async function syncQuestions(
  env: Env,
  homeworkId: number,
  rawList: unknown[],
): Promise<void> {
  const existing = await loadQuestions(env, homeworkId);
  const existingIds = new Set(existing.map((question) => question.id));
  const keep = new Set<number>();
  const statements: D1PreparedStatement[] = [];

  rawList.slice(0, MAX_HOMEWORK_QUESTIONS).forEach((raw, index) => {
    const question = questionInput(raw);
    if (question.id && existingIds.has(question.id)) {
      keep.add(question.id);
      statements.push(
        env.DB.prepare(
          'UPDATE class_homework_questions SET kind = ?, prompt = ?, options = ?, sort = ? WHERE id = ? AND homework_id = ?',
        ).bind(
          question.kind,
          question.prompt,
          JSON.stringify(question.options),
          index,
          question.id,
          homeworkId,
        ),
      );
    } else {
      statements.push(
        env.DB.prepare(
          'INSERT INTO class_homework_questions (homework_id, kind, prompt, options, sort) VALUES (?, ?, ?, ?, ?)',
        ).bind(homeworkId, question.kind, question.prompt, JSON.stringify(question.options), index),
      );
    }
  });

  for (const question of existing) {
    if (keep.has(question.id)) continue;
    statements.push(
      env.DB.prepare('DELETE FROM class_homework_answers WHERE question_id = ?').bind(question.id),
      env.DB.prepare('DELETE FROM class_homework_questions WHERE id = ?').bind(question.id),
    );
  }
  if (statements.length) await env.DB.batch(statements);
}

export async function deleteHomework(env: Env, id: number): Promise<void> {
  await env.DB.batch([
    env.DB.prepare(
      'DELETE FROM class_homework_answers WHERE submission_id IN (SELECT id FROM class_homework_submissions WHERE homework_id = ?)',
    ).bind(id),
    env.DB.prepare('DELETE FROM class_homework_answers WHERE question_id IN (SELECT id FROM class_homework_questions WHERE homework_id = ?)').bind(id),
    env.DB.prepare('DELETE FROM class_homework_submissions WHERE homework_id = ?').bind(id),
    env.DB.prepare('DELETE FROM class_homework_questions WHERE homework_id = ?').bind(id),
    env.DB.prepare('DELETE FROM class_homeworks WHERE id = ?').bind(id),
  ]);
}

export async function getHomeworkSubmissionForAdmin(
  env: Env,
  homeworkId: number,
  submissionId: number,
) {
  const homework = await loadHomework(env, homeworkId, false);
  if (!homework) return null;
  const submission = await env.DB.prepare(
    `SELECT s.id, s.name, s.status, s.submitted_at, s.updated_at, s.graded_at,
            s.returned_at, d.name AS device_name
     FROM class_homework_submissions s
     LEFT JOIN devices d ON d.id = s.device_id
     WHERE s.id = ? AND s.homework_id = ?`,
  )
    .bind(submissionId, homeworkId)
    .first<{
      id: number;
      name: string;
      status: string;
      submitted_at: string;
      updated_at: string | null;
      graded_at: string | null;
      returned_at: string | null;
      device_name: string | null;
    }>();
  if (!submission) return null;

  const { results } = await env.DB.prepare(
    `SELECT q.id AS question_id, q.kind, q.prompt, q.options, q.sort,
            a.answer, a.score, a.comment
     FROM class_homework_questions q
     LEFT JOIN class_homework_answers a
       ON a.question_id = q.id AND a.submission_id = ?
     WHERE q.homework_id = ?
     ORDER BY q.sort ASC, q.id ASC`,
  )
    .bind(submissionId, homeworkId)
    .all<{
      question_id: number;
      kind: string;
      prompt: string;
      options: string | null;
      sort: number;
      answer: string | null;
      score: string | null;
      comment: string | null;
    }>();

  return {
    homeworkId: homework.id,
    homeworkTitle: homework.title,
    dueAt: homework.due_at,
    id: submission.id,
    name: submission.name,
    deviceName: submission.device_name,
    status: submission.status,
    submittedAt: submission.submitted_at,
    updatedAt: submission.updated_at,
    gradedAt: submission.graded_at,
    returnedAt: submission.returned_at,
    answers: (results ?? []).map((row) => ({
      questionId: row.question_id,
      kind: row.kind === 'essay' ? 'essay' : 'single',
      prompt: row.prompt,
      options: parseOptions(row.options),
      answer: row.answer ?? '',
      score: row.score ?? '',
      comment: row.comment ?? '',
    })),
  };
}

/** 逐题批改：每题的分数、评语都可留空，但定稿/发回前每道题至少要有一项 */
export async function gradeHomeworkSubmission(
  env: Env,
  homeworkId: number,
  submissionId: number,
  body: Row,
): Promise<{ ok: true; status: string } | { error: string; status: number }> {
  const submission = await env.DB.prepare(
    `SELECT id, status FROM class_homework_submissions
     WHERE id = ? AND homework_id = ?`,
  )
    .bind(submissionId, homeworkId)
    .first<{ id: number; status: string }>();
  if (!submission) return { error: '找不到这份作业', status: 404 };
  if (submission.status !== 'submitted') {
    return { error: '这份作业现在不能批改', status: 409 };
  }

  const action =
    body.action === 'keep' ? 'keep' : body.action === 'return' ? 'return' : 'save';
  const questions = await loadQuestions(env, homeworkId);
  const allowed = new Set(questions.map((question) => question.id));
  const input = Array.isArray(body.answers) ? body.answers : [];
  const seen = new Set<number>();
  const statements: D1PreparedStatement[] = [];

  for (const item of input.slice(0, MAX_HOMEWORK_QUESTIONS * 2)) {
    if (!item || typeof item !== 'object') continue;
    const row = item as Row;
    const questionId = Number(row.questionId);
    if (!Number.isInteger(questionId) || !allowed.has(questionId) || seen.has(questionId)) {
      continue;
    }
    seen.add(questionId);
    const score = trimmed(row.score, MAX_SCORE);
    const comment = trimmed(row.comment, MAX_COMMENT);
    statements.push(
      env.DB.prepare(
        `INSERT INTO class_homework_answers (submission_id, question_id, answer, score, comment)
         VALUES (?, ?, '', ?, ?)
         ON CONFLICT(submission_id, question_id)
         DO UPDATE SET score = excluded.score, comment = excluded.comment`,
      ).bind(submissionId, questionId, score, comment),
    );
  }

  const now = nowIso();
  if (action === 'save') {
    if (statements.length) await env.DB.batch(statements);
    await env.DB.prepare(
      'UPDATE class_homework_submissions SET updated_at = ? WHERE id = ?',
    )
      .bind(now, submissionId)
      .run();
    return { ok: true, status: 'submitted' };
  }

  if (statements.length) await env.DB.batch(statements);
  const answers = await loadAnswers(env, submissionId);
  const byQuestion = new Map(answers.map((row) => [row.question_id, row]));
  for (const question of questions) {
    const row = byQuestion.get(question.id);
    if (!row || (!(row.score ?? '').trim() && !(row.comment ?? '').trim())) {
      return { error: '还有题目没有打分或写评语', status: 400 };
    }
  }
  if (!questions.length) return { error: '这份作业还没有题目', status: 400 };

  const status = action === 'keep' ? 'graded' : 'returned';
  await env.DB.prepare(
    `UPDATE class_homework_submissions
     SET status = ?, graded_at = ?, returned_at = ?, updated_at = ?
     WHERE id = ?`,
  )
    .bind(status, now, action === 'return' ? now : null, now, submissionId)
    .run();
  return { ok: true, status };
}
