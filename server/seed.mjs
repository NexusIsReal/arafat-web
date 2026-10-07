import { db } from './db.mjs';
import { CH678 } from './chapters678.mjs';
import { BAN_ENG_CONTENT } from './chapters910-lang.mjs';
import { SCI_CONTENT } from './chapters910-sci.mjs';

const DEMO_VIDEO = 'https://www.youtube.com/embed/ZM8ECpBuQYE';

const SUBJECT_META = {
  ban1: { name: 'বাংলা ১ম পত্র (Bangla 1st Paper)', code: 'BAN1', color: 'from-red-500 to-rose-400' },
  ban2: { name: 'বাংলা ২য় পত্র (Bangla 2nd Paper)', code: 'BAN2', color: 'from-rose-500 to-pink-400' },
  eng1: { name: 'English 1st Paper', code: 'ENG1', color: 'from-sky-500 to-blue-400' },
  eng2: { name: 'English 2nd Paper', code: 'ENG2', color: 'from-indigo-500 to-violet-400' },
  phy: { name: 'পদার্থবিজ্ঞান (Physics)', code: 'PHY', color: 'from-blue-500 to-cyan-400' },
  chem: { name: 'রসায়ন (Chemistry)', code: 'CHEM', color: 'from-emerald-500 to-teal-400' },
  bio: { name: 'জীববিজ্ঞান (Biology)', code: 'BIO', color: 'from-green-500 to-lime-400' },
  math: { name: 'গণিত (Mathematics)', code: 'MATH', color: 'from-violet-500 to-purple-400' },
  ict: { name: 'ICT', code: 'ICT', color: 'from-orange-500 to-amber-400' },
  sci: { name: 'বিজ্ঞান (Science)', code: 'SCI', color: 'from-teal-500 to-cyan-400' },
  bgs: { name: 'বাংলাদেশ ও বিশ্বপরিচয় (BGS)', code: 'BGS', color: 'from-amber-500 to-yellow-400' },
  rel: { name: 'ধর্ম ও নৈতিক শিক্ষা (Religion)', code: 'REL', color: 'from-lime-500 to-green-400' },
  him: { name: 'উচ্চতর গণিত (Higher Math)', code: 'HIM', color: 'from-fuchsia-500 to-purple-400' },
};

const CLASSES = [
  { id: 'cls6', name: 'Class 6', nameBn: 'ষষ্ঠ শ্রেণি' },
  { id: 'cls7', name: 'Class 7', nameBn: 'সপ্তম শ্রেণি' },
  { id: 'cls8', name: 'Class 8', nameBn: 'অষ্টম শ্রেণি' },
  { id: 'cls9', name: 'Class 9', nameBn: 'নবম শ্রেণি' },
  { id: 'cls10', name: 'Class 10', nameBn: 'দশম শ্রেণি' },
];

const CLASS_SUBJECTS = {
  cls6: ['ban1', 'ban2', 'sci', 'math', 'ict', 'eng1', 'eng2', 'bgs', 'rel'],
  cls7: ['ban1', 'ban2', 'sci', 'math', 'ict', 'eng1', 'eng2', 'bgs', 'rel'],
  cls8: ['ban1', 'ban2', 'sci', 'math', 'ict', 'eng1', 'eng2', 'bgs', 'rel'],
  cls9: ['ban1', 'ban2', 'phy', 'chem', 'bio', 'math', 'ict', 'eng1', 'eng2', 'bgs', 'rel', 'him'],
  cls10: ['ban1', 'ban2', 'phy', 'chem', 'bio', 'math', 'ict', 'eng1', 'eng2', 'bgs', 'rel', 'him'],
};

