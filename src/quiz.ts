import { nowIso, trimmed, type Env } from './util';

/**
 * 小组测验：后台发布，App 一题一题填，提交后由后台批改。
 * 没有账号体系，一台手机（设备通行证）同一个测验只能交一份。
 */

type Row = Record<string, unknown>;

export const MAX_QUIZ_QUESTIONS = 50;
const MAX_OPTIONS = 8;
const MAX_NAME = 40;

const QUESTION_KINDS = ['single', 'essay'];

export interface QuizAnswerInput {
  questionId: number;
  answer: string;
}

export interface QuizQuestion {
  id: number;
  kind: string;
  prompt: string;
  options: string[];
  /** 参考答案：只在后台出现，App 接口不会下发 */
  answerKey: string;
  sort: number;
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

function parseAnswers(value: unknown): QuizAnswerInput[] {
  if (!Array.isArray(value)) return [];
  const out: QuizAnswerInput[] = [];
  for (const item of value.slice(0, MAX_QUIZ_QUESTIONS * 2)) {
    if (!item || typeof item !== 'object') continue;
    const row = item as Row;
    const questionId = Number(row.questionId);
    if (!Number.isInteger(questionId) || questionId <= 0) continue;
    const answer =
      typeof row.answer === 'string' ? row.answer.trim().slice(0, 4000) : '';
    out.push({ questionId, answer });
  }
  return out;
}

function quizName(value: unknown): string {
  return trimmed(value, MAX_NAME) ?? '';
}

function flag(value: unknown): boolean {
  return value === true || value === 1 || value === '1' || value === 'true';
}

interface SubmissionRow {
  id: number;
  quiz_id: number;
  device_id: number;
  name: string;
  status: string;
  grade: string | null;
  comment: string | null;
  show_paper: number;
  submitted_at: string;
  graded_at: string | null;
  locked_at: string | null;
  lock_reason: string | null;
}

interface QuizRow {
  id: number;
  title: string;
  description: string | null;
  is_published: number;
  published_at: string | null;
  created_at: string;
  updated_at: string | null;
}

async function loadQuiz(
  env: Env,
  id: number,
  onlyPublished: boolean,
): Promise<QuizRow | null> {
  return env.DB.prepare(
    `SELECT id, title, description, is_published, published_at, created_at, updated_at
     FROM quizzes WHERE id = ?${onlyPublished ? ' AND is_published = 1' : ''}`,
  )
    .bind(id)
    .first<QuizRow>();
}

async function loadQuestions(
  env: Env,
  quizId: number,
): Promise<QuizQuestion[]> {
  const { results } = await env.DB.prepare(
    `SELECT id, kind, prompt, options, answer_key, sort FROM quiz_questions
     WHERE quiz_id = ? ORDER BY sort ASC, id ASC`,
  )
    .bind(quizId)
    .all<{
      id: number;
      kind: string;
      prompt: string;
      options: string | null;
      answer_key: string | null;
      sort: number;
    }>();
  return (results ?? []).map((row) => ({
    id: row.id,
    kind: row.kind === 'essay' ? 'essay' : 'single',
    prompt: row.prompt,
    options: parseOptions(row.options),
    answerKey: row.answer_key ?? '',
    sort: row.sort,
  }));
}

async function loadSubmission(
  env: Env,
  quizId: number,
  deviceId: number,
): Promise<SubmissionRow | null> {
  return env.DB.prepare(
    `SELECT id, quiz_id, device_id, name, status, grade, comment, show_paper,
            submitted_at, graded_at, locked_at, lock_reason
     FROM quiz_submissions WHERE quiz_id = ? AND device_id = ?`,
  )
    .bind(quizId, deviceId)
    .first<SubmissionRow>();
}

async function loadAnswers(
  env: Env,
  submissionId: number,
): Promise<QuizAnswerInput[]> {
  const { results } = await env.DB.prepare(
    'SELECT question_id, answer FROM quiz_answers WHERE submission_id = ?',
  )
    .bind(submissionId)
    .all<{ question_id: number; answer: string | null }>();
  return (results ?? []).map((row) => ({
    questionId: row.question_id,
    answer: row.answer ?? '',
  }));
}

/** 保存一次作答内容：先清掉旧的再写，题量很小，没必要逐题 diff */
async function replaceAnswers(
  env: Env,
  submissionId: number,
  answers: QuizAnswerInput[],
): Promise<void> {
  const statements = [
    env.DB.prepare('DELETE FROM quiz_answers WHERE submission_id = ?').bind(
      submissionId,
    ),
    ...answers.map((item) =>
      env.DB.prepare(
        'INSERT INTO quiz_answers (submission_id, question_id, answer) VALUES (?, ?, ?)',
      ).bind(submissionId, item.questionId, item.answer),
    ),
  ];
  await env.DB.batch(statements);
}

// ------------------------------------------------------------------ App 接口

/** 课堂页的测验流：已发布的测验，最新发布的在前，并带上我这台手机的状态 */
export async function listQuizzesForDevice(env: Env, deviceId: number) {
  const { results } = await env.DB.prepare(
    `SELECT q.id, q.title, q.description,
            COALESCE(q.published_at, q.created_at) AS published_at,
            (SELECT COUNT(*) FROM quiz_questions qq WHERE qq.quiz_id = q.id) AS question_count,
            s.status AS my_status, s.grade AS my_grade, s.submitted_at AS my_submitted_at
     FROM quizzes q
     LEFT JOIN quiz_submissions s ON s.quiz_id = q.id AND s.device_id = ?
     WHERE q.is_published = 1
     ORDER BY COALESCE(q.published_at, q.created_at) DESC, q.id DESC`,
  )
    .bind(deviceId)
    .all<{
      id: number;
      title: string;
      description: string | null;
      published_at: string | null;
      question_count: number;
      my_status: string | null;
      my_grade: string | null;
      my_submitted_at: string | null;
    }>();

  return (results ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    publishedAt: row.published_at,
    questionCount: row.question_count ?? 0,
    myStatus: row.my_status ?? 'none',
    myGrade: row.my_grade,
    mySubmittedAt: row.my_submitted_at,
  }));
}

