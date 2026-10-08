import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { db, DB_FILE } from './db.mjs';
import { seedIfEmpty } from './seed.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '2mb' }));

const seeded = seedIfEmpty();
if (seeded) console.log('[db] Seeded mock data into', DB_FILE);
console.log('[db] Using SQLite database:', DB_FILE);

const uid = (p) => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

const SCHOOL = {
  name: 'সেন্ট যোসেফস স্কুল এন্ড কলেজ',
  nameEn: "St. Joseph's School & College",
  address: 'বনপাড়া, বড়াইগ্রাম, নাটোর, রাজশাহী, বাংলাদেশ',
  phone: '+880 1XXX-XXXXXX',
  email: 'stjosephbon123915@gmail.com',
  eiin: '123915',
  facebook: 'https://www.facebook.com/sjscb',
  tagline: 'Empowering Knowledge, Building Futures',
  about: 'সেন্ট যোসেফস স্কুল এন্ড কলেজ, বনপাড়া, নাটোর একটি ঐতিহ্যবাহী শিক্ষাপ্রতিষ্ঠান। আমাদের ক্যাম্পাস শান্ত ও সবুজে ঘেরা — শিক্ষার্থীদের জন্য একটি সহায়ক শিক্ষা পরিবেশ তৈরি করেছে। প্রতিষ্ঠানের অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষকমণ্ডলী শিক্ষার্থীদের মেধা বিকাশে নিরলসভাবে কাজ করে যাচ্ছেন। আমাদের স্কুলে মূল্যবোধ, নৈতিকতা ও সামাজিক দায়িত্ববোধের প্রতি অঙ্গীকার রয়েছে — পাঠ্যবইয়ের পাশাপাশি নৈতিক শিক্ষার মাধ্যমে আমরা শিক্ষার্থীদের গড়ে তুলি। Josephite Learning প্লাটফর্মটি ডিজিটাল শিক্ষা পদ্ধতির মাধ্যমে এই লক্ষ্যেই কাজ করে। শিক্ষার্থীরা নিয়মিত পাঠদানের পাশাপাশি নোট, প্র্যাকটিস, কুইজ এবং সাপ্তাহিক পরীক্ষার মাধ্যমে নিজেদের প্রস্তুতি যাচাই করতে পারে। এই প্লাটফর্মটি শিক্ষার্থীদের সুবিধার্থে প্রণয়ন করা হয়েছে — প্রতিষ্ঠানের শিক্ষার্থীদের মেধা বিকাশের চৌকস হাতিয়ার হিসেবে Josephite Learning কাজ করবে।',
};

// ---------- State snapshot ----------

function getState() {
  const users = db.prepare('SELECT * FROM users ORDER BY role, roll, name').all().map((u) => ({
    id: u.id, name: u.name, email: u.email, password: u.password, role: u.role,
    designation: u.designation ?? undefined, subject: u.subject ?? undefined,
    classId: u.class_id ?? undefined, roll: u.roll ?? undefined,
    photoUrl: u.photo_url ?? undefined,
  }));
  const classes = db.prepare('SELECT * FROM classes ORDER BY id').all().map((c) => ({ id: c.id, name: c.name, nameBn: c.name_bn }));
  const subjects = db.prepare('SELECT * FROM subjects ORDER BY id').all().map((s) => ({ id: s.id, classId: s.class_id, name: s.name, code: s.code, color: s.color }));

  const lecStmt = db.prepare('SELECT * FROM lectures WHERE chapter_id = ? ORDER BY rowid');
  const noteStmt = db.prepare('SELECT * FROM notes WHERE chapter_id = ? ORDER BY rowid');
  const pqStmt = db.prepare('SELECT * FROM practice_questions WHERE chapter_id = ? ORDER BY rowid');
  const mcqStmt = db.prepare('SELECT * FROM mcq_questions WHERE chapter_id = ? ORDER BY rowid');

  const chapters = db.prepare('SELECT * FROM chapters ORDER BY subject_id, sort_order').all().map((c) => ({
    id: c.id,
    subjectId: c.subject_id,
    name: c.name,
    order: c.sort_order,
    lectures: lecStmt.all(c.id).map((l) => ({ id: l.id, chapterId: l.chapter_id, title: l.title, videoUrl: l.video_url, description: l.description ?? undefined })),
    notes: noteStmt.all(c.id).map((n) => ({ id: n.id, chapterId: n.chapter_id, title: n.title, content: n.content })),
    practice: pqStmt.all(c.id).map((p) => ({ id: p.id, chapterId: p.chapter_id, question: p.question, answer: p.answer })),
    mcq: {
      title: c.mcq_title,
      durationMin: c.mcq_duration_min,
      questions: mcqStmt.all(c.id).map((m) => ({
        id: m.id, question: m.question, options: JSON.parse(m.options), correctIndex: m.correct_index, explanation: m.explanation ?? undefined,
      })),
    },
  }));

  const weeklyExams = db.prepare('SELECT * FROM weekly_exams ORDER BY week_no').all().map((e) => ({
    id: e.id, weekNo: e.week_no, title: e.title, durationMin: e.duration_min, questions: JSON.parse(e.questions),
  }));

  const results = db.prepare('SELECT * FROM results ORDER BY date DESC').all().map((r) => ({
    id: r.id, userId: r.user_id, type: r.type, refId: r.ref_id, title: r.title,
    total: r.total, obtained: r.obtained, correct: r.correct, wrong: r.wrong,
    percentage: r.percentage, answers: JSON.parse(r.answers), date: r.date,
  }));

  const notices = db.prepare('SELECT * FROM notices ORDER BY date DESC').all().map((n) => ({ id: n.id, title: n.title, body: n.body, date: n.date }));

  const comments = db.prepare('SELECT * FROM comments ORDER BY date ASC').all().map((c) => ({
    id: c.id, lectureId: c.lecture_id, userId: c.user_id, body: c.body, date: c.date,
  }));

  return { school: SCHOOL, users, classes, subjects, chapters, weeklyExams, results, notices, comments };
}