const CHAPTERS = {
  // Class 6-8
  cls6_ban1: ['অনুচ্ছেদ ও রচনা', 'ব্যাকরণ: পদ প্রকরণ', 'সাহিত্য: কবিতা পাঠ'],
  cls7_ban1: ['গদ্য: শিক্ষামূলক প্রবন্ধ', 'ব্যাকরণ: কারক ও বিভক্তি', 'কবিতা পাঠ'],
  cls8_ban1: ['গদ্য: জাতীয় জীবনে বিজ্ঞান', 'ব্যাকরণ: সমাস', 'সাহিত্যপাঠ: গল্প'],
  cls6_ban2: ['রচনা ও সারমর্ম', 'বাগ্ধারা ও প্রবাদ', 'আবেদন পত্র ও প্রয়োগ-ভাষা'],
  cls7_ban2: ['রচনা ও সারমর্ম', 'বাগ্ধারা ও প্রবাদ', 'আবেদন পত্র ও প্রয়োগ-ভাষা'],
  cls8_ban2: ['রচনা ও সারমর্ম', 'বাগ্ধারা ও প্রবাদ', 'আবেদন পত্র ও প্রয়োগ-ভাষা'],
  cls6_sci: ['আমাদের জীবনে বিজ্ঞান', 'কোষ ও জীবের গঠন', 'শক্তির রূপ পরিবর্তন'],
  cls7_sci: ['জীবের বৃদ্ধি ও বংশগতি', 'আমাদের শরীরের অন্তর্গঠন', 'সবুজ উদ্ভিদের খাদ্য উৎপাদন'],
  cls8_sci: ['জীবনের একক কোষ', 'আলো ও প্রতিসরণ', 'শক্তির উৎস ও ব্যবহার'],
  cls6_math: ['সংখ্যা ও পরিমাপ', 'পাটিগণিত ও অনুপাত', 'জ্যামিতিক চিত্র'],
  cls7_math: ['পূর্ণসংখ্যা', 'সেট', 'রাশিমালা ও সূচক'],
  cls8_math: ['প্যাটার্ন ও সেট', 'বীজগাণিতিক রাশি', 'চতুর্ভুজ'],
  cls6_ict: ['তথ্য ও যোগাযোগ প্রযুক্তি পরিচিতি', 'কম্পিউটারের ব্যবহার', 'ইন্টারনেট ও নিরাপত্তা'],
  cls7_ict: ['কম্পিউটার ও অপারেটিং সিস্টেম', 'ওয়ার্ড প্রসেসিং', 'ডেটা ও তথ্য'],
  cls8_ict: ['কম্পিউটার নেটওয়ার্ক', 'স্প্রেডশিট ব্যবহার', 'ইমেইল ও ক্লাউড'],
  cls6_eng1: ['Unit 1: Greetings & Introduction', 'Unit 2: My Family', 'Vocabulary & Reading'],
  cls7_eng1: ['Unit 1: Attention Please', 'Unit 2: My Study Guide', 'Vocabulary & Reading'],
  cls8_eng1: ['Unit 1: Father of the Nation', 'Unit 2: Food and Nutrition', 'Vocabulary & Reading'],
  cls6_eng2: ['Grammar: Articles & Prepositions', 'Tense Basics', 'Writing: Paragraph'],
  cls7_eng2: ['Grammar: Articles & Prepositions', 'Tense Basics', 'Writing: Paragraph'],
  cls8_eng2: ['Grammar: Articles & Prepositions', 'Tense Basics', 'Writing: Paragraph'],
  cls6_bgs: ['আমাদের স্বাধীনতা যুদ্ধ', 'বাংলাদেশের ভূগোল ও জনসংখ্যা', 'সংবিধান ও নাগরিকত্ব'],
  cls7_bgs: ['আমাদের স্বাধীনতা যুদ্ধ', 'বাংলাদেশের ভূগোল ও জনসংখ্যা', 'সংবিধান ও নাগরিকত্ব'],
  cls8_bgs: ['আমাদের স্বাধীনতা যুদ্ধ', 'বাংলাদেশের ভূগোল ও জনসংখ্যা', 'সংবিধান ও নাগরিকত্ব'],
  cls6_rel: ['নৈতিকতা ও মূল্যবোধ', 'ধর্মগ্রন্থের শিক্ষা', 'সহনশীলতা ও সমাজসেবা'],
  cls7_rel: ['নৈতিকতা ও মূল্যবোধ', 'ধর্মগ্রন্থের শিক্ষা', 'সহনশীলতা ও সমাজসেবা'],
  cls8_rel: ['নৈতিকতা ও মূল্যবোধ', 'ধর্মগ্রন্থের শিক্ষা', 'সহনশীলতা ও সমাজসেবা'],
  // Class 9-10
  cls9_ban1: ['সাহিত্যপাঠ: গল্প ও কবিতা', 'গদ্য: প্রবন্ধ ও নাটক', 'ব্যাকরণ: সমাস ও কারক'],
  cls10_ban1: ['সাহিত্যপাঠ: গল্প ও কবিতা', 'গদ্য: প্রবন্ধ ও নাটক', 'ব্যাকরণ: সমাস ও কারক'],
  cls9_ban2: ['রচনা, সারমর্ম ও প্রয়োগ-ভাষা', 'বানান, বাগ্ধারা ও প্রবাদ', 'নির্মিতি'],
  cls10_ban2: ['রচনা, সারমর্ম ও প্রয়োগ-ভাষা', 'বানান, বাগ্ধারা ও প্রবাদ', 'নির্মিতি'],
  cls9_phy: ['গতি (Motion)', 'গতির পরিবর্তন ও বল', 'কাজ, শক্তি ও ক্ষমতা', 'আলোর প্রতিসরণ'],
  cls10_phy: ['বৈদ্যুতিক স্রোত', 'আলোর প্রতিফলন ও দর্পণ', 'চৌম্বক প্রভাব ও তড়িৎক্রম', 'আধুনিক পদার্থবিজ্ঞান ও ইলেকট্রনিক্স'],
  cls9_chem: ['পদার্থের অবস্থা', 'পরমাণুর গঠন', 'পর্যায় সারণি ও রাসায়নিক বন্ধন', 'রাসায়নিক বিক্রিয়া'],
  cls10_chem: ['রাসায়নিক বিক্রিয়া', 'মোলের ধারণা ও রাসায়নিক গণনা', 'অ্যাসিড-ক্ষারক সমতা', 'খনিজ সম্পদ: জীবাশ্ম'],
  cls9_bio: ['জীবন পাঠ', 'কোষ ও কোষ বিভাজন', 'টিস্যু ও টিস্যুতন্ত্র', 'খাদ্য, পুষ্টি ও পরিপাক'],
  cls10_bio: ['জীবন নিয়ন্ত্রণ', 'বংশগতি', 'জীবের পরিবেশ', 'জীবপ্রযুক্তি'],
  cls9_math: ['সেট ও ফাংশন', 'বীজগাণিতিক রাশি', 'সূচক ও লগারিদম', 'ত্রিকোণমিতি'],
  cls10_math: ['অসীম ধারা', 'বৃত্ত', 'ত্রিকোণমিতিক অনুপাত', 'সূচক ও লগারিদম'],
  cls9_ict: ['তথ্য ও যোগাযোগ প্রযুক্তি: বিশ্ব ও বাংলাদেশ', 'কম্পিউটার ও কম্পিউটার ব্যবহার', 'ইন্টারনেট ও ওয়েবসাইট'],
  cls10_ict: ['গ্লোবাল ভিলেজ', 'কম্পিউটার নেটওয়ার্ক ও ইন্টারনেট', 'প্রোগ্রামিংয়ের ভাষা'],
  cls9_eng1: ['Unit 1: Personal Communication', 'Unit 2: Pastimes & Festivals', 'Poem & Literature'],
  cls10_eng1: ['Unit 1: Personal Communication', 'Unit 2: Pastimes & Festivals', 'Poem & Literature'],
  cls9_eng2: ['Reading Comprehension', 'Grammar: Tense, Voice & Narration', 'Writing: Paragraph & Letter'],
  cls10_eng2: ['Reading Comprehension', 'Grammar: Tense, Voice & Narration', 'Writing: Paragraph & Letter'],
  cls9_bgs: ['আমাদের স্বাধীনতা যুদ্ধ', 'বাংলাদেশের ভূগোল ও জনসংখ্যা', 'সংবিধান ও নাগরিকত্ব'],
  cls10_bgs: ['আমাদের স্বাধীনতা যুদ্ধ', 'বাংলাদেশের ভূগোল ও জনসংখ্যা', 'সংবিধান ও নাগরিকত্ব'],
  cls9_rel: ['নৈতিকতা ও মূল্যবোধ', 'ধর্মগ্রন্থের শিক্ষা', 'সহনশীলতা ও সমাজসেবা'],
  cls10_rel: ['নৈতিকতা ও মূল্যবোধ', 'ধর্মগ্রন্থের শিক্ষা', 'সহনশীলতা ও সমাজসেবা'],
  cls9_him: ['সেট ও ফাংশন', 'বহুপদী ও বীজগাণিতিক রাশি', 'ত্রিকোণমিতি'],
  cls10_him: ['স্থানাঙ্ক জ্যামিতি', 'অনুক্রম ও অসীম ধারা', 'সমীকরণ ও অসমতা'],
};

const USERS = [
  { id: 'usr_admin', name: 'মোঃ আব্দুল করিম', email: 'admin@demo.com', password: 'demo123', role: 'admin', designation: 'প্রধান শিক্ষক' },
  { id: 'usr_t1', name: 'Kawsar Sarkar', email: 'teacher@demo.com', password: 'demo123', role: 'teacher', designation: 'সহকারী শিক্ষক', subject: 'ICT' },
  { id: 'usr_t2', name: 'Shuvro Saha', email: 'shuvro@demo.com', password: 'demo123', role: 'teacher', designation: 'সহকারী শিক্ষক', subject: 'ICT' },
  { id: 'usr_t3', name: 'Salam', email: 'salam@demo.com', password: 'demo123', role: 'teacher', designation: 'সহকারী শিক্ষক', subject: 'Religion' },
  { id: 'usr_t4', name: 'Suman Ali', email: 'suman@demo.com', password: 'demo123', role: 'teacher', designation: 'সহকারী শিক্ষক', subject: 'Math' },
  { id: 'usr_t5', name: 'Benedict Gomes', email: 'benedict@demo.com', password: 'demo123', role: 'teacher', designation: 'প্রধান শিক্ষক', subject: 'English' },
  { id: 'usr_s1', name: 'Arafat Rahman', email: 'student@demo.com', password: 'demo123', role: 'student', classId: 'cls9', roll: '01' },
  { id: 'usr_s2', name: 'Kabbo Mahmud', email: 'kabbo@demo.com', password: 'demo123', role: 'student', classId: 'cls9', roll: '02' },
  { id: 'usr_s3', name: 'Saif Khan', email: 'saif@demo.com', password: 'demo123', role: 'student', classId: 'cls9', roll: '03' },
  { id: 'usr_s4', name: 'Fauzia Dina', email: 'fauzia@demo.com', password: 'demo123', role: 'student', classId: 'cls9', roll: '04' },
  { id: 'usr_s5', name: 'Koyel Saha', email: 'koyel@demo.com', password: 'demo123', role: 'student', classId: 'cls9', roll: '05' },
  { id: 'usr_s6', name: 'Jerin Sultana', email: 'jerin@demo.com', password: 'demo123', role: 'student', classId: 'cls9', roll: '06' },
];

