// Chapter content — Bangla & English 1st/2nd Paper, Class 9 & 10

// ---------- বাংলা ১ম পত্র ----------
const ban1_c1 = {
  d: 'সাহিত্যপাঠ — গল্প, কবিতা ও সাহিত্যের নান্দনিক উপাদান পরিচিতি।',
  p: 'ছোটগল্প|সংক্ষিপ্ত কাহিনিভিত্তিক গদ্য সাহিত্য;কবিতা|ছন্দময় আবেগের প্রকাশ;প্লট|গল্পের ঘটনা প্রবাহ;চরিত্র|গল্পের মানুষ বা সত্তা;রস|সাহিত্য উপভোগের মানসিক অনুভূতি;ভাব|রচনার মূল অভিপ্রায়',
  m: [
    ['গল্পের ঘটনা প্রবাহকে কী বলে?', ['প্লট', 'চরিত্র', 'রস', 'ছন্দ'], 0, 'গল্পে ঘটনার ধারাবাহিক বিন্যাসই প্লট।'],
    ['সংক্ষিপ্ত কাহিনিভিত্তিক গদ্য সাহিত্য —', ['ছোটগল্প', 'নাটক', 'প্রবন্ধ', 'জীবনী'], 0, 'ছোটগল্প স্বল্প পরিসরে একটি ঘটনা বর্ণনা করে।'],
    ['সাহিত্যের প্রাণ বলা হয় কোনটিকে?', ['রস', 'ছন্দ', 'বানান', 'শব্দসংখ্যা'], 0, 'রসই সাহিত্য উপভোগের কেন্দ্র।'],
    ['কবিতার প্রাণ কোনটি?', ['ছন্দ ও আবেগ', 'ব্যাকরণ', 'তথ্য', 'যুক্তি'], 0, 'ছন্দ ও আবেগের মিশ্রণেই কবিতার সৌন্দর্য।'],
  ],
  q: [
    ['ছোটগল্পের বৈশিষ্ট্য দুটি লেখো।', 'সংক্ষিপ্ত পরিসর ও একক প্লট — সামান্য চরিত্র দিয়ে নির্দিষ্ট ঘটনা বর্ণনা।'],
    ['তোমার প্রিয় কবিতার নাম ও মূল ভাব লেখো।', 'শিক্ষার্থী নিজের পাঠভিত্তিক উত্তর দেবে; মূল ভাব দুই বাক্যে লিখবে।'],
  ],
};
const ban1_c2 = {
  d: 'গদ্যসাহিত্য — প্রবন্ধ ও নাটকের কাঠামো, ভাষাশৈলী ও জীবনদর্শন।',
  p: 'প্রবন্ধ|কোনো বিষয়ে যুক্তিসহ গদ্য আলোচনা;নাটক|মঞ্চায়নের উপযোগী সংলাপমূলক সাহিত্য;সংলাপ|দুই বা ততোধিক ব্যক্তির কথোপকথন;দৃশ্য|নাটকের পর্ব বিভাজন;যুক্তি|কারণ দেখিয়ে মত প্রতিষ্ঠা;ভাষাশৈলী|লেখকের বিশেষ প্রকাশরীতি',
  m: [
    ['মঞ্চায়নের উপযোগী সাহিত্য —', ['নাটক', 'ছোটগল্প', 'কবিতা', 'প্রবন্ধ'], 0, 'নাটক সংলাপ ও দৃশ্যে মঞ্চে অভিনীত হয়।'],
    ['কোনো বিষয়ে যুক্তিসহ গদ্য আলোচনা —', ['প্রবন্ধ', 'গল্প', 'গান', 'উপন্যাস'], 0, 'প্রবন্ধ তথ্য ও যুক্তিনির্ভর গদ্য।'],
    ['নাটকের প্রধান উপাদান কোনটি?', ['সংলাপ', 'ছন্দ', 'স্তবক', 'শিরোনাম'], 0, 'সংলাপের মাধ্যমেই নাটকের কাহিনি এগিয়ে যায়।'],
    ['নাটকের পর্ব বিভাজনকে বলে —', ['দৃশ্য', 'অঙ্ক নয়', 'স্তবক', 'ছেদ'], 0, 'নাটক দৃশ্যে বিভক্ত হয়।'],
  ],
  q: [
    ['প্রবন্ধ ও গল্পের পার্থক্য লেখো।', 'প্রবন্ধ তথ্য-যুক্তিনির্ভর আলোচনা; গল্প কাহিনিনির্ভর সাহিত্য রচনা।'],
    ['নাটকের প্রধান তিনটি উপাদান লেখো।', 'সংলাপ, চরিত্র ও দৃশ্য (কাহিনি)।'],
  ],
};
const ban1_c3 = {
  d: 'ব্যাকরণ — সমাস, কারক, প্রত্যয় ও অনুপ্রাণের নিয়মাবলি।',
  p: 'সমাস|একাধিক শব্দের এক শব্দ রূপে ব্যবহার;কারক|বাক্যে পদের ক্রিয়ার সাথে সম্পর্ক;বিভক্তি|পদের ব্যাকরণগত রূপ নির্দেশক প্রত্যয়;প্রত্যয়|শব্দের শেষে যুক্ত ব্যাকরণগত অংশ;অনুপ্রাণ|অন্য শব্দের আগে বসে নতুন শব্দ গঠন;উত্তরপদ|সমাসের প্রধান অর্থবোধক শব্দ',
  m: [
    ['"রাজপুত" কোন সমাসের উদাহরণ?', ['ষষ্ঠী তৎপুরুষ', 'দ্বন্দ্ব', 'কর্মধারয়', 'অব্যয়ীভাব'], 0, 'রাজপুত = রাজার পুত্র (ষষ্ঠী তৎপুরুষ)।'],
    ['বাক্যে পদের ক্রিয়ার সাথে সম্পর্ককে বলে —', ['কারক', 'বিভক্তি', 'সমাস', 'কাল'], 0, 'কারক পদ ও ক্রিয়ার সম্পর্ক নির্দেশ করে।'],
    ['শব্দের শেষে যুক্ত ব্যাকরণগত অংশ —', ['প্রত্যয়', 'অনুপ্রাণ', 'উপসর্গ', 'কেবল বিভক্তি'], 0, 'প্রত্যয় যোগে নতুন শব্দ ও রূপ গঠিত হয়।'],
    ['"বিদ্যালয়" শব্দে "বি" কোনটি?', ['অনুপ্রাণ', 'প্রত্যয়', 'বিভক্তি', 'সমাস'], 0, '"বি" অনুপ্রাণ — আগে বসে নতুন শব্দ গঠন করে।'],
  ],
  q: [
    ['"গঙ্গাজল", "পদাতিক" — সমাস ও বিগ্রহ লেখো।', 'গঙ্গাজল = গঙ্গার জল (ষষ্ঠী তৎপুরুষ); পদাতিক = পায়ে চলা (দ্বিগু কর্মধারয়)।'],
    ['কারক কত প্রকার? নামসহ একটি করে উদাহরণ দাও।', '৬ প্রকার — কর্তা (রাম পড়ে), কর্ম, করণ, সম্প্রদান, অপাদান, সম্বন্ধ।'],
  ],
};