app.get('/api/state', (req, res) => res.json(getState()));

// ---------- Comments ----------

app.post('/api/lectures/:id/comments', (req, res) => {
  const { userId, body } = req.body ?? {};
  const text = String(body ?? '').trim();
  if (!userId || !text) return res.status(400).json({ error: 'userId ও মন্তব্য প্রয়োজন' });
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  const lec = db.prepare('SELECT * FROM lectures WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!lec) return res.status(404).json({ error: 'Lecture not found' });
  const id = uid('cmt');
  db.prepare('INSERT INTO comments (id, lecture_id, user_id, body, date) VALUES (?, ?, ?, ?, ?)')
    .run(id, req.params.id, userId, text.slice(0, 1000), new Date().toISOString());
  res.json({ ok: true, commentId: id, state: getState() });
});

app.delete('/api/comments/:id', (req, res) => {
  const { userId } = req.body ?? {};
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId ?? '');
  if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
    return res.status(403).json({ error: 'শুধু শিক্ষক/অ্যাডমিন মন্তব্য মুছতে পারবেন' });
  }
  db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.id);
  res.json({ ok: true, state: getState() });
});

// ---------- Auth ----------

app.post('/api/login', (req, res) => {
  const { email, password } = req.body ?? {};
  const u = db.prepare('SELECT * FROM users WHERE lower(email) = lower(?) AND password = ?').get(String(email ?? '').trim(), String(password ?? ''));
  if (!u) return res.status(401).json({ error: 'ভুল Email বা Password।' });
  res.json({ id: u.id, role: u.role });
});

// ---------- Results ----------