/**
 * 单个测验：交过之后不再下发题目和答案，避免看到自己写了什么。
 * 例外：批改时勾选了「允许查看」，成绩下面可以看题目、自己的作答和参考答案。
 */
export async function getQuizForDevice(
  env: Env,
  quizId: number,
  deviceId: number,
) {
  const quiz = await loadQuiz(env, quizId, true);
  if (!quiz) return null;
  const submission = await loadSubmission(env, quizId, deviceId);
  const canSeeQuestions =
    !submission || submission.status === 'draft' || submission.status === 'locked';
  const showPaper =
    submission?.status === 'graded' && submission.show_paper === 1;
  const questions =
    canSeeQuestions || showPaper ? await loadQuestions(env, quizId) : [];
  const answers =
    submission &&
    (submission.status === 'draft' ||
      submission.status === 'locked' ||
      showPaper)
      ? await loadAnswers(env, submission.id)
      : [];
  const answerOf = new Map<number, string>(
    answers.map((item) => [item.questionId, item.answer]),
  );
  const review = showPaper
    ? questions.map((question) => ({
        questionId: question.id,
        kind: question.kind,
        prompt: question.prompt,
        options: question.options,
        answer: answerOf.get(question.id) ?? '',
        answerKey: question.answerKey,
      }))
    : [];

  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    publishedAt: quiz.published_at,
    questionCount: questions.length,
    questions: canSeeQuestions
      ? questions.map((question) => ({
          id: question.id,
          kind: question.kind,
          prompt: question.prompt,
          options: question.options,
        }))
      : [],
    review,
    mySubmission: submission
      ? {
          id: submission.id,
          name: submission.name,
          status: submission.status,
          grade: submission.grade,
          comment: submission.comment,
          showPaper,
          submittedAt: submission.submitted_at,
          lockedAt: submission.locked_at,
          lockedReason: submission.lock_reason,
          answers:
            submission.status === 'draft' || submission.status === 'locked'
              ? answers
              : [],
        }
      : null,
  };
}