// ---------- বাংলা ২য় পত্র ----------
const ban2_c1 = {
  d: 'রচনা, সারমর্ম ও প্রয়োগ-ভাষা — সৃজনশীল বাংলা লেখার দক্ষতা।',
  p: 'রচনা|সুবিন্যস্ত বিষয়ভিত্তিক লেখা;সারমর্ম|মূল লেখার সংক্ষিপ্ত রূপ;প্রয়োগ|শব্দের বাক্যে সঠিক ব্যবহার;ভূমিকা|রচনার প্রথম অংশ;উপসংহার|রচনার শেষ অংশ;অনুচ্ছেদ|এক ভাবে লেখা বাক্যসমষ্টি',
  m: [
    ['রচনার প্রথম অংশকে বলে —', ['ভূমিকা', 'উপসংহার', 'সারমর্ম', 'অনুচ্ছেদ'], 0, 'ভূমিকা পাঠকের আগ্রহ সৃষ্টি করে।'],
    ['মূল লেখার সংক্ষিপ্ত রূপ —', ['সারমর্ম', 'ভূমিকা', 'শিরোনাম', 'ব্যাখ্যা'], 0, 'সারমর্ম মূলকথা সংক্ষেপে প্রকাশ করে।'],
    ['রচনা সুন্দর করতে দরকার —', ['ভাবের ধারাবাহিকতা', 'শব্দ যত বেশি তত ভালো', 'শুধু উদ্ধৃতি', 'শুধু দীর্ঘ বাক্য'], 0, 'ভাবের ধারাবাহিকতা ও স্পষ্টতাই মূল সৌন্দর্য।'],
    ['শব্দের বাক্যে সঠিক ব্যবহারকে বলে —', ['প্রয়োগ', 'ব্যুৎপত্তি', 'উচ্চারণ', 'ছন্দ'], 0, 'প্রয়োগ-ভাষা দক্ষতার অন্যতম মাপকাঠি।'],
  ],
  q: [
    ['রচনার কাঠামোর তিনটি অংশ লেখো।', 'ভূমিকা, মূল অংশ (অনুচ্ছেদ বিন্যাসসহ) ও উপসংহার।'],
    ['যেকোনো একটি অনুচ্ছেদ পড়ে এর সারমর্ম লেখার নিয়ম ব্যাখ্যা করো।', 'মূল ভাব চিহ্নিত করে নিজের ভাষায় সংক্ষেপে, অক্ষুণ্ণ অর্থে লেখা।'],
  ],
};
const ban2_c2 = {
  d: 'বানান, বাগ্ধারা ও প্রবাদ — প্রয়োগিক বাংলা ব্যাকরণ।',
  p: 'বাগ্ধারা|বিশেষ অর্থবোধক শব্দগুচ্ছ;প্রবাদ|প্রচলিত অর্থবহ সংক্ষিপ্ত উক্তি;বানান|শব্দের শুদ্ধ লিখিত রূপ;সন্ধি|দুই ধ্বনির মিলন;উপসর্গ|শব্দের আগে যুক্ত অংশ;প্রয়োগ|বাক্যে শুদ্ধ ব্যবহার',
  m: [
    ['"হাতি আসে টেরে" কোনটি?', ['বাগ্ধারা', 'প্রবাদ', 'সন্ধি', 'উপসর্গ'], 0, 'এটি বিশেষ অর্থবোধক শব্দগুচ্ছ — বাগ্ধারা।'],
    ['দুই ধ্বনির মিলনকে বলে —', ['সন্ধি', 'সমাস', 'কারক', 'ছন্দ'], 0, 'স্বর/ব্যঞ্জন সন্ধিতে ধ্বনি মিলিত হয়।'],
    ['শব্দের আগে যুক্ত অংশ —', ['উপসর্গ', 'প্রত্যয়', 'বিভক্তি', 'অনুপ্রাণ'], 0, 'উপসর্গ শব্দের পূর্বে বসে অর্থ পরিবর্তন করে।'],
    ['শুদ্ধ বানান কোনটি?', ['মুমূর্ষু', 'মুমুর্ষু', 'মুমূর্ষূ', 'মূমুর্ষু'], 0, 'স্বরসন্ধির নিয়মে শুদ্ধ রূপ "মুমূর্ষু"।'],
  ],
  q: [
    ['"কপালকুসুম" বাগ্ধারার অর্থ লেখো।', 'অকালে সৌভাগ্যের প্রকাশ বা অকালমৃত্যু — প্রসঙ্গভেদে দুই অর্থে ব্যবহৃত হয়।'],
    ['"অন্ন + আহার" সন্ধি বিচ্ছেদ করো।', 'অন্নাহার = অন্ন + আহার (স্বরসন্ধি: অ + আ = আ)।'],
  ],
};
const ban2_c3 = {
  d: 'নির্মিতি — সৃজনশীল প্রশ্নের উত্তর ও কার্যকর লেখার কৌশল।',
  p: 'নির্মিতি|নিজের ভাষায় সৃজনশীল রচনা;মূলভাব|লেখার কেন্দ্রীয় কথা;ব্যাখ্যা|বিস্তারিত করে তুলে ধরা;উদ্দীপক|প্রশ্নে দেওয়া নমুনা অনুচ্ছেদ;সংযোগ|ভাবের মধ্যে মিল সৃষ্টি;সিদ্ধান্ত|শেষ অংশের নিষ্পত্তি',
  m: [
    ['সৃজনশীল উত্তরের প্রথম ধাপ —', ['মূলভাব চিহ্নিত করা', 'শব্দসংখ্যা বাড়ানো', 'উদ্ধৃতি দেওয়া', 'শিরোনাম দেওয়া'], 0, 'মূলভাব ধরে নিলে উত্তর গোছানো হয়।'],
    ['প্রশ্নে দেওয়া নমুনা অনুচ্ছেদকে বলে —', ['উদ্দীপক', 'সারমর্ম', 'ভূমিকা', 'পরিশিষ্ট'], 0, 'উদ্দীপকের সাথে পাঠ্যবইয়ের সংযোগ করতে হয়।'],
    ['লেখার শেষ অংশে থাকে —', ['সিদ্ধান্ত', 'নতুন প্রশ্ন', 'উদ্দীপক', 'শিরোনাম'], 0, 'সিদ্ধান্তে পুরো ভাবের নিষ্পত্তি হয়।'],
    ['উদ্দীপক ও পাঠ্যাংশের মিল সৃষ্টিকে বলে —', ['সংযোগ', 'ব্যাখ্যা', 'বিশ্লেষণ', 'বর্ণনা'], 0, 'দুই অংশের ভাবমিলই সংযোগ।'],
  ],
  q: [
    ['সৃজনশীল প্রশ্নের উত্তরের ধাপগুলো লেখো।', 'মূলভাব → ব্যাখ্যা-বিশ্লেষণ → উদ্দীপকের সাথে সংযোগ → সিদ্ধান্ত।'],
    ['নির্মিতিতে নিজের ভাষার গুরুত্ব কী?', 'কেবল মুখস্থ নয় — বোধ ও ভাষাদক্ষতা প্রকাশ পায় বলে নির্মিতি সৃজনশীল শিক্ষার মানদণ্ড।'],
  ],
};