const MOTION_MCQS = [
  ['সময়ের সাপেক্ষে বস্তুর অবস্থানের পরিবর্তনকে কী বলে?', ['দ্রুতি', 'গতি', 'ত্বরণ', 'বল'], 1, 'সময়ের সাপেক্ষে অবস্থানের পরিবর্তনই গতি।'],
  ['একক সময়ে অতিক্রান্ত দূরত্বকে কী বলে?', ['বেগ', 'দ্রুতি', 'ত্বরণ', 'সরণ'], 1, 'দ্রুতি = অতিক্রান্ত দূরত্ব ÷ সময়।'],
  ['দ্রুতি একটি —', ['স্কেলার রাশি', 'ভেক্টর রাশি', 'মাত্রাহীন রাশি', 'কোনোটিই নয়'], 0, 'দ্রুতির শুধু মান আছে, দিক নেই — তাই এটি স্কেলার রাশি।'],
  ['বেগ ও দ্রুতির মধ্যে মূল পার্থক্য হলো বেগের —', ['মান আছে, দিক নেই', 'দিক আছে, মান নেই', 'মান ও দিক উভয়ই আছে', 'কোনোটিই নয়'], 2, 'বেগ ভেক্টর রাশি — মান ও দিক উভয়ই থাকে।'],
  ['একক সময়ে বেগের পরিবর্তনকে কী বলে?', ['দ্রুতি', 'ত্বরণ', 'সরণ', 'ভরবেগ'], 1, 'ত্বরণ a = (v − u) / t।'],
  ['একটি বস্তু 5 m/s বেগে 10 সেকেন্ড চললে কত দূরত্ব অতিক্রম করবে?', ['2 m', '15 m', '50 m', '100 m'], 2, 'দূরত্ব = দ্রুতি × সময় = 5 × 10 = 50 m।'],
  ['সমবেগে চলমান বস্তুর ত্বরণ কত?', ['শূন্য', 'ধনাত্মক', 'ঋণাত্মক', 'অসীম'], 0, 'সমবেগে বেগের পরিবর্তন হয় না, তাই ত্বরণ শূন্য।'],
  ['প্রাথমিক বেগ u ও ত্বরণ a হলে t সময় পর বেগ v = ?', ['u + at', 'ut + ½at²', 'u² + 2as', 'u − at'], 0, 'গতির প্রথম সূত্র: v = u + at।'],
  ['s = ut + ½at² সমীকরণে s দ্বারা কী বোঝায়?', ['দ্রুতি', 'সরণ', 'সময়', 'ত্বরণ'], 1, 's হলো t সময়ে অতিক্রান্ত সরণ।'],
  ['বৃত্তাকার পথে সমদ্রুতিতে চললে বস্তুর —', ['বেগ পরিবর্তিত হয়', 'বেগ অপরিবর্তিত থাকে', 'ত্বরণ শূন্য', 'দ্রুতি পরিবর্তিত হয়'], 0, 'বৃত্তাকার পথে দিক পরিবর্তিত হয়, তাই বেগ (ভেক্টর) পরিবর্তিত হয়।'],
  ['নিচের কোনটি ভেক্টর রাশি?', ['দূরত্ব', 'দ্রুতি', 'সরণ', 'সময়'], 2, 'সরণের মান ও দিক উভয়ই আছে — এটি ভেক্টর রাশি।'],
  ['একটি বস্তুর বেগ 20 m/s থেকে 4 সেকেন্ডে 0 হয়ে যায়। ত্বরণ কত?', ['−5 m/s²', '5 m/s²', '−4 m/s²', '80 m/s²'], 0, 'a = (0 − 20) / 4 = −5 m/s² (মন্দন)।'],
  ['মুক্তভাবে পতনশীল বস্তুর ত্বরণ g-এর মান কত?', ['9.8 m/s²', '8.9 m/s²', '10.8 m/s²', '9.8 km/s²'], 0, 'পৃথিবীতে অভিকর্ষজ ত্বরণ g ≈ 9.8 m/s²।'],
  ['গতির কোন সূত্রটি সরণ ও সময়ের সরাসরি সম্পর্ক দেয়?', ['প্রথম সূত্র', 'দ্বিতীয় সূত্র', 'তৃতীয় সূত্র', 'কোনোটিই নয়'], 1, 'দ্বিতীয় সূত্র s = ut + ½at² সরণ ও সময়ের সম্পর্ক দেয়।'],
  ['বৃত্তাকার পথে এক পাক সম্পূর্ণ করলে সরণ কত?', ['2πr', 'πr', 'শূন্য', 'r'], 2, 'এক পাক শেষে বস্তু আগের বিন্দুতে ফিরে আসে, তাই সরণ শূন্য।'],
  ['দূরত্ব-সময় লেখচিত্রের ঢাল কী নির্দেশ করে?', ['ত্বরণ', 'দ্রুতি', 'বেগের পরিবর্তন', 'সরণ'], 1, 'দূরত্ব-সময় লেখচিত্রের ঢাল = দ্রুতি।'],
  ['বেগ-সময় লেখচিত্রের ঢাল কী নির্দেশ করে?', ['দ্রুতি', 'সরণ', 'ত্বরণ', 'দূরত্ব'], 2, 'বেগ-সময় লেখচিত্রের ঢাল = ত্বরণ।'],
  ['u বেগে শুরু করে a ত্বরণে s সরণ অতিক্রম করলে চূড়ান্ত বেগ?', ['v = u + at', 'v² = u² + 2as', 'v = u − at', 'v = as'], 1, 'গতির তৃতীয় সূত্র: v² = u² + 2as।'],
  ['নিচের কোনটি সমত্বরণের উদাহরণ?', ['মুক্ত পতন', 'সমবেগে গতি', 'বৃত্তাকার গতি', 'স্থির অবস্থা'], 0, 'মুক্ত পতনে ধ্রুব ত্বরণ g কাজ করে।'],
  ['ত্বরণের SI একক কোনটি?', ['m/s', 'm/s²', 'm²/s', 'm·s'], 1, 'ত্বরণ = বেগ/সময়, তাই একক m/s²।'],
];

