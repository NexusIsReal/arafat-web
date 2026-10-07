export type Role = 'student' | 'teacher' | 'admin';

export interface SchoolInfo {
  name: string;
  nameEn: string;
  address: string;
  phone: string;
  email: string;
  eiin: string;
  facebook?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  designation?: string;
  subject?: string;
  classId?: string;
  roll?: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  nameBn: string;
}

export interface Subject {
  id: string;
  classId: string;
  name: string;
  code: string;
  color: string;
}

export interface Lecture {
  id: string;
  chapterId: string;
  title: string;
  videoUrl: string;
  description?: string;
}

export interface NoteItem {
  id: string;
  chapterId: string;
  title: string;
  content: string;
}

export interface PracticeQuestion {
  id: string;
  chapterId: string;
  question: string;
  answer: string;
}

export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  name: string;
  order: number;
  lectures: Lecture[];
  notes: NoteItem[];
  practice: PracticeQuestion[];
  mcq: {
    title: string;
    durationMin: number;
    questions: MCQ[];
  };
}

export interface AnswerSnapshot {
  question: string;
  options: string[];
  correctIndex: number;
  selected: number | null;
  explanation?: string;
}

export interface ExamResult {
  id: string;
  userId: string;
  type: 'chapter' | 'weekly';
  refId: string;
  title: string;
  total: number;
  obtained: number;
  correct: number;
  wrong: number;
  percentage: number;
  answers: AnswerSnapshot[];
  date: string;
}

export interface WeeklyExam {
  id: string;
  weekNo: number;
  title: string;
  durationMin: number;
  questions: MCQ[];
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  date: string;
}

export interface Comment {
  id: string;
  lectureId: string;
  userId: string;
  body: string;
  date: string;
}

export interface DB {
  school: SchoolInfo;
  users: User[];
  classes: SchoolClass[];
  subjects: Subject[];
  chapters: Chapter[];
  weeklyExams: WeeklyExam[];
  results: ExamResult[];
  notices: Notice[];
  comments: Comment[];
}