// ---------- English 1st Paper ----------
const eng1_c1 = {
  d: 'Unit 1 — Personal Communication & Self-Reliance: greeting, introduction and depending on one\'s own efforts.',
  p: 'Greeting|an expression of welcome or courtesy;Introduction|presenting oneself to others;Self-reliance|depending on one\'s own efforts;Dignity of labour|respect for all honest work;Confidence|belief in one\'s own ability;Etiquette|accepted social behaviour',
  m: [
    ['"How do you do?" is —', ['a formal greeting', 'an informal shout', 'a farewell', 'a complaint'], 0, '"How do you do?" is used in formal first meetings.'],
    ['Depending on one\'s own efforts is called —', ['self-reliance', 'selfishness', 'show-off', 'short-cut'], 0, 'Self-reliance means doing for oneself.'],
    ['Respect for all honest work is —', ['dignity of labour', 'duty of officer', 'debt of labour', 'degree of law'], 0, 'No honest work is shameful.'],
    ['A conversation between two people is called —', ['dialogue', 'monologue', 'lecture', 'silence'], 0, 'Dialogue is a two-way conversation.'],
  ],
  q: [
    ['Write a short dialogue introducing yourself to a new classmate.', 'Include greeting, name, class, hobbies and closing — e.g. "Hi! I am Arafat from Class 9."'],
    ['Write five sentences on why self-reliance is important for students.', 'Should mention independence, skill, confidence, dignity of labour and future success.'],
  ],
};
const eng1_c2 = {
  d: 'Unit 2 — Pastimes, Festivals & Adolescence: hobbies, celebrations and the teenage stage.',
  p: 'Pastime|an activity done for enjoyment;Festival|a special day of celebration;Adolescence|the period between childhood and adulthood;Peer pressure|influence of friends of the same age;Culture|customs and lifestyle of a society;Tradition|beliefs passed through generations',
  m: [
    ['An activity done for enjoyment is a —', ['pastime', 'profession', 'punishment', 'promise'], 0, 'Pastimes are done for pleasure, not for pay.'],
    ['The period between childhood and adulthood is —', ['adolescence', 'adulthood', 'infancy', 'old age'], 0, 'Adolescence is the teenage stage of growth.'],
    ['Influence of same-age friends is called —', ['peer pressure', 'parent pressure', 'public pressure', 'past pressure'], 0, 'Peers can push both good and bad habits.'],
    ['Customs and lifestyle of a society make up its —', ['culture', 'climate', 'currency', 'census'], 0, 'Culture includes customs, food, dress and arts.'],
  ],
  q: [
    ['Write five sentences about your favourite festival.', 'Name, time, activities, foods and why you enjoy it.'],
    ['How can a teenager face peer pressure? Explain in five sentences.', 'By self-confidence, choosing good friends, saying "no" politely, keeping goals and seeking adult advice.'],
  ],
};
const eng1_c3 = {
  d: 'Poem & Literature — poetic devices, theme and appreciation.',
  p: 'Poem|a composition in verse;Theme|the central idea of a poem;Rhyme|repetition of similar end sounds;Simile|comparison using like or as;Metaphor|comparison without using like/as;Stanza|a group of lines in a poem',
  m: [
    ['Comparison using "like" or "as" is a —', ['simile', 'metaphor', 'rhyme', 'stanza'], 0, 'Similes compare with "like/as"; metaphors do not.'],
    ['The central idea of a poem is its —', ['theme', 'title', 'rhyme', 'length'], 0, 'Theme is what the poem is really about.'],
    ['A group of lines in a poem is a —', ['stanza', 'sentence', 'story', 'stage'], 0, 'Stanzas divide poems into units.'],
    ['"The moon smiled" is an example of —', ['personification', 'simile', 'rhyme', 'prose'], 0, 'A non-human thing given human action — personification.'],
  ],
  q: [
    ['Write a simile and a metaphor of your own.', 'Simile: He is as brave as a lion. Metaphor: Life is a journey.'],
    ['What is imagery in poetry?', 'Words that create sensory pictures in the reader\'s mind, e.g. "golden fields of paddy".'],
  ],
};

