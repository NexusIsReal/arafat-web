import type { DB, User, ExamResult, Chapter, Subject } from '../types';

export function chapterBest(db: DB, userId: string, chapterId: string): ExamResult | null {
  const rs = db.results.filter(
    (r) => r.userId === userId && r.type === 'chapter' && r.refId === chapterId
  );
  if (!rs.length) return null;
  return rs.reduce((best, r) => (r.percentage > best.percentage ? r : best));
}

export function subjectProgress(db: DB, user: User, subject: Subject): number {
  const chapters = db.chapters.filter(
    (c) => c.subjectId === subject.id && c.mcq.questions.length > 0
  );
  if (!chapters.length) return 0;
  let sum = 0;
  for (const ch of chapters) {
    const best = chapterBest(db, user.id, ch.id);
    sum += best?.percentage ?? 0;
  }
  return Math.round(sum / chapters.length);
}

export function completedChapters(db: DB, user: User, subjectIds: string[]): Chapter[] {
  return db.chapters.filter((c) => {
    if (!subjectIds.includes(c.subjectId)) return false;
    const best = chapterBest(db, user.id, c.id);
    return (best?.percentage ?? 0) >= 60;
  });
}

export function overallAverage(db: DB, user: User, subjects: Subject[]): number {
  const list = subjects.filter((s) =>
    db.chapters.some((c) => c.subjectId === s.id && c.mcq.questions.length > 0)
  );
  if (!list.length) return 0;
  return Math.round(list.reduce((acc, s) => acc + subjectProgress(db, user, s), 0) / list.length);
}

export function weakChapters(db: DB, user: User, subjectIds: string[], threshold = 60): Chapter[] {
  return db.chapters
    .filter((c) => {
      if (!subjectIds.includes(c.subjectId) || c.mcq.questions.length === 0) return false;
      const best = chapterBest(db, user.id, c.id);
      return (best?.percentage ?? 0) < threshold;
    })
    .sort((a, b) => {
      const pa = chapterBest(db, user.id, a.id)?.percentage ?? 0;
      const pb = chapterBest(db, user.id, b.id)?.percentage ?? 0;
      return pa - pb;
    });
}

export interface LeaderRow {
  user: User;
  result: ExamResult;
  rank: number;
}

export function leaderboard(db: DB, examId: string): LeaderRow[] {
  const best = new Map<string, ExamResult>();
  for (const r of db.results) {
    if (r.type !== 'weekly' || r.refId !== examId) continue;
    const cur = best.get(r.userId);
    if (
      !cur ||
      r.percentage > cur.percentage ||
      (r.percentage === cur.percentage && r.date < cur.date)
    ) {
      best.set(r.userId, r);
    }
  }
  return [...best.values()]
    .map((result) => ({ user: db.users.find((u) => u.id === result.userId)!, result, rank: 0 }))
    .filter((row) => row.user)
    .sort(
      (a, b) =>
        b.result.percentage - a.result.percentage ||
        b.result.obtained - a.result.obtained ||
        a.result.date.localeCompare(b.result.date)
    )
    .map((row, i) => ({ ...row, rank: i + 1 }));
}
