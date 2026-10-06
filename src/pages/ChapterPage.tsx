import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, SectionTitle, EmptyState, Badge, btnPrimary } from '../components/ui';
import { chapterBest } from '../lib/progress';

export default function ChapterPage() {
  const { chapterId } = useParams();
  const { db, user } = useApp();
  const [openNote, setOpenNote] = useState<string | null>(null);
  const [openPq, setOpenPq] = useState<string | null>(null);

  const chapter = db.chapters.find((c) => c.id === chapterId);
  if (!chapter) return <div className="mx-auto max-w-7xl px-4 py-10"><EmptyState title="Chapter not found" /></div>;

  const subject = db.subjects.find((s) => s.id === chapter.subjectId)!;
  const cls = db.classes.find((c) => c.id === subject.classId)!;
  const best = user ? chapterBest(db, user.id, chapter.id) : null;
  const hasTest = chapter.mcq.questions.length > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link to={user ? '/dashboard' : '/'} className="hover:text-indigo-600">{cls.name}</Link>
        <span>/</span>
        <Link to={`/subject/${subject.id}`} className="hover:text-indigo-600">{subject.name}</Link>
        <span>/</span>
        <span className="font-semibold text-slate-700">{chapter.name}</span>
      </div>

      <SectionTitle
        title={`Chapter ${chapter.order}: ${chapter.name}`}
        sub={subject.name}
        action={
          hasTest ? (
            <Link to={`/quiz/chapter/${chapter.id}`} {...btnPrimary()}>
              Start MCQ Test ({chapter.mcq.questions.length} Q · {chapter.mcq.durationMin} min)
            </Link>
          ) : (
            <Badge tone="amber">MCQ Test coming soon</Badge>
          )
        }
      />

      {best && (
        <div className="mb-6 rounded-xl bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-800 ring-1 ring-indigo-100">
          তোমার সেরা স্কোর এই অধ্যায়ে: {best.percentage}% ({best.obtained}/{best.total}){' '}
          <Link to={`/result/${best.id}`} className="underline">ফলাফল দেখো →</Link>
        </div>
      )}

      {/* Lectures */}
      <h3 className="mb-3 mt-8 text-lg font-bold text-slate-900">Lectures</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {chapter.lectures.map((lec) => (
          <Card key={lec.id} className="overflow-hidden">
            <div className="aspect-video w-full bg-slate-900">
              <iframe
                src={lec.videoUrl}
                title={lec.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4">
              <p className="font-bold text-slate-800">{lec.title}</p>
              {lec.description && <p className="mt-1 text-sm text-slate-500">{lec.description}</p>}
            </div>
          </Card>
        ))}
      </div>

      {/* Notes */}
      <h3 className="mb-3 mt-10 text-lg font-bold text-slate-900">Notes</h3>
      <div className="space-y-3">
        {chapter.notes.map((n) => (
          <Card key={n.id} className="overflow-hidden">
            <button
              onClick={() => setOpenNote(openNote === n.id ? null : n.id)}
              className="flex w-full items-center justify-between gap-3 p-4 text-left"
            >
              <span className="font-semibold text-slate-800">{n.title}</span>
              <span className="text-sm font-bold text-indigo-600">{openNote === n.id ? 'Hide −' : 'Read +'}</span>
            </button>
            {openNote === n.id && (
              <pre className="whitespace-pre-wrap border-t border-slate-100 bg-slate-50 px-5 py-4 font-sans text-sm leading-relaxed text-slate-700">
                {n.content}
              </pre>
            )}
          </Card>
        ))}
      </div>

      {/* Practice */}
      <h3 className="mb-3 mt-10 text-lg font-bold text-slate-900">Practice Questions</h3>
      {chapter.practice.length === 0 ? (
        <EmptyState title="এই অধ্যায়ে এখনো Practice Question যোগ করা হয়নি" sub="শিক্ষক শীঘ্রই যোগ করবেন।" />
      ) : (
        <div className="space-y-3">
          {chapter.practice.map((p, i) => (
            <Card key={p.id} className="overflow-hidden">
              <button
                onClick={() => setOpenPq(openPq === p.id ? null : p.id)}
                className="flex w-full items-start justify-between gap-3 p-4 text-left"
              >
                <span className="font-medium text-slate-800"><strong className="text-indigo-600">Q{i + 1}.</strong> {p.question}</span>
                <span className="shrink-0 text-sm font-bold text-indigo-600">{openPq === p.id ? 'Answer −' : 'Answer +'}</span>
              </button>
              {openPq === p.id && (
                <div className="border-t border-slate-100 bg-emerald-50 px-5 py-4 text-sm leading-relaxed text-emerald-900">
                  <strong>উত্তর:</strong> {p.answer}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* MCQ CTA */}
      <div className="mt-10">
        {hasTest ? (
          <Card className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white">
            <div>
              <p className="text-lg font-extrabold">{chapter.mcq.title}</p>
              <p className="mt-1 text-sm text-indigo-100">
                {chapter.mcq.questions.length} Questions · {chapter.mcq.durationMin} মিনিট · Submit করার পর Automatic Result
              </p>
            </div>
            <Link to={`/quiz/chapter/${chapter.id}`} className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 shadow transition hover:bg-indigo-50">
              Start Test →
            </Link>
          </Card>
        ) : (
          <EmptyState title="এই অধ্যায়ের MCQ Test শিক্ষক শীঘ্রই যোগ করবেন" sub="Teacher Panel থেকে MCQ যোগ করা যায়।" />
        )}
      </div>
    </div>
  );
}