app.post('/api/results', (req, res) => {
  const { userId, type, refId, title, total, obtained, answers } = req.body ?? {};
  if (!userId || !type || !refId || !Number.isInteger(total) || !Number.isInteger(obtained)) {
    return res.status(400).json({ error: 'Invalid result payload' });
  }
  const correct = obtained;
  const wrong = total - obtained;
  const percentage = total ? Math.round((obtained / total) * 100) : 0;
  const id = uid('res');
  db.prepare(
    'INSERT INTO results (id, user_id, type, ref_id, title, total, obtained, correct, wrong, percentage, answers, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, userId, type, refId, String(title ?? ''), total, obtained, correct, wrong, percentage, JSON.stringify(answers ?? []), new Date().toISOString());
  res.json({ ok: true, resultId: id, state: getState() });
});

app.get('/api/weekly-exams/:id/leaderboard', (req, res) => {
  const rows = db.prepare(
    `SELECT r.*, u.name, u.class_id, u.roll FROM results r JOIN users u ON u.id = r.user_id
     WHERE r.type = 'weekly' AND r.ref_id = ? ORDER BY r.date ASC`
  ).all(req.params.id);
  const best = new Map();
  for (const r of rows) {
    const cur = best.get(r.user_id);
    if (!cur || r.percentage > cur.percentage || (r.percentage === cur.percentage)) best.set(r.user_id, r);
  }
  const board = [...best.values()]
    .sort((a, b) => b.percentage - a.percentage || b.obtained - a.obtained || a.date.localeCompare(b.date))
    .map((r, i) => ({ rank: i + 1, userId: r.user_id, name: r.name, classId: r.class_id, roll: r.roll, obtained: r.obtained, total: r.total, percentage: r.percentage }));
  res.json({ board });
});

// ---------- Teacher: chapter content ----------

app.post('/api/chapters/:id/lectures', (req, res) => {
  const { title, videoUrl, description } = req.body ?? {};
  if (!title?.trim() || !videoUrl?.trim()) return res.status(400).json({ error: 'Title and video URL required' });
  db.prepare('INSERT INTO lectures (id, chapter_id, title, video_url, description) VALUES (?, ?, ?, ?, ?)')
    .run(uid('lec'), req.params.id, title.trim(), videoUrl.trim(), description?.trim() || null);
  res.json({ ok: true, state: getState() });
});

app.post('/api/chapters/:id/notes', (req, res) => {
  const { title, content } = req.body ?? {};
  if (!title?.trim() || !content?.trim()) return res.status(400).json({ error: 'Title and content required' });
  db.prepare('INSERT INTO notes (id, chapter_id, title, content) VALUES (?, ?, ?, ?)')
    .run(uid('note'), req.params.id, title.trim(), content.trim());
  res.json({ ok: true, state: getState() });
});

app.post('/api/chapters/:id/practice', (req, res) => {
  const { question, answer } = req.body ?? {};
  if (!question?.trim() || !answer?.trim()) return res.status(400).json({ error: 'Question and answer required' });
  db.prepare('INSERT INTO practice_questions (id, chapter_id, question, answer) VALUES (?, ?, ?, ?)')
    .run(uid('pq'), req.params.id, question.trim(), answer.trim());
  res.json({ ok: true, state: getState() });
});

app.post('/api/chapters/:id/mcq', (req, res) => {
  const { question, options, correctIndex, explanation } = req.body ?? {};
  if (!question?.trim() || !Array.isArray(options) || options.length !== 4 || options.some((o) => !o?.trim())) {
    return res.status(400).json({ error: 'Question and 4 options required' });
  }
  db.prepare('INSERT INTO mcq_questions (id, chapter_id, question, options, correct_index, explanation) VALUES (?, ?, ?, ?, ?, ?)')
    .run(uid('mcq'), req.params.id, question.trim(), JSON.stringify(options.map((o) => o.trim())), Number(correctIndex) || 0, explanation?.trim() || null);
  const ch = db.prepare('SELECT mcq_duration_min FROM chapters WHERE id = ?').get(req.params.id);
  if (ch && !ch.mcq_duration_min) {
    const n = db.prepare('SELECT COUNT(*) AS n FROM mcq_questions WHERE chapter_id = ?').get(req.params.id).n;
    db.prepare('UPDATE chapters SET mcq_duration_min = ? WHERE id = ?').run(Math.max(1, n), req.params.id);
  }
  res.json({ ok: true, state: getState() });
});

app.delete('/api/mcq/:qid', (req, res) => {
  db.prepare('DELETE FROM mcq_questions WHERE id = ?').run(req.params.qid);
  res.json({ ok: true, state: getState() });
});

app.put('/api/chapters/:id/duration', (req, res) => {
  const duration = Math.max(1, Number(req.body?.durationMin) || 1);
  db.prepare('UPDATE chapters SET mcq_duration_min = ? WHERE id = ?').run(duration, req.params.id);
  res.json({ ok: true, state: getState() });
});

// ---------- Teacher: weekly exams ----------

app.post('/api/weekly-exams', (req, res) => {
  const { title, durationMin } = req.body ?? {};
  if (!title?.trim()) return res.status(400).json({ error: 'Title required' });
  const weekNo = db.prepare('SELECT COUNT(*) AS n FROM weekly_exams').get().n + 1;
  const id = uid('week');
  db.prepare('INSERT INTO weekly_exams (id, week_no, title, duration_min, questions) VALUES (?, ?, ?, ?, ?)')
    .run(id, weekNo, title.trim(), Math.max(1, Number(durationMin) || 1), '[]');
  res.json({ ok: true, examId: id, state: getState() });
});

app.post('/api/weekly-exams/:id/questions', (req, res) => {
  const { question, options, correctIndex, explanation } = req.body ?? {};
  if (!question?.trim() || !Array.isArray(options) || options.length !== 4 || options.some((o) => !o?.trim())) {
    return res.status(400).json({ error: 'Question and 4 options required' });
  }
  const exam = db.prepare('SELECT questions, duration_min FROM weekly_exams WHERE id = ?').get(req.params.id);
  if (!exam) return res.status(404).json({ error: 'Exam not found' });
  const questions = JSON.parse(exam.questions);
  questions.push({ id: uid('wq'), question: question.trim(), options: options.map((o) => o.trim()), correctIndex: Number(correctIndex) || 0, explanation: explanation?.trim() || undefined });
  const duration = exam.duration_min || questions.length;
  db.prepare('UPDATE weekly_exams SET questions = ?, duration_min = ? WHERE id = ?').run(JSON.stringify(questions), duration, req.params.id);
  res.json({ ok: true, state: getState() });
});

app.delete('/api/weekly-exams/:id', (req, res) => {
  db.prepare('DELETE FROM weekly_exams WHERE id = ?').run(req.params.id);
  res.json({ ok: true, state: getState() });
});

// ---------- Admin: users ----------

app.post('/api/users', (req, res) => {
  const { name, email, password, role, classId, roll, subject, designation, photoUrl } = req.body ?? {};
  if (!name?.trim() || !email?.trim() || !role) return res.status(400).json({ error: 'Name, email and role required' });
  try {
    db.prepare('INSERT INTO users (id, name, email, password, role, designation, subject, class_id, roll, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(uid('usr'), name.trim(), email.trim(), password || 'demo123', role, designation || null, subject || null, classId || null, roll || null, photoUrl || null);
  } catch (e) {
    if (String(e).includes('UNIQUE')) return res.status(409).json({ error: 'এই Email আগে থেকেই আছে।' });
    throw e;
  }
  res.json({ ok: true, state: getState() });
});

app.delete('/api/users/:id', (req, res) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ ok: true, state: getState() });
});

