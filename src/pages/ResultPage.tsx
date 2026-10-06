import { Link, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, EmptyState, ScoreRing, Badge, fmtDate } from '../components/ui';

export default function ResultPage() {
  const { resultId } = useParams();
  const { db } = useApp();
  const result = db.results.find((r) => r.id === resultId);

  if (!result) return <div className="mx-auto max-w-4xl px-4 py-10"><EmptyState title="Result not found" /></div>;

  const tone = result.percentage >= 80 ? 'green' : result.percentage >= 40 ? 'indigo' : 'red';
  const msg =
    result.percentage >= 80 ? 'অভিনন্দন! দুর্দান্ত ফলাফল।'
    : result.percentage >= 40 ? 'ভালো চেষ্টা! আরও Practice করলে আরও ভালো করবে।'
    : 'চিন্তা নেই — নোট পড়ে আবার Practice করো, অবশ্যই উন্নতি হবে।';

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Card className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-center gap-8 sm:justify-between">
          <ScoreRing percentage={result.percentage} />
          <div className="text-center sm:text-left">
            <Badge tone={tone as 'green' | 'indigo' | 'red'}>{result.type === 'weekly' ? 'Weekly Exam' : 'Chapter Test'}</Badge>
            <h1 className="mt-2 text-xl font-extrabold text-slate-900 sm:text-2xl">{result.title}</h1>
            <p className="mt-1 text-sm text-slate-500">{fmtDate(result.date)}</p>
            <p className="mt-3 max-w-md font-medium text-slate-600">{msg}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            {[
              { l: 'Total Marks', v: result.total, c: 'text-slate-800' },
              { l: 'Obtained', v: result.obtained, c: 'text-indigo-600' },
              { l: 'Correct', v: result.correct, c: 'text-emerald-600' },
              { l: 'Wrong', v: result.wrong, c: 'text-rose-500' },
            ].map((s) => (
              <div key={s.l} className="rounded-xl bg-slate-50 px-6 py-4 text-center ring-1 ring-slate-100">
                <p className={`text-2xl font-extrabold ${s.c}`}>{s.v}</p>
                <p className="text-xs font-medium text-slate-500">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-end">
          {result.type === 'weekly' && (
            <Link to={`/leaderboard/${result.refId}`} className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600">
              View Leaderboard →
            </Link>
          )}
          <Link to={result.type === 'weekly' ? '/weekly' : '/results'} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
            Back to Exams
          </Link>
        </div>
      </Card>

      {/* Answer review */}
      <h2 className="mb-4 mt-10 text-xl font-bold text-slate-900">Answer Review — কোন প্রশ্নগুলো ভুল হয়েছে</h2>
      {result.answers.length === 0 ? (
        <EmptyState title="এই ফলাফলের বিস্তারিত উত্তরপত্র সংরক্ষিত নেই" sub="এটি একটি Sample/Seed Result — নতুন পরীক্ষা দিলে প্রতিটি প্রশ্নের Review দেখা যাবে।" />
      ) : (
        <div className="space-y-3">
          {result.answers.map((a, i) => {
            const isCorrect = a.selected === a.correctIndex;
            return (
              <Card key={i} className={`overflow-hidden border-l-4 ${isCorrect ? 'border-l-emerald-500' : 'border-l-rose-500'}`}>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-slate-800">
                      <span className="text-indigo-600">Q{i + 1}.</span> {a.question}
                    </p>
                    <Badge tone={isCorrect ? 'green' : 'red'}>{isCorrect ? 'Correct' : 'Wrong'}</Badge>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {a.options.map((opt, oi) => {
                      const correct = oi === a.correctIndex;
                      const chosen = oi === a.selected;
                      return (
                        <div
                          key={oi}
                          className={`rounded-lg px-3 py-2 text-sm font-medium ring-1 ${
                            correct
                              ? 'bg-emerald-50 text-emerald-800 ring-emerald-300'
                              : chosen
                                ? 'bg-rose-50 text-rose-700 ring-rose-300'
                                : 'bg-white text-slate-600 ring-slate-200'
                          }`}
                        >
                          {['ক', 'খ', 'গ', 'ঘ'][oi]}) {opt}
                          {correct && <span className="ml-2 text-xs font-bold">✓ Correct</span>}
                          {chosen && !correct && <span className="ml-2 text-xs font-bold">✗ Your answer</span>}
                        </div>
                      );
                    })}
                  </div>
                  {a.explanation && (
                    <p className="mt-3 rounded-lg bg-indigo-50 px-4 py-2.5 text-sm text-indigo-900 ring-1 ring-indigo-100">
                      <strong>ব্যাখ্যা:</strong> {a.explanation}
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
