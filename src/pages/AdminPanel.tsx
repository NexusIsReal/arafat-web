import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SUBJECT_META } from '../data/meta';
import { Card, SectionTitle, TabButton, Badge, inputCls, btnPrimary, btnGhost, btnDanger, Stat, fmtDate, Modal, ConfirmDialog, useToast } from '../components/ui';
import type { User } from '../types';

interface EditUser extends User {
  newPassword: string;
}

export default function AdminPanel() {
  const { db, mutate, user } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState<'overview' | 'students' | 'teachers' | 'classes' | 'content' | 'results' | 'notices'>('overview');

  // student form
  const [sName, setSName] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [sClass, setSClass] = useState('cls9');
  const [sRoll, setSRoll] = useState('');
  // teacher form
  const [tName, setTName] = useState('');
  const [tEmail, setTEmail] = useState('');
  const [tSubject, setTSubject] = useState('');
  const [tDesignation, setTDesignation] = useState('');
  const [tPhoto, setTPhoto] = useState('');
  // class/subject form
  const [cName, setCName] = useState('');
  const [cNameBn, setCNameBn] = useState('');
  const [subClass, setSubClass] = useState('cls9');
  const [subCode, setSubCode] = useState('phy');
  // notice form
  const [nTitle, setNTitle] = useState('');
  const [nBody, setNBody] = useState('');
  // edit user (modal)
  const [editUser, setEditUser] = useState<EditUser | null>(null);
  // edit notice (modal)
  const [editNotice, setEditNotice] = useState<{ id: string; title: string; body: string } | null>(null);
  // confirm dialog
  const [confirmState, setConfirmState] = useState<{ title: string; message: string; action: () => void } | null>(null);
  // chapter management
  const [chSubject, setChSubject] = useState('cls9_ban1');
  const [chName, setChName] = useState('');
  // content management
  const [ctSubject, setCtSubject] = useState('cls9_ban1');
  const [ctChapter, setCtChapter] = useState('');

  const students = db.users.filter((u) => u.role === 'student');
  const teachers = db.users.filter((u) => u.role === 'teacher');

  const openEdit = (u: User) => setEditUser({ ...u, newPassword: '' });
  const saveEdit = async () => {
    if (!editUser) return;
    try {
      await mutate(`/users/${editUser.id}`, 'PUT', {
        name: editUser.name,
        email: editUser.email,
        classId: editUser.classId ?? null,
        roll: editUser.roll ?? null,
        password: editUser.newPassword || undefined,
        subject: editUser.subject ?? null,
        photoUrl: editUser.photoUrl?.trim() || null,
      });
      setEditUser(null);
      toast('success', 'User সফলভাবে আপডেট হয়েছে ✓');
    } catch (e) {
      toast('error', (e as Error).message);
    }
  };

  const askDelete = (title: string, message: string, action: () => void) => setConfirmState({ title, message, action });

  const chaptersOf = (subjectId: string) =>
    db.chapters.filter((c) => c.subjectId === subjectId).sort((a, b) => a.order - b.order);
  const ctChapters = chaptersOf(ctSubject);
  const ctChapterObj = db.chapters.find((c) => c.id === ctChapter);

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
        <TabButton active={tab === 'classes'} onClick={() => setTab('classes')}>Class · Subject · Chapter</TabButton>
        <TabButton active={tab === 'content'} onClick={() => setTab('content')}>Content Management</TabButton>
        <TabButton active={tab === 'results'} onClick={() => setTab('results')}>Result Management</TabButton>
        <TabButton active={tab === 'notices'} onClick={() => setTab('notices')}>Notice Management</TabButton>
      </div>

      {/* Edit user modal */}
      <Modal open={!!editUser} onClose={() => setEditUser(null)}>
        {editUser && (
          <Card className="space-y-3 p-6">
            <p className="text-lg font-bold text-slate-900">
              Edit {editUser.role === 'student' ? 'Student' : 'Teacher'} — {editUser.name}
            </p>
            <input className={inputCls()} placeholder="Name" value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} />
            <input className={inputCls()} placeholder="Email" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} />
            {editUser.role === 'student' ? (
              <div className="grid grid-cols-2 gap-3">
                <select className={inputCls()} value={editUser.classId ?? ''} onChange={(e) => setEditUser({ ...editUser, classId: e.target.value })}>
                  {db.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input className={inputCls()} placeholder="Roll" value={editUser.roll ?? ''} onChange={(e) => setEditUser({ ...editUser, roll: e.target.value })} />
              </div>
            ) : (
              <input className={inputCls()} placeholder="Subject" value={editUser.subject ?? ''} onChange={(e) => setEditUser({ ...editUser, subject: e.target.value })} />
            )}
            <input className={inputCls()} type="text" placeholder="নতুন Password (খালি রাখলে অপরিবর্তিত থাকবে)" value={editUser.newPassword} onChange={(e) => setEditUser({ ...editUser, newPassword: e.target.value })} />
            {editUser.role === 'teacher' && (
              <div>
                <input className={inputCls()} type="url" placeholder="Photo URL (ছবির লিংক — ঐচ্ছিক)" value={editUser.photoUrl ?? ''} onChange={(e) => setEditUser({ ...editUser, photoUrl: e.target.value })} />
                <p className="mt-1 text-xs text-slate-400">ছবির অনলাইন লিংক (https://…) দিলে Homepage-এর Teachers সেকশনে দেখা যাবে।</p>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setEditUser(null)} {...btnGhost()}>Cancel</button>
              <button onClick={saveEdit} {...btnPrimary()}>Save Changes</button>
            </div>
          </Card>
        )}
      </Modal>

      {/* Edit notice modal */}
      <Modal open={!!editNotice} onClose={() => setEditNotice(null)}>
        {editNotice && (
          <Card className="space-y-3 p-6">
            <p className="text-lg font-bold text-slate-900">Edit Notice</p>
            <input className={inputCls()} placeholder="Notice Title" value={editNotice.title} onChange={(e) => setEditNotice({ ...editNotice, title: e.target.value })} />
            <textarea className={inputCls()} rows={5} placeholder="বিস্তারিত…" value={editNotice.body} onChange={(e) => setEditNotice({ ...editNotice, body: e.target.value })} />
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setEditNotice(null)} {...btnGhost()}>Cancel</button>
              <button
                onClick={async () => {
                  try {
                    await mutate(`/notices/${editNotice.id}`, 'PUT', { title: editNotice.title, body: editNotice.body });
                    setEditNotice(null);
                    toast('success', 'Notice সফলভাবে আপডেট হয়েছে ✓');
                  } catch (e) {
                    toast('error', (e as Error).message);
                  }
                }}
                {...btnPrimary()}
              >
                Save Changes
              </button>
            </div>
          </Card>
        )}
      </Modal>

      {/* Confirm dialog */}
      <ConfirmDialog
        open={!!confirmState}
        onClose={() => setConfirmState(null)}
        onConfirm={() => confirmState?.action()}
        title={confirmState?.title ?? ''}
        message={confirmState?.message ?? ''}
      />

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
                  toast('success', `${sName.trim()} যোগ হয়েছে ✓ (Password: demo123)`);
                } catch (e) {
                  toast('error', (e as Error).message);
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
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(s)}
                          className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 transition hover:bg-indigo-100 active:scale-95"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => askDelete('Student মুছবেন?', `"${s.name}" এর সব ফলাফলসহ একাউন্ট মুছে যাবে। এটি ফেরানো যাবে না।`, () => mutate(`/users/${s.id}`, 'DELETE').catch((e) => toast('error', e.message)))}
                          className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100 active:scale-95"
                        >
                          Delete
                        </button>
                      </div>
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
            <input className={inputCls()} placeholder="Designation (যেমন: সহকারী শিক্ষক)" value={tDesignation} onChange={(e) => setTDesignation(e.target.value)} />
            <input className={inputCls()} type="url" placeholder="Photo URL (ছবির লিংক — ঐচ্ছিক)" value={tPhoto} onChange={(e) => setTPhoto(e.target.value)} />
            <select className={inputCls()} value={tSubject} onChange={(e) => setTSubject(e.target.value)}>
              <option value="">Subject (optional)…</option>
              {Object.entries(SUBJECT_META).map(([code, m]) => <option key={code} value={m.name}>{m.name}</option>)}
            </select>
            <button
              type="button" {...btnPrimary()}
              onClick={async () => {
                if (!tName.trim() || !tEmail.trim()) return;
                try {
                  await mutate('/users', 'POST', { name: tName.trim(), email: tEmail.trim(), password: 'demo123', role: 'teacher', designation: tDesignation.trim() || 'সহকারী শিক্ষক', subject: tSubject || undefined, photoUrl: tPhoto.trim() || undefined });
                  setTName(''); setTEmail(''); setTSubject(''); setTPhoto(''); setTDesignation('');
                  toast('success', `${tName.trim()} যোগ হয়েছে ✓ (Password: demo123)`);
                } catch (e) {
                  toast('error', (e as Error).message);
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
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(t)}
                          className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 transition hover:bg-indigo-100 active:scale-95"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => askDelete('Teacher মুছবেন?', `"${t.name}" এর একাউন্ট মুছে যাবে। এটি ফেরানো যাবে না।`, () => mutate(`/users/${t.id}`, 'DELETE').catch((e) => toast('error', e.message)))}
                          className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100 active:scale-95"
                        >
                          Delete
                        </button>
                      </div>
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
                    toast('success', 'Class যোগ হয়েছে ✓');
                  } catch (e) {
                    toast('error', (e as Error).message);
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
                    toast('success', `${meta.name} যোগ হয়েছে ✓`);
                  } catch (e) {
                    toast('error', (e as Error).message);
                  }
                }}
              >
                + Add Subject
              </button>
            </Card>

            <Card className="space-y-3 p-6">
              <p className="font-bold text-slate-800">নতুন Chapter যোগ করুন</p>
              <select className={inputCls()} value={chSubject} onChange={(e) => setChSubject(e.target.value)}>
                {db.classes.map((c) => (
                  <optgroup key={c.id} label={c.name}>
                    {db.subjects.filter((s) => s.classId === c.id).map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <input className={inputCls()} placeholder="Chapter Name (যেমন: আলোর প্রতিফলন)" value={chName} onChange={(e) => setChName(e.target.value)} />
              <button
                type="button" {...btnPrimary()}
                onClick={async () => {
                  if (!chName.trim()) return;
                  try {
                    await mutate(`/subjects/${chSubject}/chapters`, 'POST', { name: chName.trim() });
                    setChName('');
                    toast('success', 'Chapter যোগ হয়েছে ✓');
                  } catch (e) {
                    toast('error', (e as Error).message);
                  }
                }}
              >
                + Add Chapter
              </button>
              <p className="text-xs text-slate-400">নতুন Chapter-এ স্বয়ংক্রিয়ভাবে একটি Default Note যোগ হবে। MCQ যোগ করতে Teacher Panel → MCQ Builder ব্যবহার করুন।</p>
            </Card>
          </div>

          <Card className="p-6">
            <p className="mb-4 font-bold text-slate-800">Classes · Subjects · Chapters</p>
            <div className="space-y-4">
              {db.classes.map((c) => (
                <div key={c.id} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-800">{c.name} <span className="text-sm font-normal text-slate-500">— {c.nameBn}</span></p>
                    <button
                      onClick={() => askDelete('Class মুছবেন?', `"${c.name}" এবং এর সব Subject, Chapter ও Content মুছে যাবে।`, () => mutate(`/classes/${c.id}`, 'DELETE').catch((e) => toast('error', e.message)))}
                      className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100 active:scale-95"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {db.subjects.filter((s) => s.classId === c.id).map((s) => (
                      <span key={s.id} className={`rounded-lg bg-gradient-to-r ${s.color} px-3 py-1 text-xs font-semibold text-white`}>
                        {s.name}
                        <button
                          className="ml-2 font-bold opacity-80 hover:opacity-100"
                          onClick={() => askDelete('Subject মুছবেন?', `"${s.name}" এবং এর সব Chapter ও Content মুছে যাবে।`, () => mutate(`/subjects/${s.id}`, 'DELETE').catch((e) => toast('error', e.message)))}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {db.subjects.filter((s) => s.classId === c.id).length === 0 && <span className="text-xs text-slate-400">কোনো subject নেই</span>}
                  </div>
                  {db.subjects.filter((s) => s.classId === c.id).map((s) => {
                    const chs = chaptersOf(s.id);
                    if (!chs.length) return null;
                    return (
                      <div key={s.id} className="mt-3 border-t border-slate-200 pt-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{s.code} Chapters</p>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {chs.map((ch) => (
                            <span key={ch.id} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                              {ch.order}. {ch.name}
                              <button
                                title="Delete chapter"
                                onClick={() => askDelete('Chapter মুছবেন?', `"${ch.name}" অধ্যায় ও এর সব Lecture, Notes, Practice, MCQ মুছে যাবে।`, () => mutate(`/chapters/${ch.id}`, 'DELETE').catch((e) => toast('error', e.message)))}
                                className="font-bold text-rose-500 hover:text-rose-700"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 'content' && (
        <Card className="space-y-4 p-6">
          <p className="font-bold text-slate-800">Content Management — Lecture / Notes / Practice দেখুন ও মুছুন</p>
          <p className="text-xs text-slate-400">নতুন Content যোগ করতে Navbar → Teacher Panel ব্যবহার করুন। এখানে বিদ্যমান Content ম্যানেজ করা যায়।</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <select className={inputCls()} value={ctSubject} onChange={(e) => { setCtSubject(e.target.value); setCtChapter(''); }}>
              {db.classes.map((c) => (
                <optgroup key={c.id} label={c.name}>
                  {db.subjects.filter((s) => s.classId === c.id).map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <select className={inputCls()} value={ctChapter} onChange={(e) => setCtChapter(e.target.value)}>
              <option value="">Select Chapter…</option>
              {ctChapters.map((ch) => <option key={ch.id} value={ch.id}>Ch {ch.order}: {ch.name}</option>)}
            </select>
          </div>

          {ctChapterObj ? (
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <p className="mb-2 text-sm font-bold text-slate-700">Lectures ({ctChapterObj.lectures.length})</p>
                <div className="space-y-2">
                  {ctChapterObj.lectures.map((l) => (
                    <div key={l.id} className="flex items-center justify-between gap-2 rounded-lg bg-white p-2.5 text-xs ring-1 ring-slate-200">
                      <span className="font-medium text-slate-700">{l.title}</span>
                      <button onClick={() => askDelete('Lecture মুছবেন?', `"${l.title}" মুছে যাবে।`, () => mutate(`/lectures/${l.id}`, 'DELETE').catch((e) => toast('error', e.message)))} className="shrink-0 font-bold text-rose-500 hover:text-rose-700">×</button>
                    </div>
                  ))}
                  {!ctChapterObj.lectures.length && <p className="text-xs text-slate-400">কোনো lecture নেই</p>}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <p className="mb-2 text-sm font-bold text-slate-700">Notes ({ctChapterObj.notes.length})</p>
                <div className="space-y-2">
                  {ctChapterObj.notes.map((n) => (
                    <div key={n.id} className="flex items-center justify-between gap-2 rounded-lg bg-white p-2.5 text-xs ring-1 ring-slate-200">
                      <span className="font-medium text-slate-700">{n.title}</span>
                      <button onClick={() => askDelete('Notes মুছবেন?', `"${n.title}" মুছে যাবে।`, () => mutate(`/notes/${n.id}`, 'DELETE').catch((e) => toast('error', e.message)))} className="shrink-0 font-bold text-rose-500 hover:text-rose-700">×</button>
                    </div>
                  ))}
                  {!ctChapterObj.notes.length && <p className="text-xs text-slate-400">কোনো note নেই</p>}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <p className="mb-2 text-sm font-bold text-slate-700">Practice ({ctChapterObj.practice.length})</p>
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {ctChapterObj.practice.map((p) => (
                    <div key={p.id} className="flex items-start justify-between gap-2 rounded-lg bg-white p-2.5 text-xs ring-1 ring-slate-200">
                      <span className="font-medium text-slate-700">{p.question.slice(0, 60)}{p.question.length > 60 ? '…' : ''}</span>
                      <button onClick={() => askDelete('Practice মুছবেন?', 'এই প্রশ্নটি মুছে যাবে।', () => mutate(`/practice/${p.id}`, 'DELETE').catch((e) => toast('error', e.message)))} className="shrink-0 font-bold text-rose-500 hover:text-rose-700">×</button>
                    </div>
                  ))}
                  {!ctChapterObj.practice.length && <p className="text-xs text-slate-400">কোনো practice নেই</p>}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Subject ও Chapter নির্বাচন করুন।</p>
          )}
        </Card>
      )}

      {tab === 'results' && (
        <Card className="overflow-x-auto">
          <div className="flex flex-wrap items-center justify-between gap-3 p-5">
            <p className="font-bold text-slate-800">সকল ফলাফল ({db.results.length})</p>
            <p className="text-xs text-slate-400">Student-এর ভুল এন্ট্রি মুছতে Delete ব্যবহার করুন</p>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Exam</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Marks</th>
                <th className="px-5 py-3 text-right">Score</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...db.results].sort((a, b) => b.date.localeCompare(a.date)).map((r) => {
                const stu = db.users.find((u) => u.id === r.userId);
                return (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-800">{stu?.name ?? 'Unknown'}</p>
                      <p className="text-xs text-slate-400">Roll {stu?.roll ?? '—'}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{r.title}</td>
                    <td className="px-5 py-3"><Badge tone="slate">{r.type === 'weekly' ? 'Weekly' : 'Chapter'}</Badge></td>
                    <td className="px-5 py-3 text-slate-500">{fmtDate(r.date)}</td>
                    <td className="px-5 py-3 text-right font-semibold text-slate-700">{r.obtained}/{r.total}</td>
                    <td className="px-5 py-3 text-right">
                      <Badge tone={r.percentage >= 80 ? 'green' : r.percentage >= 40 ? 'indigo' : 'red'}>{r.percentage}%</Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => askDelete('Result মুছবেন?', `${stu?.name ?? 'Student'}-এর "${r.title}" ফলাফল মুছে যাবে।`, () => mutate(`/results/${r.id}`, 'DELETE').catch((e) => toast('error', e.message)))}
                        className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100 active:scale-95"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {db.results.length === 0 && <p className="p-8 text-center text-sm text-slate-500">এখনো কোনো ফলাফল নেই।</p>}
        </Card>
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
                  toast('success', 'Notice প্রকাশিত হয়েছে ✓');
                } catch (e) {
                  toast('error', (e as Error).message);
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
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => setEditNotice({ id: n.id, title: n.title, body: n.body })}
                      className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 transition hover:bg-indigo-100 active:scale-95"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => askDelete('Notice মুছবেন?', `"${n.title}" স্কুলের Homepage থেকেও সরে যাবে।`, () => mutate(`/notices/${n.id}`, 'DELETE').catch((e) => toast('error', e.message)))}
                      className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100 active:scale-95"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
