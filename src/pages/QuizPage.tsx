import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, EmptyState, fmtTime } from '../components/ui';
import type { AnswerSnapshot, MCQ } from '../types';

function QuizEngine({ title, questions, durationMin, type, refId }: {
  title: string;
  questions: MCQ[];
  durationMin: number;
  type: 'chapter' | 'weekly';
  refId: string;
}) {
  const { user, mutate } = useApp();
  const nav = useNavigate();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [confirming, setConfirming] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(durationMin * 60);
  const submittedRef = useRef(false);

  const q = questions[idx];
  const answeredCount = Object.keys(answers).length;

  const submit = useMemo(
    () => async () => {
      if (submittedRef.current || !user) return;
      submittedRef.current = true;
      let correct = 0;
      const snapshot: AnswerSnapshot[] = questions.map((qq) => {
        const selected = answers[qq.id] ?? null;
        if (selected === qq.correctIndex) correct++;
        return { question: qq.question, options: qq.options, correctIndex: qq.correctIndex, selected, explanation: qq.explanation };
      });
      try {
        const data = await mutate('/results', 'POST', {
          userId: user.id,
          type,
          refId,
          title,
          total: questions.length,
          obtained: correct,
          answers: snapshot,
        });
        nav(`/result/${data.resultId}`);
      } catch {
        submittedRef.current = false;
        setConfirming(false);
      }
    },
    [answers, mutate, nav, questions, refId, title, type, user]
  );

  useEffect(() => {
    if (secondsLeft <= 0) { submit(); return; }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, submit]);

  if (!questions.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState title="এই পরীক্ষায় এখনো প্রশ্ন যোগ করা হয়নি" sub="শিক্ষক শীঘ্রই প্রশ্ন যোগ করবেন।">
          <Link to="/weekly" className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white">Back →</Link>
        </EmptyState>
      </div>
    );
  }

  const low = secondsLeft <= 60;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500">{questions.length} Questions · {answeredCount} answered</p>
        </div>
        <div className={`rounded-xl px-5 py-3 font-mono text-2xl font-bold text-white shadow ${low ? 'bg-rose-500 animate-pulse' : 'bg-slate-800'}`}>
          {fmtTime(secondsLeft)}
        </div>
      </div>

      {/* Question palette */}
      <div className="mb-6 flex flex-wrap gap-2">
        {questions.map((qq, i) => (
          <button
            key={qq.id}
            onClick={() => setIdx(i)}
            className={`h-9 w-9 rounded-lg text-sm font-bold transition ${
              i === idx
                ? 'bg-indigo-600 text-white shadow'
                : answers[qq.id] !== undefined
                  ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300'
                  : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question card */}
      {q && (
        <Card className="p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Question {idx + 1} of {questions.length}</p>
          <p className="mt-3 text-lg font-semibold leading-relaxed text-slate-900">{q.question}</p>
          <div className="mt-6 space-y-3">
            {q.options.map((opt, oi) => {
              const selected = answers[q.id] === oi;
              return (
                <button
                  key={oi}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition ${
                    selected
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/40'
                  }`}
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                    selected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {['ক', 'খ', 'গ', 'ঘ'][oi]}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* Nav */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-40"
        >
          ← Previous
        </button>
        {idx < questions.length - 1 ? (
          <button onClick={() => setIdx((i) => i + 1)} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
            Next →
          </button>
        ) : <span />}
        <button
          onClick={() => setConfirming(true)}
          className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow transition hover:bg-emerald-700"
        >
          Submit Exam ✓
        </button>
      </div>

      {/* Confirm modal */}
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <Card className="w-full max-w-md p-6">
            <p className="text-lg font-bold text-slate-900">Submit করতে চাও?</p>
            <p className="mt-2 text-sm text-slate-600">
              মোট {questions.length}টি প্রশ্নের মধ্যে {answeredCount}টির উত্তর দেওয়া হয়েছে।
              {answeredCount < questions.length && ' বাকি প্রশ্নগুলো ভুল হিসেবে গণনা হবে।'}
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setConfirming(false)} className="rounded-lg bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700">
                Continue Exam
              </button>
              <button onClick={submit} className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white">
                Yes, Submit
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export function QuizChapter() {
  const { chapterId } = useParams();
  const { db } = useApp();
  const chapter = db.chapters.find((c) => c.id === chapterId);
  if (!chapter) return <div className="mx-auto max-w-3xl px-4 py-10"><EmptyState title="Chapter not found" /></div>;
  return (
    <QuizEngine
      key={chapter.id}
      title={chapter.mcq.title}
      questions={chapter.mcq.questions}
      durationMin={Math.max(1, chapter.mcq.durationMin || chapter.mcq.questions.length)}
      type="chapter"
      refId={chapter.id}
    />
  );
}

export function QuizWeekly() {
  const { examId } = useParams();
  const { db } = useApp();
  const exam = db.weeklyExams.find((e) => e.id === examId);
  if (!exam) return <div className="mx-auto max-w-3xl px-4 py-10"><EmptyState title="Exam not found" /></div>;
  return (
    <QuizEngine
      key={exam.id}
      title={exam.title}
      questions={exam.questions}
      durationMin={Math.max(1, exam.durationMin || exam.questions.length)}
      type="weekly"
      refId={exam.id}
    />
  );
}
