import { db } from '../server/db.mjs';
const rows = db.prepare("SELECT c.id, c.name, COUNT(m.id) n FROM chapters c LEFT JOIN mcq_questions m ON m.chapter_id=c.id GROUP BY c.id HAVING n < 25 ORDER BY n LIMIT 15").all();
console.log(JSON.stringify(rows, null, 1));
const minP = db.prepare('SELECT MIN(n) m FROM (SELECT COUNT(*) n FROM practice_questions GROUP BY chapter_id)').get();
console.log('min practice:', minP.m);