// ---------- Admin: classes & subjects ----------

app.post('/api/classes', (req, res) => {
  const { name, nameBn } = req.body ?? {};
  if (!name?.trim()) return res.status(400).json({ error: 'Class name required' });
  db.prepare('INSERT INTO classes (id, name, name_bn) VALUES (?, ?, ?)').run(uid('cls'), name.trim(), nameBn?.trim() || name.trim());
  res.json({ ok: true, state: getState() });
});

app.delete('/api/classes/:id', (req, res) => {
  db.prepare('DELETE FROM subjects WHERE class_id = ?').run(req.params.id);
  db.prepare('DELETE FROM classes WHERE id = ?').run(req.params.id);
  res.json({ ok: true, state: getState() });
});

app.post('/api/subjects', (req, res) => {
  const { classId, name, code, color } = req.body ?? {};
  if (!classId || !name?.trim() || !code?.trim()) return res.status(400).json({ error: 'classId, name and code required' });
  const id = `${classId}_${code}`;
  const exists = db.prepare('SELECT 1 FROM subjects WHERE id = ?').get(id);
  if (exists) return res.status(409).json({ error: 'এই Subject আগেই এই Class-এ আছে।' });
  db.prepare('INSERT INTO subjects (id, class_id, name, code, color) VALUES (?, ?, ?, ?, ?)').run(id, classId, name.trim(), code.trim(), color || 'from-indigo-500 to-blue-400');
  res.json({ ok: true, state: getState() });
});

app.delete('/api/subjects/:id', (req, res) => {
  db.prepare('DELETE FROM subjects WHERE id = ?').run(req.params.id);
  res.json({ ok: true, state: getState() });
});

// ---------- Admin: notices ----------

app.post('/api/notices', (req, res) => {
  const { title, body } = req.body ?? {};
  if (!title?.trim()) return res.status(400).json({ error: 'Title required' });
  db.prepare('INSERT INTO notices (id, title, body, date) VALUES (?, ?, ?, ?)').run(uid('ntc'), title.trim(), body?.trim() || '', new Date().toISOString());
  res.json({ ok: true, state: getState() });
});

app.put('/api/notices/:id', (req, res) => {
  const { title, body } = req.body ?? {};
  const n = db.prepare('SELECT * FROM notices WHERE id = ?').get(req.params.id);
  if (!n) return res.status(404).json({ error: 'Notice not found' });
  if (!title?.trim()) return res.status(400).json({ error: 'Title required' });
  db.prepare('UPDATE notices SET title = ?, body = ? WHERE id = ?').run(title.trim(), body?.trim() || '', req.params.id);
  res.json({ ok: true, state: getState() });
});

app.delete('/api/notices/:id', (req, res) => {
  db.prepare('DELETE FROM notices WHERE id = ?').run(req.params.id);
  res.json({ ok: true, state: getState() });
});

// ---------- Admin/Teacher: user edit ----------

