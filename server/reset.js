import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { closePool, getPool } from './db.js';
import { DEMO_STUDENT } from './students.js';

const categories = [
  ['clubs', 'Clubs'],
  ['academic', 'Academic'],
  ['career', 'Career'],
  ['sports', 'Sports'],
  ['social', 'Social'],
  ['arts', 'Arts'],
];

const samples = [
  ['Club Expo', 'Meet student organizations, explore new interests, and find your campus community at our fall club showcase.', 'clubs', 2, [17, 0], 2, [20, 0], 'Student Union Plaza', 'Student Activities Board', '/images/club-expo.jpg'],
  ['Guest Lecture: AI & Society', 'Join a guest speaker for a conversation about artificial intelligence, ethics, and its impact on everyday life.', 'academic', 3, [22, 0], 3, [23, 30], 'Science Hall Auditorium', 'Department of Computer Science', '/images/lecture.jpg'],
  ['Fall Career Fair', 'Connect with employers, discover internships, and learn about career opportunities. Bring your resume.', 'career', 6, [16, 0], 6, [21, 0], 'Campus Recreation Center', 'Career Services', '/images/career-fair.jpg'],
  ['Intramural Soccer Finals', 'Cheer on the finalists as campus teams compete for the intramural soccer championship.', 'sports', 8, [23, 0], 9, [1, 0], 'Campus Soccer Field', 'Intramural Sports', '/images/soccer.jpg'],
  ['Midnight Pancake Study Break', 'Take a break from studying for free pancakes and a relaxed evening with fellow students.', 'social', 10, [5, 0], 10, [7, 0], 'Student Union Dining Hall', 'Residence Hall Association', '/images/pancakes.jpg'],
  ['Open Mic Night', 'Enjoy student music, poetry, and comedy, or step up to the microphone and share your own performance.', 'arts', 11, [1, 0], 11, [3, 0], 'Campus Coffeehouse', 'Arts Collective', '/images/open-mic.jpg'],
];

function upcoming(dayOffset, hour, minute) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + dayOffset);
  date.setUTCHours(hour, minute, 0, 0);
  if (date.getTime() <= Date.now()) date.setUTCDate(date.getUTCDate() + 1);
  return date;
}

export async function resetDatabase() {
  const schema = readFileSync(new URL('./schema.sql', import.meta.url), 'utf8');
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    await client.query('DROP TABLE IF EXISTS rsvps, students, events, categories CASCADE');
    await client.query(schema);
    for (const [slug, name] of categories) {
      await client.query('INSERT INTO categories (slug, name) VALUES ($1, $2)', [slug, name]);
    }
    for (const [title, description, slug, startDay, startClock, endDay, endClock, location, host, imageUrl] of samples) {
      await client.query(
        `INSERT INTO events (category_id, title, description, location, host, image_url, starts_at, ends_at)
         SELECT id, $2, $3, $4, $5, $6, $7, $8 FROM categories WHERE slug = $1`,
        [slug, title, description, location, host, imageUrl, upcoming(startDay, ...startClock), upcoming(endDay, ...endClock)],
      );
    }
    await client.query('INSERT INTO students (name, email) VALUES ($1, $2)', [DEMO_STUDENT.name, DEMO_STUDENT.email]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

const entry = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';
if (import.meta.url === entry) {
  resetDatabase()
    .then(async () => {
      console.log('Reset the School.Event database.');
      await closePool();
    })
    .catch(async (error) => {
      console.error(error.message);
      await closePool();
      process.exitCode = 1;
    });
}
