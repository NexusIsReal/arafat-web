import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const DB_PATH = path.join(dataDir, 'elearning.db');

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  designation TEXT,
  subject TEXT,
  class_id TEXT,
  roll TEXT
);

CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_bn TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  color TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS chapters (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  mcq_title TEXT NOT NULL DEFAULT '',
  mcq_duration_min INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS lectures (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS practice_questions (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mcq_questions (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT NOT NULL,
  correct_index INTEGER NOT NULL,
  explanation TEXT
);

CREATE TABLE IF NOT EXISTS weekly_exams (
  id TEXT PRIMARY KEY,
  week_no INTEGER NOT NULL,
  title TEXT NOT NULL,
  duration_min INTEGER NOT NULL,
  questions TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS results (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  ref_id TEXT NOT NULL,
  title TEXT NOT NULL,
  total INTEGER NOT NULL,
  obtained INTEGER NOT NULL,
  correct INTEGER NOT NULL,
  wrong INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  answers TEXT NOT NULL DEFAULT '[]',
  date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS notices (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  date TEXT NOT NULL
);
`);

export const DB_FILE = DB_PATH;
