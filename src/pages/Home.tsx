import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, SectionTitle, Badge, fmtDate } from '../components/ui';
import { chapterBest } from '../lib/progress';

export default function Home() {
  const { db, user } = useApp();
  const featured = db.chapters
    .filter((c) => c.mcq.questions.length > 0)
    .slice(0, 4);
  const nextExam = [...db.weeklyExams].sort((a, b) => a.weekNo - b.weekNo)[0];
  const teachers = db.users.filter((u) => u.role === 'teacher');

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ring-1 ring-white/30">
              Official E-Learning Platform · Science Fair Demo
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-5xl">
              E-Learning <span className="text-amber-300">Bangladesh</span>
            </h1>
            <p className="mt-4 text-lg font-medium text-indigo-100 sm:text-xl">
              স্কুলে যা শিখেছো, তা যেন ভুলে না যায় — নিয়মিত Practice-এর মাধ্যমে পরীক্ষার জন্য প্রস্তুত হও।
            </p>
            <p className="mt-2 text-sm text-indigo-200">
              Learn → Practice → Test → Improve · শিখুন → অনুশীলন করুন → নিজেকে যাচাই করুন → উন্নতি করুন
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={user ? (user.role === 'student' ? '/dashboard' : user.role === 'teacher' ? '/teacher' : '/admin') : '/login'}
                className="rounded-xl bg-white px-7 py-3 text-sm font-bold text-indigo-700 shadow-lg transition hover:bg-indigo-50 sm:text-base"
              >
                Start Learning
              </Link>
              <Link
                to="/weekly"
                className="rounded-xl bg-white/10 px-7 py-3 text-sm font-bold text-white ring-1 ring-white/40 transition hover:bg-white/20 sm:text-base"
              >
                Weekly Exam
              </Link>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { v: db.classes.length, l: 'Classes' },
              { v: db.subjects.length, l: 'Subjects' },
              { v: db.chapters.length, l: 'Chapters' },
              { v: db.users.filter((u) => u.role === 'student').length, l: 'Students' },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-white/10 p-4 text-center ring-1 ring-white/20">
                <p className="text-2xl font-extrabold sm:text-3xl">{s.v}+</p>
                <p className="text-xs font-medium text-indigo-100 sm:text-sm">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Flow */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-slate-600">
          {['Login', 'Class', 'Subject', 'Chapter', 'Lecture', 'Practice', 'MCQ Test', 'Result', 'Progress'].map((step, i, arr) => (
            <span key={step} className="flex items-center gap-2">
              <span className="rounded-lg bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">{step}</span>
              {i < arr.length - 1 && <span className="text-indigo-400">→</span>}
            </span>
          ))}
        </div>

        {/* Classes */}
        <SectionTitle title="Our Classes" sub="Class 6 থেকে Class 10 পর্যন্ত সকল শ্রেণির বিষয়ভিত্তিক কনটেন্ট" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {db.classes.map((c) => (
            <Link key={c.id} to={user ? `/class/${c.id}` : '/login'}>
              <Card className="group p-6 text-center transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 text-lg font-extrabold text-white shadow">
                  {c.name.replace('Class ', '')}
                </div>
                <p className="font-bold text-slate-800">{c.name}</p>
                <p className="text-xs text-slate-500">{c.nameBn}</p>
                <p className="mt-2 text-[11px] font-medium text-indigo-600 opacity-0 transition group-hover:opacity-100">
                  {db.subjects.filter((s) => s.classId === c.id).length} Subjects →
                </p>
              </Card>
            </Link>
          ))}
        </div>

        {/* Subjects */}
        <div className="mt-14">
          <SectionTitle title="Subjects" sub="Science Group-এর সকল বিষয়" />
          <div className="flex flex-wrap gap-2.5">
            {Object.values(
              db.subjects.reduce<Record<string, { name: string; color: string; count: number }>>((acc, s) => {
                const key = s.code;
                acc[key] = { name: s.name, color: s.color, count: (acc[key]?.count ?? 0) + 1 };
                return acc;
              }, {})
            ).map((s) => (
              <span key={s.name} className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${s.color} px-4 py-2 text-sm font-semibold text-white shadow-sm`}>
                {s.name}
              </span>
            ))}
          </div>
        </div>

        {/* Featured Lectures */}
        <div className="mt-14">
          <SectionTitle title="Featured Lectures & Tests" sub="MCQ Test প্রকাশিত অধ্যায়সমূহ" action={<Link to="/login" className="text-sm font-semibold text-indigo-600 hover:underline">View All →</Link>} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((ch) => {
              const subject = db.subjects.find((s) => s.id === ch.subjectId)!;
              const cls = db.classes.find((c) => c.id === subject.classId)!;
              return (
                <Link key={ch.id} to={user ? `/chapter/${ch.id}` : '/login'}>
                  <Card className="h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-md">
                    <div className={`h-2 bg-gradient-to-r ${subject.color}`} />
                    <div className="p-5">
                      <Badge tone="slate">{cls.name}</Badge>
                      <p className="mt-2 font-bold text-slate-800">{ch.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{subject.name}</p>
                      <p className="mt-3 text-xs font-semibold text-indigo-600">{ch.mcq.questions.length} MCQ · {ch.lectures.length} Lecture</p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Weekly exam + Notices */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-400 p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-wider">This Week</p>
              <p className="mt-1 text-lg font-extrabold">{nextExam?.title ?? 'Weekly Exam'}</p>
            </div>
            <div className="p-5">
              <p className="text-sm text-slate-600">
                প্রতি সপ্তাহে সাপ্তাহিক MCQ পরীক্ষা — পরীক্ষা দাও, Result দেখো এবং <strong>Leaderboard</strong>-এ তোমার অবস্থান দেখো।
              </p>
              <Link to="/weekly" className="mt-4 inline-block rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
                Go to Weekly Exam →
              </Link>
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle title="Notice Board" sub="সাম্প্রতিক নোটিশ" />
            <ul className="space-y-3">
              {db.notices.slice(0, 3).map((n) => (
                <li key={n.id} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
                  <p className="font-semibold text-slate-800">{n.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{n.body}</p>
                  <p className="mt-2 text-xs text-slate-400">{fmtDate(n.date)}</p>
                </li>
              ))}
            </ul>
            <Link to="/notices" className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:underline">
              All Notices →
            </Link>
          </Card>
        </div>

        {/* About */}
        <div className="mt-14">
          <SectionTitle title="About Our School" sub={db.school.nameEn} />
          <Card className="p-6 sm:p-8">
            <p className="leading-relaxed text-slate-600">
              {db.school.name} একটি আদর্শ শিক্ষা প্রতিষ্ঠান। আমাদের শিক্ষকরা প্রতিদিন বিভিন্ন বিষয় পড়ান; কিন্তু অনেক শিক্ষার্থী নিয়মিত Revision ও
              Practice না করার কারণে শেখা বিষয় ভুলে যায়। <strong className="text-slate-800">E-Learning Bangladesh</strong> এই সমস্যার সমাধানে তৈরি —
              স্কুলে যে Class/Lecture হয়, তার ভিডিও, নোট, Practice ও MCQ Test এই প্ল্যাটফর্মেই থাকবে।
              <br /><br />
              <strong className="text-slate-800">School Class → Online Revision → Practice → MCQ Test → Result → Improvement</strong>
            </p>
          </Card>
        </div>

        {/* Teachers */}
        <div className="mt-14">
          <SectionTitle title="Our Teachers" sub="আমাদের শিক্ষকমণ্ডলী" />
          <div className="grid gap-4 sm:grid-cols-3">
            {teachers.map((t) => (
              <Card key={t.id} className="p-6 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-400 text-xl font-extrabold text-white">
                  {t.name.charAt(0)}
                </div>
                <p className="font-bold text-slate-800">{t.name}</p>
                <p className="text-sm text-slate-500">{t.designation}</p>
                {t.subject && <Badge tone="indigo">{t.subject}</Badge>}
              </Card>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mt-14">
          <SectionTitle title="Contact Us" sub="যোগাযোগ" />
          <Card className="grid gap-6 p-6 sm:grid-cols-4 sm:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Address</p>
              <p className="mt-1 text-slate-700">{db.school.address}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Phone</p>
              <p className="mt-1 text-slate-700">{db.school.phone}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Email</p>
              <p className="mt-1 break-all text-slate-700">{db.school.email}</p>
            </div>
            {db.school.facebook && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Facebook</p>
                <a href={db.school.facebook} target="_blank" rel="noreferrer" className="mt-1 inline-block font-medium text-blue-600 hover:underline">
                  facebook.com/sjscb ↗
                </a>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
