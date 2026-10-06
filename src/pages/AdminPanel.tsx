import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SUBJECT_META } from '../data/meta';
import { Card, SectionTitle, TabButton, Badge, inputCls, btnPrimary, Stat } from '../components/ui';

export default function AdminPanel() {
  const { db, mutate, user } = useApp();
  const [tab, setTab] = useState<'overview' | 'students' | 'teachers' | 'classes' | 'notices'>('overview');

  // student form
  const [sName, setSName] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [sClass, setSClass] = useState('cls9');
  const [sRoll, setSRoll] = useState('');
  // teacher form
  const [tName, setTName] = useState('');
  const [tEmail, setTEmail] = useState('');
  const [tSubject, setTSubject] = useState('');
  // class/subject form
  const [cName, setCName] = useState('');
  const [cNameBn, setCNameBn] = useState('');
  const [subClass, setSubClass] = useState('cls9');
  const [subCode, setSubCode] = useState('phy');
  // notice form
  const [nTitle, setNTitle] = useState('');
  const [nBody, setNBody] = useState('');

  const students = db.users.filter((u) => u.role === 'student');
  const teachers = db.users.filter((u) => u.role === 'teacher');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <SectionTitle
        title="Admin Panel"
        sub={`স্বাগতম, ${user?.name} — পুরো Website ব্যবস্থাপনা`}
        action={<Link to="/dashboard" className="text-sm font-semibold text-indigo-600 hover:underline">← Dashboard</Link>}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <TabButton active={tab === 'overview'} onClick={() => setTab('overview')}>Overview</TabButton>
        <TabButton active={tab === 'students'} onClick={() => setTab('students')}>Student Management</TabButton>
        <TabButton active={tab === 'teachers'} onClick={() => setTab('teachers')}>Teacher Management</TabButton>
        <TabButton active={tab === 'classes'} onClick={() => setTab('classes')}>Class & Subject</TabButton>
        <TabButton active={tab === 'notices'} onClick={() => setTab('notices')}>Notice Management</TabButton>
      </div>

      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="Total Students" value={students.length} />
            <Stat label="Total Teachers" value={teachers.length} color="text-emerald-600" />
            <Stat label="Classes" value={db.classes.length} color="text-violet-600" />
            <Stat label="Total Exams Taken" value={db.results.length} color="text-amber-600" />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Subjects" value={db.subjects.length} color="text-blue-600" />
            <Stat label="Chapters" value={db.chapters.length} color="text-indigo-600" />
            <Stat label="Lectures" value={db.chapters.reduce((a, c) => a + c.lectures.length, 0)} color="text-cyan-600" />
            <Stat label="MCQ Questions" value={db.chapters.reduce((a, c) => a + c.mcq.questions.length, 0)} color="text-rose-500" />
          </div>
          <Card className="mt-6 p-6">
            <p className="font-bold text-slate-800">School Info</p>
            <div className="mt-3 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <p><strong>{db.school.name}</strong> ({db.school.nameEn})</p>
              <p>EIIN: {db.school.eiin}</p>
              <p>{db.school.address}</p>
              <p>{db.school.phone} · {db.school.email}</p>
            </div>
          </Card>
        </>
      )}

      {tab === 'students' && (
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <Card className="space-y-3 p-6">
            <p className="font-bold text-slate-800">নতুন Student যোগ করুন</p>
            <input className={inputCls()} placeholder="Student Name" value={sName} onChange={(e) => setSName(e.target.value)} />
            <input className={inputCls()} placeholder="Email" value={sEmail} onChange={(e) => setSEmail(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <select className={inputCls()} value={sClass} onChange={(e) => setSClass(e.target.value)}>
                {db.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input className={inputCls()} placeholder="Roll" value={sRoll} onChange={(e) => setSRoll(e.target.value)} />
            </div>
            <button
              type="button" {...btnPrimary()}
              onClick={async () => {
                if (!sName.trim() || !sEmail.trim()) return;
                try {
                  await mutate('/users', 'POST', { name: sName.trim(), email: sEmail.trim(), password: 'demo123', role: 'student', classId: sClass, roll: sRoll.trim() || undefined });
                  setSName(''); setSEmail(''); setSRoll('');
                } catch (e) {
                  alert((e as Error).message);
                }
              }}
            >
              + Add Student
            </button>
            <p className="text-xs text-slate-400">Default Password: demo123</p>
          </Card>

          <Card className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Class</th>
                  <th className="px-5 py-3">Roll</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-semibold text-slate-800">{s.name}</td>
                    <td className="px-5 py-3 text-slate-500">{s.email}</td>
                    <td className="px-5 py-3">{db.classes.find((c) => c.id === s.classId)?.name ?? '—'}</td>
                    <td className="px-5 py-3">{s.roll ?? '—'}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => mutate(`/users/${s.id}`, 'DELETE').catch((e) => alert(e.message))}
                        className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {tab === 'teachers' && (
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <Card className="space-y-3 p-6">
            <p className="font-bold text-slate-800">নতুন Teacher যোগ করুন</p>
            <input className={inputCls()} placeholder="Teacher Name" value={tName} onChange={(e) => setTName(e.target.value)} />
            <input className={inputCls()} placeholder="Email" value={tEmail} onChange={(e) => setTEmail(e.target.value)} />
            <select className={inputCls()} value={tSubject} onChange={(e) => setTSubject(e.target.value)}>
              <option value="">Subject (optional)…</option>
              {Object.entries(SUBJECT_META).map(([code, m]) => <option key={code} value={m.name}>{m.name}</option>)}
            </select>
            <button
              type="button" {...btnPrimary()}
              onClick={async () => {
                if (!tName.trim() || !tEmail.trim()) return;
                try {
                  await mutate('/users', 'POST', { name: tName.trim(), email: tEmail.trim(), password: 'demo123', role: 'teacher', designation: 'সহকারী শিক্ষক', subject: tSubject || undefined });
                  setTName(''); setTEmail(''); setTSubject('');
                } catch (e) {
                  alert((e as Error).message);
                }
              }}
            >
              + Add Teacher
            </button>
            <p className="text-xs text-slate-400">Default Password: demo123</p>
          </Card>

          <Card className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Subject</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-semibold text-slate-800">{t.name}</td>
                    <td className="px-5 py-3 text-slate-500">{t.email}</td>
                    <td className="px-5 py-3">{t.subject ? <Badge tone="indigo">{t.subject}</Badge> : '—'}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => mutate(`/users/${t.id}`, 'DELETE').catch((e) => alert(e.message))}
                        className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {tab === 'classes' && (
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="space-y-6">
            <Card className="space-y-3 p-6">
              <p className="font-bold text-slate-800">নতুন Class যোগ করুন</p>
              <input className={inputCls()} placeholder="Class Name (যেমন: Class 11)" value={cName} onChange={(e) => setCName(e.target.value)} />
              <input className={inputCls()} placeholder="বাংলা নাম (যেমন: একাদশ শ্রেণি)" value={cNameBn} onChange={(e) => setCNameBn(e.target.value)} />
              <button
                type="button" {...btnPrimary()}
                onClick={async () => {
                  if (!cName.trim()) return;
                  try {
                    await mutate('/classes', 'POST', { name: cName.trim(), nameBn: cNameBn.trim() || undefined });
                    setCName(''); setCNameBn('');
                  } catch (e) {
                    alert((e as Error).message);
                  }
                }}
              >
                + Add Class
              </button>
            </Card>

            <Card className="space-y-3 p-6">
              <p className="font-bold text-slate-800">নতুন Subject যোগ করুন</p>
              <select className={inputCls()} value={subClass} onChange={(e) => setSubClass(e.target.value)}>
                {db.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select className={inputCls()} value={subCode} onChange={(e) => setSubCode(e.target.value)}>
                {Object.entries(SUBJECT_META).map(([code, m]) => <option key={code} value={code}>{m.name}</option>)}
              </select>
              <button
                type="button" {...btnPrimary()}
                onClick={async () => {
                  const meta = SUBJECT_META[subCode];
                  try {
                    await mutate('/subjects', 'POST', { classId: subClass, name: meta.name, code: meta.code, color: meta.color });
                  } catch (e) {
                    alert((e as Error).message);
                  }
                }}
              >
                + Add Subject
              </button>
            </Card>
          </div>

          <Card className="p-6">
            <p className="mb-4 font-bold text-slate-800">Classes & Subjects</p>
            <div className="space-y-4">
              {db.classes.map((c) => (
                <div key={c.id} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-800">{c.name} <span className="text-sm font-normal text-slate-500">— {c.nameBn}</span></p>
                    <button
                      onClick={() => mutate(`/classes/${c.id}`, 'DELETE').catch((e) => alert(e.message))}
                      className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {db.subjects.filter((s) => s.classId === c.id).map((s) => (
                      <span key={s.id} className={`rounded-lg bg-gradient-to-r ${s.color} px-3 py-1 text-xs font-semibold text-white`}>
                        {s.name}
                        <button className="ml-2 font-bold opacity-80" onClick={() => mutate(`/subjects/${s.id}`, 'DELETE').catch((e) => alert(e.message))}>×</button>
                      </span>
                    ))}
                    {db.subjects.filter((s) => s.classId === c.id).length === 0 && <span className="text-xs text-slate-400">কোনো subject নেই</span>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 'notices' && (
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <Card className="space-y-3 p-6">
            <p className="font-bold text-slate-800">নতুন Notice দিন</p>
            <input className={inputCls()} placeholder="Notice Title" value={nTitle} onChange={(e) => setNTitle(e.target.value)} />
            <textarea className={inputCls()} rows={5} placeholder="বিস্তারিত…" value={nBody} onChange={(e) => setNBody(e.target.value)} />
            <button
              type="button" {...btnPrimary()}
              onClick={async () => {
                if (!nTitle.trim()) return;
                try {
                  await mutate('/notices', 'POST', { title: nTitle.trim(), body: nBody.trim() });
                  setNTitle(''); setNBody('');
                } catch (e) {
                  alert((e as Error).message);
                }
              }}
            >
              + Publish Notice
            </button>
          </Card>

          <div className="space-y-3">
            {[...db.notices].sort((a, b) => b.date.localeCompare(a.date)).map((n) => (
              <Card key={n.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-800">{n.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{n.body}</p>
                    <p className="mt-2 text-xs text-slate-400">{new Date(n.date).toLocaleDateString('bn-BD')}</p>
                  </div>
                  <button
                    onClick={() => mutate(`/notices/${n.id}`, 'DELETE').catch((e) => alert(e.message))}
                    className="shrink-0 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100"
                  >
                    Delete
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