/**
 * 答题过程中的草稿：切到下一题时顺手存一份。
 * 这样即使作答被锁定，后台也能看到已经写到哪、解锁后还能接着写。
 */
export async function saveProgress(
  env: Env,
  quizId: number,
  deviceId: number,
  body: Row,
): Promise<{ ok: true; status: string } | { error: string; status: number }> {
  const quiz = await loadQuiz(env, quizId, true);
  if (!quiz) return { error: '这个测验已经下架了', status: 404 };
  const submission = await loadSubmission(env, quizId, deviceId);
  if (submission && (submission.status === 'submitted' || submission.status === 'graded')) {
    return { error: '这个测验已经交过了，不能再改', status: 409 };
  }
  if (submission && submission.status === 'locked') {
    return { error: '作答已锁定，请联系发布者解除锁定', status: 423 };
  }
  const name = quizName(body.name);
  if (!name) return { error: '请先填写姓名', status: 400 };

  const questions = await loadQuestions(env, quizId);
  const allowed = new Set(questions.map((question) => question.id));
  const answers = parseAnswers(body.answers).filter((item) =>
    allowed.has(item.questionId),
  );
  const now = nowIso();

  if (!submission) {
    const result = await env.DB.prepare(
      `INSERT INTO quiz_submissions
         (quiz_id, device_id, name, status, submitted_at, updated_at)
       VALUES (?, ?, ?, 'draft', ?, ?)`,
    )
      .bind(quizId, deviceId, name, now, now)
      .run();
    const id = Number(result.meta?.last_row_id ?? 0);
    if (!id) return { error: '保存失败，请再试一次', status: 500 };
    await replaceAnswers(env, id, answers);
  } else {
    await env.DB.batch([
      env.DB.prepare(
        'UPDATE quiz_submissions SET name = ?, updated_at = ? WHERE id = ?',
      ).bind(name, now, submission.id),
      env.DB.prepare('DELETE FROM quiz_answers WHERE submission_id = ?').bind(
        submission.id,
      ),
      ...answers.map((item) =>
        env.DB.prepare(
          'INSERT INTO quiz_answers (submission_id, question_id, answer) VALUES (?, ?, ?)',
        ).bind(submission.id, item.questionId, item.answer),
      ),
    ]);
  }
  return { ok: true, status: 'draft' };
}

/** 交卷。锁定状态下只能走「直接提交」，允许有没写完的题。 */
export async function submitQuiz(
  env: Env,
  quizId: number,
  deviceId: number,
  body: Row,
): Promise<{ ok: true; status: string } | { error: string; status: number }> {
  const quiz = await loadQuiz(env, quizId, true);
  if (!quiz) return { error: '这个测验已经下架了', status: 404 };
  const submission = await loadSubmission(env, quizId, deviceId);
  if (
    submission &&
    (submission.status === 'submitted' || submission.status === 'graded')
  ) {
    return { error: '这个测验已经交过了，不能再改', status: 409 };
  }

  const name = quizName(body.name) || submission?.name || '';
  if (!name) return { error: '请先填写姓名', status: 400 };

  const questions = await loadQuestions(env, quizId);
  if (!questions.length) return { error: '这个测验还没有题目', status: 400 };

  const allowed = new Map(questions.map((question) => [question.id, question]));
  const input = parseAnswers(body.answers);
  const fromLocked = submission?.status === 'locked';
  const answerMap = new Map<number, string>();

  // 锁定时交卷：以服务端保存的草稿为底，客户端带来的覆盖上去
  if (submission && fromLocked) {
    for (const item of await loadAnswers(env, submission.id)) {
      if (allowed.has(item.questionId)) answerMap.set(item.questionId, item.answer);
    }
  }
  for (const item of input) {
    if (!allowed.has(item.questionId)) continue;
    const question = allowed.get(item.questionId)!;
    let value = item.answer;
    if (question.kind === 'single') {
      if (!question.options.includes(value)) value = '';
    }
    answerMap.set(item.questionId, value);
  }

  if (!fromLocked) {
    for (const question of questions) {
      if (!(answerMap.get(question.id) ?? '').trim()) {
        return { error: '还有题目没有作答', status: 400 };
      }
    }
  }

  const answers: QuizAnswerInput[] = questions.map((question) => ({
    questionId: question.id,
    answer: answerMap.get(question.id) ?? '',
  }));
  const now = nowIso();
  let submissionId = submission?.id ?? 0;

  if (!submissionId) {
    const result = await env.DB.prepare(
      `INSERT INTO quiz_submissions
         (quiz_id, device_id, name, status, submitted_at, updated_at)
       VALUES (?, ?, ?, 'submitted', ?, ?)`,
    )
      .bind(quizId, deviceId, name, now, now)
      .run();
    submissionId = Number(result.meta?.last_row_id ?? 0);
    if (!submissionId) return { error: '提交失败，请再试一次', status: 500 };
  } else {
    await env.DB.prepare(
      `UPDATE quiz_submissions
       SET name = ?, status = 'submitted', submitted_at = ?, updated_at = ?,
           grade = NULL, comment = NULL, graded_at = NULL
       WHERE id = ?`,
    )
      .bind(name, now, now, submissionId)
      .run();
  }
  await replaceAnswers(env, submissionId, answers);
  return { ok: true, status: 'submitted' };
}