const MOTION_NOTES = [
  ['গতি — মূল ধারণা', `• গতি: সময়ের সাপেক্ষে বস্তুর অবস্থানের পরিবর্তন।\n• দূরত্ব: বস্তু প্রকৃত পথে যতটুকু পথ অতিক্রম করে। (স্কেলার)\n• সরণ: আদি ও ন বিন্দুর মধ্যে সংক্ষিপ্ততম সরলরেখার দৈর্ঘ্য, দিকসহ। (ভেক্টর)\n• দ্রুতি: একক সময়ে অতিক্রান্ত দূরত্ব। (স্কেলার)\n• বেগ: একক সময়ে সরণের পরিবর্তন। (ভেক্টর)\n• ত্বরণ: একক সময়ে বেগের পরিবর্তন। a = (v − u)/t\n\nমনে রাখো: দূরত্ব ≥ সরণ সবসময়। বৃত্তাকার গতিতে দ্রুতি ধ্রুব থাকলেও বেগ পরিবর্তিত হয়।`],
  ['গতির সূত্রসমূহ', `সমত্বরণে চলমান বস্তুর জন্য তিনটি মূল সূত্র:\n\n১) v = u + at  → চূড়ান্ত বেগ নির্ণয়ে\n২) s = ut + ½at²  → সরণ ও সময় জানা থাকলে\n৩) v² = u² + 2as  → সময় না জানা থাকলে\n\nএখানে, u = প্রাথমিক বেগ, v = চূড়ান্ত বেগ, a = ত্বরণ, t = সময়, s = সরণ।\n\nলেখচিত্র:\n• দূরত্ব-সময় লেখচিত্রের ঢাল = দ্রুতি\n• বেগ-সময় লেখচিত্রের ঢাল = ত্বরণ\n• বেগ-সময় লেখচিত্রের নিচের ক্ষেত্রফল = সরণ`],
];

const MOTION_PRACTICE = [
  ['গতি কাকে বলে? উদাহরণসহ ব্যাখ্যা কর।', 'সময়ের সাপেক্ষে বস্তুর অবস্থানের পরিবর্তনকে গতি বলে। যেমন: চলমান গাড়ি, উড়ন্ত পাখি।'],
  ['দূরত্ব ও সরণের মধ্যে পার্থক্য লিখ।', 'দূরত্ব স্কেলার রাশি — প্রকৃত পথের দৈর্ঘ্য; সরণ ভেক্টর রাশি — আদি ও ন বিন্দুর মধ্যে সংক্ষিপ্ততম দূরত্ব দিকসহ।'],
  ['দ্রুতি ও বেগের পার্থক্য কী?', 'দ্রুতি স্কেলার — শুধু মান; বেগ ভেক্টর — মান ও দিক উভয়ই।'],
  ['ত্বরণ কাকে বলে? এর SI একক কী?', 'একক সময়ে বেগের পরিবর্তনকে ত্বরণ বলে। SI একক m/s²।'],
  ['সমবেগে চলমান বস্তুর ত্বরণ কত এবং কেন?', 'শূন্য — কারণ সমবেগে বেগের কোনো পরিবর্তন হয় না।'],
  ['একটি গাড়ি 72 km/h বেগে চলছে। বেগটি m/s এককে প্রকাশ কর।', '72 × (1000/3600) = 20 m/s।'],
  ['মুক্ত পতনের সময় বস্তুর ত্বরণ কত হয়?', 'অভিকর্ষজ ত্বরণ g ≈ 9.8 m/s², নিচের দিকে।'],
  ['বেগ-সময় লেখচিত্রের নিচের ক্ষেত্রফল কী নির্দেশ করে?', 'নির্দিষ্ট সময়ে অতিক্রান্ত সরণ।'],
  ['v² = u² + 2as সূত্রটি কখন ব্যবহার করা হয়?', 'যখন সময় অজানা থাকে কিন্তু সরণ জানা থাকে।'],
  ['একটি বস্তু 5 m/s² ত্বরণে 10 সেকেন্ডে বেগ কত বাড়ায়?', 'Δv = a × t = 5 × 10 = 50 m/s।'],
];