// ---------- English 2nd Paper ----------
const eng2_c1 = {
  d: 'Reading Comprehension — understanding unseen passages, main idea and vocabulary.',
  p: 'Passage|a short piece of written text;Main idea|the central point of a passage;Detail|a small piece of information;Skimming|reading quickly to get the main idea;Scanning|reading to find specific information;Context|words around a word that help explain it',
  m: [
    ['The central point of a passage is its —', ['main idea', 'length', 'title only', 'font'], 0, 'Main idea is what the passage is mostly about.'],
    ['Reading quickly to get the main idea is —', ['skimming', 'scanning', 'singing', 'skipping'], 0, 'Skimming gives the overall picture fast.'],
    ['Reading to find specific information is —', ['scanning', 'skimming', 'sleeping', 'sketching'], 0, 'Scanning searches for particular facts (dates, names).'],
    ['Words around a word that help explain it are its —', ['context', 'content', 'contest', 'contact'], 0, 'Context clues help guess meaning.'],
  ],
  q: [
    ['What is the difference between skimming and scanning?', 'Skimming = fast reading for the main idea; scanning = searching for specific information.'],
    ['Guess the meaning of "generous" from context: "The generous man shared his food with the poor."', 'Generous means kind and willing to give/share.'],
  ],
};
const eng2_c2 = {
  d: 'Grammar — Tense, Voice and Narration rules with application.',
  p: 'Tense|the form of verb showing time;Active voice|subject does the action;Passive voice|subject receives the action;Direct speech|exact words of the speaker;Indirect speech|reported form of the speaker\'s words;Auxiliary verb|helping verb with main verb',
  m: [
    ['The form of verb showing time is —', ['tense', 'trend', 'tone', 'title'], 0, 'Tense shows present, past or future.'],
    ['In passive voice the subject —', ['receives the action', 'does the action', 'ignores the action', 'doubles the action'], 0, 'Passive: "The letter was written by him."'],
    ['He said, "I am ill." Indirect: He said that he ___ ill.', ['was', 'is', 'were', 'are'], 0, 'Present tense changes to past in indirect speech.'],
    ['Choose passive form: "They play cricket."', ['Cricket is played by them', 'Cricket plays them', 'Cricket was played', 'Cricket has play'], 0, 'Simple present passive: is/am/are + past participle.'],
  ],
  q: [
    ['Change the voice: "She sings a song."', 'A song is sung by her.'],
    ['Change into indirect speech: Rana said, "I go to school daily."', 'Rana said that he goes/went to school daily.'],
  ],
};
const eng2_c3 = {
  d: 'Writing — Paragraph, Letter and Composition skills.',
  p: 'Paragraph|a group of sentences on one topic;Letter|written message to a person;Application|formal letter to authority;Composition|a longer structured writing;Topic sentence|the sentence stating the main idea;Conclusion|the ending part of writing',
  m: [
    ['A group of sentences on one topic is a —', ['paragraph', 'phrase', 'prefix', 'puzzle'], 0, 'A paragraph develops a single idea.'],
    ['The sentence stating the main idea is the —', ['topic sentence', 'closing sentence', 'quotation', 'question'], 0, 'It usually comes first in a paragraph.'],
    ['A formal letter to authority is an —', ['application', 'invitation card', 'advertisement', 'autobiography'], 0, 'Applications request something officially.'],
    ['The ending part of writing is the —', ['conclusion', 'introduction', 'heading', 'salutation'], 0, 'Conclusion wraps up the whole idea.'],
  ],
  q: [
    ['Write an application to the Headmaster for three days\' leave.', 'Include date, address, subject, salutation, body and closing — polite formal tone.'],
    ['Write a paragraph on "Tree Plantation" with a topic sentence.', 'Start with the main idea (importance of trees), then benefits, then conclusion.'],
  ],
};

export const BAN_ENG_CONTENT = {
  cls9_ban1_c1: ban1_c1, cls9_ban1_c2: ban1_c2, cls9_ban1_c3: ban1_c3,
  cls10_ban1_c1: ban1_c1, cls10_ban1_c2: ban1_c2, cls10_ban1_c3: ban1_c3,
  cls9_ban2_c1: ban2_c1, cls9_ban2_c2: ban2_c2, cls9_ban2_c3: ban2_c3,
  cls10_ban2_c1: ban2_c1, cls10_ban2_c2: ban2_c2, cls10_ban2_c3: ban2_c3,
  cls9_eng1_c1: eng1_c1, cls9_eng1_c2: eng1_c2, cls9_eng1_c3: eng1_c3,
  cls10_eng1_c1: eng1_c1, cls10_eng1_c2: eng1_c2, cls10_eng1_c3: eng1_c3,
  cls9_eng2_c1: eng2_c1, cls9_eng2_c2: eng2_c2, cls9_eng2_c3: eng2_c3,
  cls10_eng2_c1: eng2_c1, cls10_eng2_c2: eng2_c2, cls10_eng2_c3: eng2_c3,
};