/** 锁定作答：离开应用太久或截屏时由 App 调用 */
export async function lockQuiz(
  env: Env,
  quizId: number,
  deviceId: number,
  body: Row,
): Promise<{ ok: true; status: string } | { error: string; status: number }> {
  const quiz = await loadQuiz(env, quizId, true);
  if (!quiz) return { error: '这个测验已经下架了', status: 404 };
  const submission = await loadSubmission(env, quizId, deviceId);
  if (
    submission &&
    (submission.status === 'submitted' || submission.status === 'graded')
  ) {
    return { ok: true, status: submission.status };
  }
  const name = quizName(body.name) || submission?.name || '';
  if (!name) return { error: '请先填写姓名', status: 400 };

  const questions = await loadQuestions(env, quizId);
  const allowed = new Set(questions.map((question) => question.id));
  const answers = parseAnswers(body.answers).filter((item) =>
    allowed.has(item.questionId),
  );
  const reason = trimmed(body.reason, 40) ?? '离开应用';
  const now = nowIso();

  if (!submission) {
    const result = await env.DB.prepare(
      `INSERT INTO quiz_submissions
         (quiz_id, device_id, name, status, submitted_at, locked_at, lock_reason, updated_at)
       VALUES (?, ?, ?, 'locked', ?, ?, ?, ?)`,
    )
      .bind(quizId, deviceId, name, now, now, reason, now)
      .run();
    const id = Number(result.meta?.last_row_id ?? 0);
    if (!id) return { error: '保存失败，请再试一次', status: 500 };
    await replaceAnswers(env, id, answers);
  } else {
    await env.DB.batch([
      env.DB.prepare(
        `UPDATE quiz_submissions
         SET name = ?, status = 'locked', locked_at = ?, lock_reason = ?, updated_at = ?
         WHERE id = ?`,
      ).bind(name, now, reason, now, submission.id),
      env.DB.prepare('DELETE FROM quiz_answers WHERE submission_id = ?').bind(
        submission.id,
      ),
      ...answers.map((item) =>
        env.DB.prepare(
          'INSERT INTO quiz_answers (submission_id, question_id, answer) VALUES (?, ?, ?)',
        ).bind(submission.id, item.questionId, item.answer),
      ),
    ]);
  }
  return { ok: true, status: 'locked' };
}