const FEATURED = {
  cls9_phy_c1: { mcqs: MOTION_MCQS, practice: MOTION_PRACTICE, notes: MOTION_NOTES },
  cls9_phy_c2: {
    notes: [['গতির পরিবর্তন ও বল — সংক্ষিপ্ত নোট', `• বল: বস্তুর গতির অবস্থা পরিবর্তন করে বা পরিবর্তনের চেষ্টা করে। SI একক: নিউটন (N)।\n• নিউটনের প্রথম সূত্র: বাহ্যিক বল প্রযুক্ত না হলে স্থির বস্তু স্থির থাকে, গতিশীল বস্তু সমবেগে চলতে থাকে। (জড়তার সূত্র)\n• দ্বিতীয় সূত্র: F = ma\n• তৃতীয় সূত্র: প্রতিটি ক্রিয়ার সমান ও বিপরীত প্রতিক্রিয়া আছে। (রকেটের গতি)\n• ভরবেগ p = mv`]],
    mcqs: [
      ['বলের SI একক কোনটি?', ['জুল', 'নিউটন', 'ওয়াট', 'প্যাসকেল'], 1, 'বলের একক নিউটন (N) = kg·m/s²।'],
      ['F = ma নিউটনের কোন সূত্র থেকে পাওয়া যায়?', ['প্রথম', 'দ্বিতীয়', 'তৃতীয়', 'মহাকর্ষ'], 1, 'নিউটনের দ্বিতীয় সূত্র: F = ma।'],
      ['ভরবেগের সমীকরণ কোনটি?', ['p = mv', 'p = m/v', 'p = ma', 'p = F × a'], 0, 'ভরবেগ p = ভর × বেগ।'],
      ['রকেটের গতি নিউটনের কোন সূত্র দ্বারা ব্যাখ্যা করা হয়?', ['প্রথম', 'দ্বিতীয়', 'তৃতীয়', 'কোনোটিই নয়'], 2, 'ক্রিয়া-প্রতিক্রিয়ার তৃতীয় সূত্র দ্বারা।'],
      ['ঘর্ষণ বল সাধারণত গতির —', ['সহায়ক', 'বিরোধী', 'কোনো প্রভাব নেই', 'বেগ বাড়ায়'], 1, 'ঘর্ষণ গতির বিপরীত দিকে কাজ করে।'],
    ],
  },
  cls9_chem_c2: {
    notes: [['পরমাণুর গঠন — সংক্ষিপ্ত নোট', `• পরমাণুর কেন্দ্রে নিউক্লিয়াস — এতে প্রোটন (ধনাত্মক) ও নিউট্রন (নিরপেক্ষ) থাকে।\n• ইলেকট্রন (ঋণাত্মক) নিউক্লিয়াসের চারদিকে শক্তিস্তরে (K, L, M, N) ঘুরে।\n• পারমাণবিক সংখ্যা = প্রোটন সংখ্যা; ভর সংখ্যা = প্রোটন + নিউট্রন।\n• আবিষ্কার: ইলেকট্রন — জে. জে. থমসন; নিউক্লিয়াস — রাদারফোর্ড; নিউট্রন — জেমস চ্যাডউইক।`]],
    mcqs: [
      ['পরমাণুর কেন্দ্রে কী থাকে?', ['ইলেকট্রন', 'নিউক্লিয়াস', 'শক্তিস্তর', 'ইলেকট্রন মেঘ'], 1, 'পরমাণুর কেন্দ্রে নিউক্লিয়াস থাকে।'],
      ['ইলেকট্রনের চার্জ কেমন?', ['ধনাত্মক', 'ঋণাত্মক', 'নিরপেক্ষ', 'দ্বিগুণ'], 1, 'ইলেকট্রন ঋণাত্মক আধানযুক্ত।'],
      ['নিউট্রন আবিষ্কার করেন কে?', ['জেমস চ্যাডউইক', 'রাদারফোর্ড', 'জে. জে. থমসন', 'নিলস বোর'], 0, '১৯৩২ সালে জেমস চ্যাডউইক নিউট্রন আবিষ্কার করেন।'],
      ['সোডিয়ামের পারমাণবিক সংখ্যা কত?', ['11', '23', '12', '19'], 0, 'সোডিয়ামের (Na) পারমাণবিক সংখ্যা ১১।'],
      ['ইলেকট্রন কোথায় ঘুরপাক খায়?', ['নিউক্লিয়াসের ভিতরে', 'শক্তিস্তরে/অরবিটে', 'প্রোটনের ভিতরে', 'কোথাও নয়'], 1, 'ইলেকট্রন নিউক্লিয়াসের বাইরে শক্তিস্তরে ঘোরে।'],
    ],
  },
  cls9_bio_c2: {
    notes: [['কোষ ও কোষ বিভাজন — সংক্ষিপ্ত নোট', `• কোষ জীবদেহের কাঠামোগত ও ক্রিয়াগত একক।\n• কোষাঙ্গ: নিউক্লিয়াস, মাইটোকন্ড্রিয়া (শক্তিঘর), রাইবোজোম (প্রোটিন তৈরি), লাইসোজোম ইত্যাদি।\n• উদ্ভিদ কোষের দেয়াল সেলুলোজ দ্বারা তৈরি।\n• কোষ বিভাজন ২ প্রকার: মাইটোসিস (দৈহিক, সংখ্যা অপরিবর্তিত) ও মিয়োসিস (জনন, ক্রোমোজোম অর্ধেক)।`]],
    mcqs: [
      ['জীবদেহের কাঠামোগত ও ক্রিয়াগত একক কোনটি?', ['টিস্যু', 'কোষ', 'অঙ্গ', 'অঙ্গাণু'], 1, 'কোষ জীবদেহের গঠন ও কাজের মৌলিক একক।'],
      ['কোষ বিভাজন কত প্রকার ও কী কী?', ['২ প্রকার: মাইটোসিস ও মিয়োসিস', '৩ প্রকার', '১ প্রকার', '৪ প্রকার'], 0, 'মাইটোসিস ও মিয়োসিস — মোট ২ প্রকার।'],
      ['কোষের "শক্তিঘর" বলা হয় কোনটিকে?', ['রাইবোজোম', 'মাইটোকন্ড্রিয়া', 'নিউক্লিয়াস', 'লাইসোজোম'], 1, 'মাইটোকন্ড্রিয়ায় ATP উৎপন্ন হয়।'],
      ['উদ্ভিদ কোষের দেয়াল কী দ্বারা তৈরি?', ['সেলুলোজ', 'প্রোটিন', 'স্টার্চ', 'কাইটিন'], 0, 'উদ্ভিদ কোষ প্রাচীর সেলুলোজ দ্বারা তৈরি।'],
      ['মিয়োসিস বিভাজনে ক্রোমোজোম সংখ্যা কী হয়?', ['দ্বিগুণ', 'অর্ধেক', 'অপরিবর্তিত', 'তিনগুণ'], 1, 'মিয়োসিসে ক্রোমোজোম সংখ্যা অর্ধেক হয় (হ্রাসমূলক বিভাজন)।'],
    ],
  },
  cls9_math_c1: {
    mcqs: [
      ['{1, 2, 3} সেটের উপাদান সংখ্যা কত?', ['2', '3', '6', '1'], 1, 'সেটে ৩টি উপাদান আছে।'],
      ['কোনটি ফাঁকা সেট?', ['{0}', '{φ}', 'φ', '{1}'], 2, 'φ ফাঁকা সেট; {0} ও {φ} এক উপাদানবিশিষ্ট সেট।'],
      ['A = {1, 2} হলে P(A)-এর উপাদান সংখ্যা কত?', ['2', '3', '4', '8'], 2, 'উপাদান ২টি হলে উপসেট সংখ্যা 2² = ৪টি।'],
      ['দুটি সেটের সাধারণ উপাদানসমূহের সেটকে কী বলে?', ['সংযোগ', 'ছেদ', 'পার্থক্য', 'পূরক'], 1, 'A ∩ B = ছেদ সেট।'],
      ['f(x) = 2x + 3 হলে f(2) = ?', ['5', '7', '8', '10'], 1, 'f(2) = 2×2 + 3 = 7।'],
    ],
  },
  cls9_ict_c1: {
    mcqs: [
      ['CPU-এর পূর্ণরূপ কী?', ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Unit', 'Control Processing Unit'], 0, 'CPU = Central Processing Unit।'],
      ['1 KB = কত Byte?', ['100', '1000', '1024', '512'], 2, '1 KB = 1024 Byte (2¹⁰)।'],
      ['নিচের কোনটি ইনপুট ডিভাইস?', ['মনিটর', 'প্রিন্টার', 'কিবোর্ড', 'স্পিকার'], 2, 'কিবোর্ড কম্পিউটারে তথ্য ইনপুট দেয়।'],
      ['HTML কী তৈরিতে ব্যবহৃত হয়?', ['ওয়েবপেজ', 'ছবি আঁকা', 'ভিডিও সম্পাদনা', 'গান বাজানো'], 0, 'HTML দিয়ে ওয়েবপেজের কাঠামো তৈরি হয়।'],
      ['RAM কোন ধরনের মেমোরি?', ['স্থায়ী', 'অস্থায়ী', 'চৌম্বকীয়', 'অপটিক্যাল'], 1, 'RAM অস্থায়ী মেমোরি — বিদ্যুৎ গেলে ডেটা মুছে যায়।'],
    ],
  },
  cls10_phy_c1: {
    mcqs: [
      ['বিদ্যুৎ প্রবাহের একক কোনটি?', ['ভোল্ট', 'অ্যাম্পিয়ার', 'ওহম', 'ওয়াট'], 1, 'কুলম্ব/সেকেন্ড = অ্যাম্পিয়ার (A)।'],
      ['রোধের একক কী?', ['ওহম (Ω)', 'ভোল্ট', 'অ্যাম্পিয়ার', 'ফ্যারাড'], 0, 'রোধের একক ওহম।'],
      ['ওহমের সূত্র অনুযায়ী V = ?', ['IR', 'I/R', 'R/I', 'I²R²'], 0, 'V = IR (ভোল্ট = কারেন্ট × রোধ)।'],
      ['তামা একটি —', ['অপরিবাহী', 'অর্ধপরিবাহী', 'পরিবাহী', 'কোনোটিই নয়'], 2, 'তামা ভালো বিদ্যুৎ পরিবাহী।'],
      ['সমান্তরাল বর্তনীতে সমতুল্য রোধ —', ['বেড়ে যায়', 'কমে যায়', 'অপরিবর্তিত থাকে', 'শূন্য হয়'], 1, 'সমান্তরাল সংযোগে সমতুল্য রোধ কমে যায়।'],
    ],
  },
  cls10_chem_c2: {
    mcqs: [
      ['1 মোল পদার্থে কণার সংখ্যা কত?', ['6.023×10²³', '3.6×10²³', '6.023×10²²', '9.8×10²³'], 0, 'অ্যাভোগেড্রো সংখ্যা = 6.023×10²³।'],
      ['পানির (H₂O) মোলার ভর কত?', ['16 g', '18 g', '20 g', '22 g'], 1, '(2×1) + 16 = 18 g/mol।'],
      ['STP-তে 1 মোল গ্যাসের আয়তন কত?', ['22.4 L', '24 L', '20 L', '22.4 mL'], 0, 'STP-তে মোলার আয়তন 22.4 লিটার।'],
      ['মোলার ভরের একক কোনটি?', ['g', 'mol', 'g/mol', 'mol/L'], 2, 'মোলার ভর = গ্রাম প্রতি মোল।'],
      ['44 g CO₂-এ কার্বনের ভর কত? (C=12, O=16)', ['12 g', '32 g', '44 g', '6 g'], 0, 'CO₂ = 44 g, এতে C = 12 g।'],
    ],
  },
};

const WEEKLY_EXAMS = [
  {
    id: 'week1', weekNo: 1, title: 'Weekly Exam — Week 01 (পদার্থবিজ্ঞান + গণিত)', durationMin: 10,
    questions: [
      ['একক সময়ে বেগের পরিবর্তনকে কী বলে?', ['দ্রুতি', 'ত্বরণ', 'সরণ', 'বল'], 1, null],
      ['বলের SI একক কোনটি?', ['জুল', 'নিউটন', 'ওয়াট', 'অ্যাম্পিয়ার'], 1, null],
      ['f(x) = x² হলে f(3) = ?', ['6', '8', '9', '12'], 2, null],
      ['সমবেগে চলমান বস্তুর ত্বরণ কত?', ['ধনাত্মক', 'ঋণাত্মক', 'শূন্য', 'অসীম'], 2, null],
      ['কোনটি ভেক্টর রাশি?', ['দূরত্ব', 'দ্রুতি', 'সময়', 'বেগ'], 3, null],
      ['1 km = কত মিটার?', ['10', '100', '1000', '10000'], 2, null],
      ['v = u + at — এখানে u দ্বারা কী বোঝায়?', ['চূড়ান্ত বেগ', 'প্রাথমিক বেগ', 'ত্বরণ', 'সরণ'], 1, null],
      ['ত্রিভুজের তিন কোণের সমষ্টি কত?', ['90°', '180°', '270°', '360°'], 1, null],
      ['বেগ-সময় লেখচিত্রের ঢাল কী নির্দেশ করে?', ['দ্রুতি', 'সরণ', 'ত্বরণ', 'দূরত্ব'], 2, null],
      ['একটি বস্তু 10 m/s বেগে 6 সেকেন্ড চললে দূরত্ব কত?', ['16 m', '60 m', '4 m', '0.6 m'], 1, 'দূরত্ব = 10 × 6 = 60 m।'],
    ],
  },
  {
    id: 'week2', weekNo: 2, title: 'Weekly Exam — Week 02 (রসায়ন + জীববিজ্ঞান)', durationMin: 8,
    questions: [
      ['পরমাণুর কেন্দ্রকে কী বলে?', ['শেল', 'নিউক্লিয়াস', 'অরবিট', 'ভ্যালেন্স'], 1, null],
      ['ইলেকট্রনের চার্জ কেমন?', ['ধনাত্মক', 'ঋণাত্মক', 'নিরপেক্ষ', 'শূন্য'], 1, null],
      ['পানির সংকেত কোনটি?', ['CO₂', 'H₂O', 'O₂', 'NaCl'], 1, null],
      ['কোষের শক্তিঘর কোনটি?', ['রাইবোজোম', 'নিউক্লিয়াস', 'মাইটোকন্ড্রিয়া', 'ভ্যাকুওল'], 2, null],
      ['মিয়োসিস বিভাজনে ক্রোমোজোম সংখ্যা কী হয়?', ['দ্বিগুণ', 'অর্ধেক', 'অপরিবর্তিত', 'তিনগুণ'], 1, null],
      ['উদ্ভিদ কোষের দেয়াল তৈরি হয় কী দিয়ে?', ['সেলুলোজ', 'প্রোটিন', 'স্টার্চ', 'চর্বি'], 0, null],
      ['পর্যায় সারণিতে অক্সিজেনের প্রতীক কী?', ['O', 'Ox', 'Og', 'On'], 0, null],
      ['সালোকসংশ্লেষণে উদ্ভিদ কোন গ্যাস গ্রহণ করে?', ['অক্সিজেন', 'নাইট্রোজেন', 'কার্বন ডাই-অক্সাইড', 'হাইড্রোজেন'], 2, null],
    ],
  },
  {
    id: 'week3', weekNo: 3, title: 'Weekly Exam — Week 03 (ICT + English)', durationMin: 5,
    questions: [
      ['HTML কী তৈরিতে ব্যবহৃত হয়?', ['ওয়েবপেজ', 'ছবি', 'ভিডিও', 'গান'], 0, null],
      ['CPU-এর পূর্ণরূপ কী?', ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Unit', 'Control Processing Unit'], 0, null],
      ["'He ___ to school every day.' — সঠিক শব্দ কোনটি?", ['go', 'goes', 'gone', 'going'], 1, null],
      ['1 KB = কত Byte?', ['100', '512', '1000', '1024'], 3, null],
      ['কোনটি ইনপুট ডিভাইস?', ['মনিটর', 'কিবোর্ড', 'প্রিন্টার', 'স্পিকার'], 1, null],
    ],
  },
];

// ---------- MCQ bank generation ----------

const CONTENT = { ...BAN_ENG_CONTENT, ...SCI_CONTENT };

const POOL_BN = [
  ['1 কিলোমিটার = কত মিটার?', ['100', '1000', '10', '10000'], 1, '১ কিমি = ১০০০ মিটার।'],
  ['পানির সংকেত কোনটি?', ['CO₂', 'H₂O', 'O₂', 'NaCl'], 1, 'পানি দুটি হাইড্রোজেন ও একটি অক্সিজেন পরমাণুর যৌগ।'],
  ['সূর্য থেকে পৃথিবীতে প্রাপ্ত শক্তি কোনটি?', ['রাসায়নিক শক্তি', 'সৌরশক্তি', 'তাপীয় শক্তি নয়', 'শব্দশক্তি'], 1, 'সূর্যের আলো-তাপই সৌরশক্তি।'],
  ['বাংলা বর্ণমালায় স্বরবর্ণ কয়টি?', ['১০', '১১', '৯', '১২'], 1, 'বাংলা স্বরবর্ণ ১১টি।'],
  ['বৃত্তের ক্ষেত্রফলের সূত্র কোনটি?', ['πr²', '2πr', 'πd', '½πr'], 0, 'বৃত্তের ক্ষেত্রফল = πr²।'],
  ['কোনটি নবায়নযোগ্য শক্তির উৎস?', ['কয়লা', 'সৌরশক্তি', 'পেট্রোল', 'প্রাকৃতিক গ্যাস'], 1, 'সৌরশক্তি ফুরিয়ে যায় না।'],
  ['কম্পিউটারের "মস্তিষ্ক" কোনটি?', ['RAM', 'CPU', 'মনিটর', 'হার্ডডিস্ক'], 1, 'CPU সব প্রক্রিয়াকরণ করে।'],
  ['মানবদেহে রক্ত সঞ্চালনের প্রধান অঙ্গ কোনটি?', ['হৃদপিণ্ড', 'ফুসফুস', 'কিডনি', 'যকৃত'], 0, 'হৃদপিণ্ড রক্ত পাম্প করে।'],
  ['ত্রিভুজের তিন কোণের সমষ্টি কত?', ['90°', '180°', '270°', '360°'], 1, 'ত্রিভুজের কোণসমষ্টি ১৮০°।'],
  ['২৬ মার্চ কোন দিবস?', ['বিজয় দিবস', 'স্বাধীনতা দিবস', 'ভাষা শহীদ দিবস', 'শিক্ষা দিবস'], 1, '২৬ মার্চ ১৯৭১ — স্বাধীনতা দিবস।'],
];

const POOL_EN = [
  ['Water boils at ___ °C.', ['100', '50', '150', '90'], 0, 'Water boils at 100°C at normal pressure.'],
  ['The largest planet of our solar system is —', ['Earth', 'Jupiter', 'Mars', 'Venus'], 1, 'Jupiter is the largest planet.'],
  ['Which is a renewable energy source?', ['Coal', 'Solar energy', 'Petrol', 'Natural gas'], 1, 'Solar energy never runs out.'],
  ['The first President of Bangladesh was —', ['Ziaur Rahman', 'Sheikh Mujibur Rahman', 'Tajuddin Ahmad', 'Sheikh Hasina'], 1, 'Bangabandhu Sheikh Mujibur Rahman was the first President.'],
  ['1 kilogram = ? grams', ['100', '1000', '10', '10000'], 1, '1 kg = 1000 g।'],
  ['Photosynthesis takes place in —', ['Green plants', 'Animals', 'Rocks', 'Water only'], 0, 'Green plants make food by photosynthesis.'],
  ['The unit of force is —', ['Joule', 'Newton', 'Watt', 'Pascal'], 1, 'Force is measured in Newton (N).'],
  ['How many vowels are in the English alphabet?', ['4', '5', '6', '21'], 1, 'a, e, i, o, u — five vowels.'],
  ['The capital of Bangladesh is —', ['Chattogram', 'Dhaka', 'Rajshahi', 'Khulna'], 1, 'Dhaka is the capital of Bangladesh.'],
  ['Which gas do plants absorb for photosynthesis?', ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'], 1, 'Plants absorb CO₂ and release O₂.'],
];

function pointsOf(cc) {
  if (!cc?.p) return [];
  return cc.p.split(';').map((s) => s.split('|'));
}

function genMcqs(cc, isEn) {
  const pts = pointsOf(cc);
  if (pts.length < 2) return [];
  const defs = pts.map((p) => p[1]);
  const out = [];
  pts.forEach((p, i) => {
    const others = defs.filter((_, j) => j !== i);
    for (let k = 0; k < 2 && k < others.length; k++) {
      const distractors = others.filter((_, j) => j !== k).slice(0, 3);
      while (distractors.length < 3) distractors.push(others[(i + k + 1) % others.length]);
      const options = [p[1], ...distractors];
      const question = k === 0
        ? (isEn ? `What is "${p[0]}"?` : `"${p[0]}" কাকে বলে / কী?`)
        : (isEn ? `Which statement correctly describes "${p[0]}"?` : `"${p[0]}" সম্পর্কে সঠিক বক্তব্য কোনটি?`);
      out.push([question, options, 0, p[1]]);
    }
  });
  return out;
}

function buildBank(id, cc, feat, isEn) {
  const hand = [...(feat.mcqs ?? []), ...(cc?.m ?? [])];
  const gen = genMcqs(cc, isEn);
  const pool = (isEn ? POOL_EN : POOL_BN).slice();
  const all = [...hand, ...gen, ...pool];
  return all.slice(0, 25);
}

function contentFor(id, code, clsNum) {
  if (CONTENT[id]) return CONTENT[id];
  const sharedKey = { ban1: 'ban1_678', ban2: 'ban2_678', eng1: 'eng1_678', eng2: 'eng2_678', bgs: 'bgs', rel: 'rel' }[code];
  if (sharedKey) return CH678[sharedKey] ?? null;
  return CH678[`${code}${clsNum}`] ?? null;
}

const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();

export function seedIfEmpty() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM users').get().n;
  if (count > 0) return false;

  const tx = db.transaction(() => {
    // Users
    const insUser = db.prepare(
      'INSERT INTO users (id, name, email, password, role, designation, subject, class_id, roll) VALUES (@id, @name, @email, @password, @role, @designation, @subject, @class_id, @roll)'
    );
    for (const u of USERS) {
      insUser.run({
        id: u.id, name: u.name, email: u.email, password: u.password, role: u.role,
        designation: u.designation ?? null, subject: u.subject ?? null,
        class_id: u.classId ?? null, roll: u.roll ?? null,
      });
    }

    // Classes & subjects
    const insClass = db.prepare('INSERT INTO classes (id, name, name_bn) VALUES (?, ?, ?)');
    const insSubject = db.prepare('INSERT INTO subjects (id, class_id, name, code, color) VALUES (?, ?, ?, ?, ?)');
    for (const c of CLASSES) insClass.run(c.id, c.name, c.nameBn);
    for (const clsId of Object.keys(CLASS_SUBJECTS)) {
      for (const code of CLASS_SUBJECTS[clsId]) {
        const m = SUBJECT_META[code];
        insSubject.run(`${clsId}_${code}`, clsId, m.name, m.code, m.color);
      }
    }

    // Chapters + lectures + notes + practice + mcq
    const insChapter = db.prepare('INSERT INTO chapters (id, subject_id, name, sort_order, mcq_title, mcq_duration_min) VALUES (?, ?, ?, ?, ?, ?)');
    const insLec = db.prepare('INSERT INTO lectures (id, chapter_id, title, video_url, description) VALUES (?, ?, ?, ?, ?)');
    const insNote = db.prepare('INSERT INTO notes (id, chapter_id, title, content) VALUES (?, ?, ?, ?)');
    const insPq = db.prepare('INSERT INTO practice_questions (id, chapter_id, question, answer) VALUES (?, ?, ?, ?)');
    const insMcq = db.prepare('INSERT INTO mcq_questions (id, chapter_id, question, options, correct_index, explanation) VALUES (?, ?, ?, ?, ?, ?)');

    let mcqN = 0, noteN = 0, pqN = 0, lecN = 0;
    const mcqId = () => `mcq_seed_${(++mcqN).toString(36)}`;

    for (const clsId of Object.keys(CLASS_SUBJECTS)) {
      const clsNum = clsId.replace('cls', '');
      for (const code of CLASS_SUBJECTS[clsId]) {
        const subjectId = `${clsId}_${code}`;
        const names = CHAPTERS[subjectId] ?? [];
        const isEn = code.startsWith('eng');
        names.forEach((name, i) => {
          const id = `${subjectId}_c${i + 1}`;
          const feat = FEATURED[id] ?? {};
          const cc = contentFor(id, code, clsNum);
          const bank = buildBank(id, cc, feat, isEn);
          const practice = feat.practice ?? cc?.q ?? [];
          const isMotion = id === 'cls9_phy_c1';

          insChapter.run(id, subjectId, name, i + 1, `${name} — MCQ Test`, bank.length);

          insLec.run(
            `lec_seed_${++lecN}`, id,
            isMotion ? 'গতি — পূর্ণ ক্লাস' : `${name} — ক্লাস ভিডিও`,
            DEMO_VIDEO,
            cc?.d ?? `${name} অধ্যায়ের ক্লাস ভিডিও।`
          );
          if (isMotion) {
            insLec.run(`lec_seed_${++lecN}`, id, 'গতির সূত্র — সংক্ষিপ্ত আলোচনা', DEMO_VIDEO, 'গতির তিনটি সূত্র ও তাদের প্রয়োগ।');
          }

          if (feat.notes) {
            feat.notes.forEach(([title, content]) => insNote.run(`note_seed_${++noteN}`, id, title, content));
          } else if (cc?.p) {
            const pts = pointsOf(cc);
            const body = pts.map((p) => `• ${p[0]}: ${p[1]}`).join('\n');
            insNote.run(`note_seed_${++noteN}`, id,
              isEn ? `${name} — Key Points` : `${name} — মূল ধারণা`,
              `${cc.d}\n\n${body}`);
          } else {
            insNote.run(
              `note_seed_${++noteN}`, id, `${name} — সংক্ষিপ্ত নোট`,
              `এই অধ্যায়ের মূল বিষয়বস্তু:\n• ${name}-এর মৌলিক ধারণা ও সংজ্ঞা\n• গুরুত্বপূর্ণ সূত্র ও উদাহরণ\n• পরীক্ষায় আসা প্রশ্নের ধরন\n\nবিস্তারিত নোট ও PDF শিক্ষক শীঘ্রই যোগ করবেন।`
            );
          }

          practice.forEach(([question, answer]) => insPq.run(`pq_seed_${++pqN}`, id, question, answer));
          bank.forEach(([question, options, correctIndex, explanation]) =>
            insMcq.run(mcqId(), id, question, JSON.stringify(options), correctIndex, explanation)
          );
        });
      }
    }

    // Weekly exams
    const insExam = db.prepare('INSERT INTO weekly_exams (id, week_no, title, duration_min, questions) VALUES (?, ?, ?, ?, ?)');
    let wqN = 0;
    for (const ex of WEEKLY_EXAMS) {
      const questions = ex.questions.map(([question, options, correctIndex, explanation]) => ({
        id: `wq_seed_${(++wqN).toString(36)}`, question, options, correctIndex, explanation,
      }));
      insExam.run(ex.id, ex.weekNo, ex.title, ex.durationMin, JSON.stringify(questions));
    }

    // Sample results
    const insResult = db.prepare(
      'INSERT INTO results (id, user_id, type, ref_id, title, total, obtained, correct, wrong, percentage, answers, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    const mk = (userId, type, refId, title, total, obtained, dayAgo) =>
      insResult.run(`res_seed_${userId}_${refId}`, userId, type, refId, title, total, obtained, obtained, total - obtained, Math.round((obtained / total) * 100), '[]', daysAgo(dayAgo));
    mk('usr_s1', 'weekly', 'week1', 'Weekly Exam — Week 01', 10, 10, 4);
    mk('usr_s2', 'weekly', 'week1', 'Weekly Exam — Week 01', 10, 9, 4);
    mk('usr_s3', 'weekly', 'week1', 'Weekly Exam — Week 01', 10, 8, 5);
    mk('usr_s4', 'weekly', 'week1', 'Weekly Exam — Week 01', 10, 7, 5);
    mk('usr_s5', 'weekly', 'week1', 'Weekly Exam — Week 01', 10, 6, 6);
    mk('usr_s6', 'weekly', 'week1', 'Weekly Exam — Week 01', 10, 5, 6);
    mk('usr_s1', 'weekly', 'week2', 'Weekly Exam — Week 02', 8, 7, 2);
    mk('usr_s2', 'weekly', 'week2', 'Weekly Exam — Week 02', 8, 6, 2);
    mk('usr_s3', 'weekly', 'week2', 'Weekly Exam — Week 02', 8, 6, 2);
    mk('usr_s4', 'weekly', 'week2', 'Weekly Exam — Week 02', 8, 4, 1);
    mk('usr_s5', 'weekly', 'week2', 'Weekly Exam — Week 02', 8, 3, 1);
    mk('usr_s1', 'chapter', 'cls9_phy_c1', 'গতি (Motion) — MCQ Test', 25, 18, 3);
    mk('usr_s2', 'chapter', 'cls9_phy_c1', 'গতি (Motion) — MCQ Test', 25, 20, 3);
    mk('usr_s3', 'chapter', 'cls9_phy_c1', 'গতি (Motion) — MCQ Test', 25, 14, 2);
    mk('usr_s2', 'chapter', 'cls9_chem_c2', 'পরমাণুর গঠন — MCQ Test', 25, 22, 2);

    // Notices
    const insNotice = db.prepare('INSERT INTO notices (id, title, body, date) VALUES (?, ?, ?, ?)');
    insNotice.run('ntc1', 'সাপ্তাহিক পরীক্ষা — Week 01 শুরু হয়েছে', 'পদার্থবিজ্ঞান ও গণিত বিষয়ের উপর এই সপ্তাহের সাপ্তাহিক MCQ পরীক্ষা শুরু হয়েছে। সকল শিক্ষার্থী নির্দিষ্ট সময়ের মধ্যে পরীক্ষা দেওয়ার জন্য উৎসাহিত করা হচ্ছে। পরীক্ষার ফলাফল ও লিডারবোর্ড সাথে সাথেই প্রকাশিত হবে।', daysAgo(1));
    insNotice.run('ntc2', 'Josephite Learning — আমাদের অফিসিয়াল ই-লার্নিং প্লাটফর্ম', 'সেন্ট জোসেফাইট স্কুল এন্ড কলেজের শিক্ষার্থীদের নিয়মিত Revision ও Practice-এর জন্য "Josephite Learning" প্লাটফর্ম চালু হয়েছে। এখানে ক্লাসের ভিডিও লেকচার, নোট, প্র্যাকটিস ও MCQ Test — সবকিছু একসাথে পাওয়া যাবে।', daysAgo(3));
    insNotice.run('ntc3', 'প্রতিটি অধ্যায়ে ২৫টি MCQ যোগ হয়েছে', 'Class 6-10-এর সব বিষয়ের প্রতিটি অধ্যায়ে এখন ২৫টি করে MCQ প্রশ্ন, নোট ও প্র্যাকটিস প্রশ্ন যোগ করা হয়েছে। শিক্ষার্থীরা এখন যেকোনো অধ্যায়ে MCQ Test দিতে পারবে।', daysAgo(5));
  });

  tx();
  return true;
}