app.put('/api/users/:id', (req, res) => {
  const { name, email, classId, roll, password, subject, designation, photoUrl } = req.body ?? {};
  const u = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!u) return res.status(404).json({ error: 'User not found' });
  try {
    db.prepare(
      'UPDATE users SET name = ?, email = ?, class_id = ?, roll = ?, password = ?, subject = ?, designation = ?, photo_url = ? WHERE id = ?'
    ).run(
      name?.trim() || u.name,
      email?.trim() || u.email,
      classId ?? u.class_id,
      roll ?? u.roll,
      password?.trim() || u.password,
      subject ?? u.subject,
      designation ?? u.designation,
      photoUrl ?? u.photo_url,
      req.params.id
    );
  } catch (e) {
    if (String(e).includes('UNIQUE')) return res.status(409).json({ error: 'এই Email আগে থেকেই আছে।' });
    throw e;
  }
  res.json({ ok: true, state: getState() });
});

// ---------- Admin: results ----------

app.delete('/api/results/:id', (req, res) => {
  db.prepare('DELETE FROM results WHERE id = ?').run(req.params.id);
  res.json({ ok: true, state: getState() });
});

// ---------- Admin: chapters ----------

app.post('/api/subjects/:id/chapters', (req, res) => {
  const { name } = req.body ?? {};
  if (!name?.trim()) return res.status(400).json({ error: 'Chapter name required' });
  const subject = db.prepare('SELECT id FROM subjects WHERE id = ?').get(req.params.id);
  if (!subject) return res.status(404).json({ error: 'Subject not found' });
  const order = db.prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 AS n FROM chapters WHERE subject_id = ?').get(req.params.id).n;
  const id = uid('ch');
  db.prepare('INSERT INTO chapters (id, subject_id, name, sort_order, mcq_title, mcq_duration_min) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, req.params.id, name.trim(), order, `${name.trim()} — MCQ Test`, 0);
  db.prepare('INSERT INTO notes (id, chapter_id, title, content) VALUES (?, ?, ?, ?)')
    .run(uid('note'), id, `${name.trim()} — সংক্ষিপ্ত নোট`, `এই অধ্যায়ের মূল বিষয়বস্তু:\n• ${name.trim()}-এর মৌলিক ধারণা ও সংজ্ঞা\n• গুরুত্বপূর্ণ সূত্র ও উদাহরণ\n\nবিস্তারিত নোট ও PDF শিক্ষক শীঘ্রই যোগ করবেন।`);
  res.json({ ok: true, chapterId: id, state: getState() });
});

app.put('/api/chapters/:id', (req, res) => {
  const { name } = req.body ?? {};
  if (!name?.trim()) return res.status(400).json({ error: 'Chapter name required' });
  const ch = db.prepare('SELECT * FROM chapters WHERE id = ?').get(req.params.id);
  if (!ch) return res.status(404).json({ error: 'Chapter not found' });
  const mcqTitle = ch.mcq_title?.includes('— MCQ Test') ? `${name.trim()} — MCQ Test` : ch.mcq_title;
  db.prepare('UPDATE chapters SET name = ?, mcq_title = ? WHERE id = ?').run(name.trim(), mcqTitle, req.params.id);
  res.json({ ok: true, state: getState() });
});

app.delete('/api/chapters/:id', (req, res) => {
  const id = req.params.id;
  db.prepare('DELETE FROM lectures WHERE chapter_id = ?').run(id);
  db.prepare('DELETE FROM notes WHERE chapter_id = ?').run(id);
  db.prepare('DELETE FROM practice_questions WHERE chapter_id = ?').run(id);
  db.prepare('DELETE FROM mcq_questions WHERE chapter_id = ?').run(id);
  db.prepare('DELETE FROM chapters WHERE id = ?').run(id);
  res.json({ ok: true, state: getState() });
});

// ---------- Admin/Teacher: content delete ----------

app.delete('/api/lectures/:id', (req, res) => {
  db.prepare('DELETE FROM lectures WHERE id = ?').run(req.params.id);
  res.json({ ok: true, state: getState() });
});

app.delete('/api/notes/:id', (req, res) => {
  db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id);
  res.json({ ok: true, state: getState() });
});

app.delete('/api/practice/:id', (req, res) => {
  db.prepare('DELETE FROM practice_questions WHERE id = ?').run(req.params.id);
  res.json({ ok: true, state: getState() });
});

// ---------- Static (production) ----------

const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[server] Josephite Learning API running at http://localhost:${PORT}`);
  if (fs.existsSync(distDir)) console.log(`[server] Serving production build from dist/`);
});