/** 清空重做：只允许还没交卷的时候用，交过了就永远不能再做 */
export async function restartQuiz(
  env: Env,
  quizId: number,
  deviceId: number,
): Promise<{ ok: true } | { error: string; status: number }> {
  const submission = await loadSubmission(env, quizId, deviceId);
  if (!submission) return { ok: true };
  if (submission.status === 'submitted' || submission.status === 'graded') {
    return { error: '已经提交了，不能重做', status: 409 };
  }
  await env.DB.batch([
    env.DB.prepare('DELETE FROM quiz_answers WHERE submission_id = ?').bind(
      submission.id,
    ),
    env.DB.prepare('DELETE FROM quiz_submissions WHERE id = ?').bind(
      submission.id,
    ),
  ]);
  return { ok: true };
}

// ---------------------------------------------------------------- 后台接口

export async function listQuizzesForAdmin(env: Env) {
  const { results } = await env.DB.prepare(
    `SELECT q.id, q.title, q.description, q.is_published, q.published_at,
            q.created_at, q.updated_at,
            (SELECT COUNT(*) FROM quiz_questions qq WHERE qq.quiz_id = q.id) AS question_count,
            (SELECT COUNT(*) FROM quiz_submissions s
              WHERE s.quiz_id = q.id AND s.status IN ('submitted', 'graded')) AS submission_count,
            (SELECT COUNT(*) FROM quiz_submissions s
              WHERE s.quiz_id = q.id AND s.status = 'submitted') AS pending_count,
            (SELECT COUNT(*) FROM quiz_submissions s
              WHERE s.quiz_id = q.id AND s.status = 'graded') AS graded_count,
            (SELECT COUNT(*) FROM quiz_submissions s
              WHERE s.quiz_id = q.id AND s.status = 'locked') AS locked_count
     FROM quizzes q
     ORDER BY q.created_at DESC, q.id DESC`,
  ).all<{
    id: number;
    title: string;
    description: string | null;
    is_published: number;
    published_at: string | null;
    created_at: string;
    updated_at: string | null;
    question_count: number;
    submission_count: number;
    pending_count: number;
    graded_count: number;
    locked_count: number;
  }>();

  return (results ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    isPublished: row.is_published === 1,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    questionCount: row.question_count ?? 0,
    submissionCount: row.submission_count ?? 0,
    pendingCount: row.pending_count ?? 0,
    gradedCount: row.graded_count ?? 0,
    lockedCount: row.locked_count ?? 0,
  }));
}

export async function getQuizForAdmin(env: Env, id: number) {
  const quiz = await loadQuiz(env, id, false);
  if (!quiz) return null;
  const questions = await loadQuestions(env, id);
  const { results } = await env.DB.prepare(
    `SELECT s.id, s.name, s.status, s.grade, s.comment, s.submitted_at,
            s.locked_at, s.lock_reason, d.name AS device_name
     FROM quiz_submissions s
     LEFT JOIN devices d ON d.id = s.device_id
     WHERE s.quiz_id = ?
     ORDER BY s.submitted_at DESC, s.id DESC`,
  )
    .bind(id)
    .all<{
      id: number;
      name: string;
      status: string;
      grade: string | null;
      comment: string | null;
      submitted_at: string;
      locked_at: string | null;
      lock_reason: string | null;
      device_name: string | null;
    }>();

  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    isPublished: quiz.is_published === 1,
    publishedAt: quiz.published_at,
    createdAt: quiz.created_at,
    updatedAt: quiz.updated_at,
    questions,
    submissions: (results ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      deviceName: row.device_name,
      status: row.status,
      grade: row.grade,
      comment: row.comment,
      submittedAt: row.submitted_at,
      lockedAt: row.locked_at,
      lockedReason: row.lock_reason,
    })),
  };
}

