/* Full-flow API verification against the running server */
const BASE = 'http://localhost:3001';
let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; console.log(`  PASS ${name}`); } else { fail++; console.log(`  FAIL ${name}`); } };

async function api(path, method = 'GET', body) {
  const res = await fetch(BASE + path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch {}
  return { status: res.status, data };
}

(async () => {
  console.log('== 1. State & seed ==');
  const st = await api('/api/state');
  const db = st.data;
  ok('GET /api/state 200', st.status === 200);
  ok('school info (St. Josephite)', db.school?.nameEn === 'St. Josephite School & College' && db.school?.facebook === 'https://www.facebook.com/sjscb');
  ok('school about + tagline present', !!db.school?.about && db.school?.tagline === 'Empowering Minds, Enlightening Futures');
  ok('classes = 5', db.classes.length === 5);
  ok('subjects = 51 (papers split + BGS/Rel/HIM)', db.subjects.length === 51);
  ok('new subjects present (BAN1/2, ENG1/2, BGS, REL, HIM)', ['BAN1', 'BAN2', 'ENG1', 'ENG2', 'BGS', 'REL', 'HIM'].every(c => db.subjects.some(s => s.code === c)));
  ok('Higher Math only in class 9-10', db.subjects.every(s => s.code !== 'HIM' || ['cls9', 'cls10'].includes(s.classId)));
  ok('chapters = 161', db.chapters.length === 161);
  ok('users (3 roles, 6 students)', db.users.some(u => u.role === 'admin') && db.users.some(u => u.role === 'teacher') && db.users.filter(u => u.role === 'student').length === 6);
  ok('student roster (Arafat..Jerin)', ['Arafat Rahman', 'Kabbo Mahmud', 'Saif Khan', 'Fauzia Dina', 'Koyel Saha', 'Jerin Sultana'].every(n => db.users.some(u => u.name === n)));
  ok('Benedict Gomes is প্রধান শিক্ষক', db.users.find(u => u.name === 'Benedict Gomes')?.designation === 'প্রধান শিক্ষক');

  const everyCh = db.chapters;
  ok('every chapter has ≥25 MCQ', everyCh.every(c => c.mcq.questions.length >= 25));
  ok('every chapter has ≥1 note + ≥1 practice', everyCh.every(c => c.notes.length >= 1 && c.practice.length >= 1));
  ok('every chapter has ≥1 lecture + description', everyCh.every(c => c.lectures.length >= 1 && !!c.lectures[0].description));
  ok('MCQ test duration = Q count × 1 min', everyCh.every(c => c.mcq.durationMin === c.mcq.questions.length));

  const motion = db.chapters.find(c => c.id === 'cls9_phy_c1');
  ok('Motion chapter lectures = 2', motion.lectures.length === 2);
  ok('Motion video URL (mock YouTube)', motion.lectures[0].videoUrl.startsWith('https://www.youtube.com/embed/'));
  ok('Motion notes = 2', motion.notes.length === 2);
  ok('Motion practice = 10', motion.practice.length === 10);
  ok('Motion MCQs = 25', motion.mcq.questions.length === 25);
  ok('MCQ options + explanation', motion.mcq.questions[0].options.length === 4 && !!motion.mcq.questions[0].explanation);
  ok('weekly exams = 3', db.weeklyExams.length === 3);
  ok('seed results present', db.results.length >= 15);
  ok('notices = 3', db.notices.length === 3);

  console.log('== 2. Login (all roles) ==');
  const s = await api('/api/login', 'POST', { email: 'student@demo.com', password: 'demo123' });
  ok('student login', s.status === 200 && s.data.role === 'student');
  const t = await api('/api/login', 'POST', { email: 'teacher@demo.com', password: 'demo123' });
  ok('teacher login', t.status === 200 && t.data.role === 'teacher');
  const a = await api('/api/login', 'POST', { email: 'admin@demo.com', password: 'demo123' });
  ok('admin login', a.status === 200 && a.data.role === 'admin');
  const bad = await api('/api/login', 'POST', { email: 'student@demo.com', password: 'wrong' });
  ok('wrong password rejected', bad.status === 401);

  console.log('== 3. Student: MCQ submit -> result persisted in .db ==');
  const before = (await api('/api/state')).data.results.length;
  const answers = motion.mcq.questions.map(q => ({
    question: q.question, options: q.options, correctIndex: q.correctIndex,
    selected: q.correctIndex, explanation: q.explanation,
  }));
  const sub = await api('/api/results', 'POST', {
    userId: 'usr_s1', type: 'chapter', refId: 'cls9_phy_c1',
    title: motion.mcq.title, total: 25, obtained: 25, answers,
  });
  ok('POST /api/results ok', sub.status === 200 && !!sub.data.resultId);
  ok('result in state', sub.data.state.results.length === before + 1);
  const myRes = sub.data.state.results.find(r => r.id === sub.data.resultId);
  ok('result fields (25/25, 100%)', myRes.obtained === 25 && myRes.percentage === 100 && myRes.answers.length === 25);

  console.log('== 4. Teacher: add lecture / notes / practice / MCQ ==');
  const L = await api('/api/chapters/cls9_phy_c1/lectures', 'POST', { title: 'API Test Lecture', videoUrl: 'https://www.youtube.com/embed/abc123' });
  ok('add lecture', L.status === 200 && L.data.state.chapters.find(c => c.id === 'cls9_phy_c1').lectures.some(l => l.title === 'API Test Lecture'));
  const N = await api('/api/chapters/cls9_phy_c1/notes', 'POST', { title: 'API Test Note', content: 'test content' });
  ok('add note', N.status === 200 && N.data.state.chapters.find(c => c.id === 'cls9_phy_c1').notes.some(n => n.title === 'API Test Note'));
  const P = await api('/api/chapters/cls9_phy_c1/practice', 'POST', { question: 'API Test Q?', answer: 'API Test A' });
  ok('add practice', P.status === 200 && P.data.state.chapters.find(c => c.id === 'cls9_phy_c1').practice.some(p => p.question === 'API Test Q?'));
  const M = await api('/api/chapters/cls9_phy_c1/mcq', 'POST', { question: 'API Test MCQ?', options: ['a', 'b', 'c', 'd'], correctIndex: 2, explanation: 'because' });
  const addedMcq = M.data.state.chapters.find(c => c.id === 'cls9_phy_c1').mcq.questions.find(q => q.question === 'API Test MCQ?');
  ok('add MCQ (26 now)', M.status === 200 && M.data.state.chapters.find(c => c.id === 'cls9_phy_c1').mcq.questions.length === 26);
  const D = await api(`/api/mcq/${addedMcq.id}`, 'DELETE');
  ok('delete MCQ (back to 25)', D.status === 200 && D.data.state.chapters.find(c => c.id === 'cls9_phy_c1').mcq.questions.length === 25);
  // cleanup: remove test-content so repeated runs stay consistent
  const afterAdd = D.data.state.chapters.find(c => c.id === 'cls9_phy_c1');
  for (const l of afterAdd.lectures.filter(x => x.title === 'API Test Lecture')) await api(`/api/lectures/${l.id}`, 'DELETE');
  for (const n of afterAdd.notes.filter(x => x.title === 'API Test Note')) await api(`/api/notes/${n.id}`, 'DELETE');
  for (const p of afterAdd.practice.filter(x => x.question === 'API Test Q?')) await api(`/api/practice/${p.id}`, 'DELETE');

  console.log('== 5. Teacher: weekly exam lifecycle ==');
  const WE = await api('/api/weekly-exams', 'POST', { title: 'API Test Exam', durationMin: 5 });
  ok('create weekly exam', WE.status === 200 && !!WE.data.examId);
  const WQ = await api(`/api/weekly-exams/${WE.data.examId}/questions`, 'POST', { question: 'WQ?', options: ['1', '2', '3', '4'], correctIndex: 1 });
  ok('add exam question', WQ.status === 200 && WQ.data.state.weeklyExams.find(e => e.id === WE.data.examId).questions.length === 1);
  const WD = await api(`/api/weekly-exams/${WE.data.examId}`, 'DELETE');
  ok('delete weekly exam', WD.status === 200 && !WD.data.state.weeklyExams.some(e => e.id === WE.data.examId));

  console.log('== 6. Leaderboard ==');
  const lb = await api('/api/weekly-exams/week1/leaderboard');
  ok('leaderboard rows = 6', lb.status === 200 && lb.data.board.length === 6);
  ok('leaderboard rank order', lb.data.board[0].rank === 1 && lb.data.board[0].percentage >= lb.data.board[1].percentage);

  console.log('== 7. Admin: users / classes / notices ==');
  const AU = await api('/api/users', 'POST', { name: 'API Student', email: `apitest${Date.now()}@demo.com`, password: 'demo123', role: 'student', classId: 'cls9' });
  ok('add student', AU.status === 200 && AU.data.state.users.some(u => u.name === 'API Student'));
  const newId = AU.data.state.users.find(u => u.name === 'API Student').id;
  const DU = await api(`/api/users/${newId}`, 'DELETE');
  ok('delete student', DU.status === 200 && !DU.data.state.users.some(u => u.name === 'API Student'));
  const dup = await api('/api/users', 'POST', { name: 'Dup', email: 'student@demo.com', password: 'demo123', role: 'student' });
  ok('duplicate email rejected (409)', dup.status === 409);
  const AN = await api('/api/notices', 'POST', { title: 'API Notice', body: 'test body' });
  ok('publish notice', AN.status === 200 && AN.data.state.notices.some(n => n.title === 'API Notice'));
  const nid = AN.data.state.notices.find(n => n.title === 'API Notice').id;
  const UN = await api(`/api/notices/${nid}`, 'PUT', { title: 'API Notice (edited)', body: 'edited body' });
  ok('edit notice', UN.status === 200 && UN.data.state.notices.some(n => n.title === 'API Notice (edited)'));
  const DN = await api(`/api/notices/${nid}`, 'DELETE');
  ok('delete notice', DN.status === 200 && !DN.data.state.notices.some(n => n.title === 'API Notice (edited)'));

  console.log('== 8. A-to-Z: user edit / results / chapters / content delete ==');
  const EU = await api('/api/users', 'POST', { name: 'Edit Me', email: `editme${Date.now()}@demo.com`, password: 'demo123', role: 'student', classId: 'cls9' });
  const euId = EU.data.state.users.find(u => u.name === 'Edit Me').id;
  const UP = await api(`/api/users/${euId}`, 'PUT', { name: 'Edited Name', roll: '99', password: 'newpass1' });
  const edited = UP.data.state.users.find(u => u.id === euId);
  ok('edit user (name/roll)', UP.status === 200 && edited.name === 'Edited Name' && edited.roll === '99');
  const ulogin = await api('/api/login', 'POST', { email: edited.email, password: 'newpass1' });
  ok('edited password works on login', ulogin.status === 200);
  await api(`/api/users/${euId}`, 'DELETE');

  const dr = await api(`/api/results/${sub.data.resultId}`, 'DELETE');
  ok('delete result', dr.status === 200 && !dr.data.state.results.some(r => r.id === sub.data.resultId));

  const NC = await api('/api/subjects/cls9_ban1/chapters', 'POST', { name: 'API Chapter' });
  const ncId = NC.data.chapterId;
  const nc = NC.data.state.chapters.find(c => c.id === ncId);
  ok('add chapter (order=4, default note)', NC.status === 200 && nc.order === 4 && nc.notes.length === 1);
  const nl = await api(`/api/chapters/${ncId}/lectures`, 'POST', { title: 'Temp Lecture', videoUrl: 'https://www.youtube.com/embed/x' });
  const nlCh = nl.data.state.chapters.find(c => c.id === ncId);
  const dl = await api(`/api/lectures/${nlCh.lectures[0].id}`, 'DELETE');
  ok('delete lecture', dl.status === 200 && dl.data.state.chapters.find(c => c.id === ncId).lectures.length === 0);
  const nn = await api(`/api/chapters/${ncId}/notes`, 'POST', { title: 'Temp Note', content: 'x' });
  const nnCh = nn.data.state.chapters.find(c => c.id === ncId);
  const tempNote = nnCh.notes.find(n => n.title === 'Temp Note');
  const dn = await api(`/api/notes/${tempNote.id}`, 'DELETE');
  ok('delete note', dn.status === 200 && !dn.data.state.chapters.find(c => c.id === ncId).notes.some(n => n.title === 'Temp Note'));
  const np = await api(`/api/chapters/${ncId}/practice`, 'POST', { question: 'Temp Q?', answer: 'A' });
  const npCh = np.data.state.chapters.find(c => c.id === ncId);
  const dp = await api(`/api/practice/${npCh.practice[0].id}`, 'DELETE');
  ok('delete practice', dp.status === 200 && dp.data.state.chapters.find(c => c.id === ncId).practice.length === 0);
  const DC = await api(`/api/chapters/${ncId}`, 'DELETE');
  ok('delete chapter (cascade, back to 3)', DC.status === 200 && !DC.data.state.chapters.some(c => c.id === ncId));

  console.log('== 9. Comments (lecture discussion) ==');
  const lecId = db.chapters.find(c => c.id === 'cls9_phy_c1').lectures[0].id;
  const noAuth = await api(`/api/lectures/${lecId}/comments`, 'POST', { userId: '', body: 'x' });
  ok('comment without user rejected (400)', noAuth.status === 400);
  const badLec = await api('/api/lectures/nope/comments', 'POST', { userId: 'usr_s1', body: 'x' });
  ok('comment on missing lecture (404)', badLec.status === 404);
  const C = await api(`/api/lectures/${lecId}/comments`, 'POST', { userId: 'usr_s1', body: 'API টেস্ট মন্তব্য' });
  ok('student adds comment', C.status === 200 && C.data.state.comments.some(c => c.body === 'API টেস্ট মন্তব্য'));
  const cmtId = C.data.commentId;
  const delByStudent = await api(`/api/comments/${cmtId}`, 'DELETE', { userId: 'usr_s1' });
  ok('student cannot delete comment (403)', delByStudent.status === 403);
  const delByTeacher = await api(`/api/comments/${cmtId}`, 'DELETE', { userId: 'usr_t1' });
  ok('teacher deletes comment', delByTeacher.status === 200 && !delByTeacher.data.state.comments.some(c => c.id === cmtId));

  console.log('== 10. Persistence: file-based DB ==');
  ok('results count consistent after deletes', (await api('/api/state')).data.results.length >= 15);

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error('SCRIPT ERROR:', e.message); process.exit(2); });