export async function createQuiz(env: Env, body: Row) {
  const title = trimmed(body.title, 120);
  if (!title) throw new Error('测验标题不能为空');
  const description = trimmed(body.description, 3000);
  const published = flag(body.isPublished);
  const now = nowIso();
  const result = await env.DB.prepare(
    `INSERT INTO quizzes (title, description, is_published, published_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  )
    .bind(title, description, published ? 1 : 0, published ? now : null, now, now)
    .run();
  return { ok: true, id: Number(result.meta?.last_row_id ?? 0) };
}

interface QuestionInput {
  id: number;
  kind: string;
  prompt: string;
  options: string[];
  answerKey: string;
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
  let answerKey = trimmed(row.answerKey, 2000) ?? '';
  // 单选题的参考答案必须还是现有选项之一，避免改完选项后留下对不上的旧答案
  if (kind === 'single' && answerKey && !options.includes(answerKey)) {
    answerKey = '';
  }
  return {
    id: Number(row.id) || 0,
    kind,
    prompt,
    options,
    answerKey,
  };
}

export async function updateQuiz(env: Env, id: number, body: Row) {
  const quiz = await loadQuiz(env, id, false);
  if (!quiz) throw new Error('找不到这个测验');
  const title = trimmed(body.title, 120);
  if (!title) throw new Error('测验标题不能为空');
  const description = trimmed(body.description, 3000);
  const published = flag(body.isPublished);
  const now = nowIso();
  const publishedAt =
    published && !quiz.published_at ? now : quiz.published_at;

  await env.DB.prepare(
    `UPDATE quizzes
     SET title = ?, description = ?, is_published = ?, published_at = ?, updated_at = ?
     WHERE id = ?`,
  )
    .bind(title, description, published ? 1 : 0, publishedAt, now, id)
    .run();

  if (Array.isArray(body.questions)) {
    await syncQuestions(env, id, body.questions);
  }
  return { ok: true };
}

async function syncQuestions(
  env: Env,
  quizId: number,
  rawList: unknown[],
): Promise<void> {
  const existing = await loadQuestions(env, quizId);
  const existingIds = new Set(existing.map((question) => question.id));
  const keep = new Set<number>();
  const statements: D1PreparedStatement[] = [];

  rawList.slice(0, MAX_QUIZ_QUESTIONS).forEach((raw, index) => {
    const question = questionInput(raw);
    if (question.id && existingIds.has(question.id)) {
      keep.add(question.id);
      statements.push(
        env.DB.prepare(
          'UPDATE quiz_questions SET kind = ?, prompt = ?, options = ?, answer_key = ?, sort = ? WHERE id = ? AND quiz_id = ?',
        ).bind(
          question.kind,
          question.prompt,
          JSON.stringify(question.options),
          question.answerKey,
          index,
          question.id,
          quizId,
        ),
      );
    } else {
      statements.push(
        env.DB.prepare(
          'INSERT INTO quiz_questions (quiz_id, kind, prompt, options, answer_key, sort) VALUES (?, ?, ?, ?, ?, ?)',
        ).bind(
          quizId,
          question.kind,
          question.prompt,
          JSON.stringify(question.options),
          question.answerKey,
          index,
        ),
      );
    }
  });

  for (const question of existing) {
    if (keep.has(question.id)) continue;
    statements.push(
      env.DB.prepare('DELETE FROM quiz_answers WHERE question_id = ?').bind(
        question.id,
      ),
      env.DB.prepare('DELETE FROM quiz_questions WHERE id = ?').bind(question.id),
    );
  }
  if (statements.length) await env.DB.batch(statements);
}

export async function deleteQuiz(env: Env, id: number): Promise<void> {
  await env.DB.batch([
    env.DB.prepare(
      'DELETE FROM quiz_answers WHERE submission_id IN (SELECT id FROM quiz_submissions WHERE quiz_id = ?)',
    ).bind(id),
    env.DB.prepare('DELETE FROM quiz_submissions WHERE quiz_id = ?').bind(id),
    env.DB.prepare('DELETE FROM quiz_questions WHERE quiz_id = ?').bind(id),
    env.DB.prepare('DELETE FROM quizzes WHERE id = ?').bind(id),
  ]);
}

export async function getSubmissionForAdmin(
  env: Env,
  quizId: number,
  submissionId: number,
) {
  const quiz = await loadQuiz(env, quizId, false);
  if (!quiz) return null;
  const submission = await env.DB.prepare(
    `SELECT s.id, s.name, s.status, s.grade, s.comment, s.show_paper, s.submitted_at,
            s.locked_at, s.lock_reason, d.name AS device_name
     FROM quiz_submissions s
     LEFT JOIN devices d ON d.id = s.device_id
     WHERE s.id = ? AND s.quiz_id = ?`,
  )
    .bind(submissionId, quizId)
    .first<{
      id: number;
      name: string;
      status: string;
      grade: string | null;
      comment: string | null;
      show_paper: number;
      submitted_at: string;
      locked_at: string | null;
      lock_reason: string | null;
      device_name: string | null;
    }>();
  if (!submission) return null;

  const { results } = await env.DB.prepare(
    `SELECT a.question_id, a.answer, q.prompt, q.kind, q.options, q.answer_key, q.sort
     FROM quiz_answers a
     LEFT JOIN quiz_questions q ON q.id = a.question_id
     WHERE a.submission_id = ?
     ORDER BY q.sort ASC, q.id ASC`,
  )
    .bind(submissionId)
    .all<{
      question_id: number;
      answer: string | null;
      prompt: string | null;
      kind: string | null;
      options: string | null;
      answer_key: string | null;
      sort: number | null;
    }>();

  return {
    quizId: quiz.id,
    quizTitle: quiz.title,
    id: submission.id,
    name: submission.name,
    deviceName: submission.device_name,
    status: submission.status,
    grade: submission.grade,
    comment: submission.comment,
    showPaper: submission.show_paper === 1,
    submittedAt: submission.submitted_at,
    lockedAt: submission.locked_at,
    lockedReason: submission.lock_reason,
    answers: (results ?? []).map((row) => ({
      questionId: row.question_id,
      prompt: row.prompt ?? '（题目已删除）',
      kind: row.kind === 'essay' ? 'essay' : 'single',
      options: parseOptions(row.options),
      answerKey: row.answer_key ?? '',
      answer: row.answer ?? '',
    })),
  };
}

/** 批改：分数或 A–E 等级都行，统一当一段文字存 */
export async function gradeSubmission(
  env: Env,
  quizId: number,
  submissionId: number,
  body: Row,
): Promise<{ ok: true } | { error: string; status: number }> {
  const grade = trimmed(body.grade, 20);
  if (!grade) return { error: '请填写成绩或等级', status: 400 };
  const comment = trimmed(body.comment, 2000);
  const showPaper = flag(body.showPaper) ? 1 : 0;
  const now = nowIso();
  const result = await env.DB.prepare(
    `UPDATE quiz_submissions
     SET status = 'graded', grade = ?, comment = ?, show_paper = ?, graded_at = ?, updated_at = ?
     WHERE id = ? AND quiz_id = ? AND status IN ('submitted', 'graded')`,
  )
    .bind(grade, comment, showPaper, now, now, submissionId, quizId)
    .run();
  if ((result.meta?.changes ?? 0) === 0) {
    return { error: '这份作答现在不能批改', status: 409 };
  }
  return { ok: true };
}

/** 解除锁定：已经写的内容保留，学生重新打开就能接着写 */
export async function unlockSubmission(
  env: Env,
  quizId: number,
  submissionId: number,
): Promise<{ ok: true } | { error: string; status: number }> {
  const now = nowIso();
  const result = await env.DB.prepare(
    `UPDATE quiz_submissions
     SET status = 'draft', locked_at = NULL, lock_reason = NULL, updated_at = ?
     WHERE id = ? AND quiz_id = ? AND status = 'locked'`,
  )
    .bind(now, submissionId, quizId)
    .run();
  if ((result.meta?.changes ?? 0) === 0) {
    return { error: '这份作答没有被锁定', status: 409 };
  }
  return { ok: true };
}

/** 删除一份作答：学生可以重新做（批改错了、想让他重交时用） */
export async function deleteSubmission(
  env: Env,
  quizId: number,
  submissionId: number,
): Promise<void> {
  await env.DB.batch([
    env.DB.prepare('DELETE FROM quiz_answers WHERE submission_id = ?').bind(
      submissionId,
    ),
    env.DB.prepare(
      'DELETE FROM quiz_submissions WHERE id = ? AND quiz_id = ?',
    ).bind(submissionId, quizId),
  ]);
}
