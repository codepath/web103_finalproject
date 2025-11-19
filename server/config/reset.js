import 'dotenv/config';
import { pool } from './database.js';

//create table queries

/*
dbdiagram.io structure:

Table users {
  id integer [primary key]
  username varchar
  password varchar
  points integer
}

Table habits {
  id integer [primary key]
  user_id integer [not null]
  title varchar
  description text [note: 'Description of the habit']
}

Table tags {
  id integer [primary key]
  name varchar
}

Table habitTags { //join table
  habit_id integer [not null]
  tag_id integer [not null]
}

Table stickers {
  id integer [primary key]
  name varchar
  price integer
  image_url url
}

Table userStickers {
  user_id integer [not null]
  sticker_id integer [not null]
}

Ref user_habits: habits.user_id > users.id // many-to-one

Ref link_habit_id_to_habitTag: habitTags.habit_id > habits.id

Ref link_tag_id_to_habitTag: habitTags.tag_id > tags.id

Ref link_user_id_to_userStickers: userStickers.user_id > users.id

Ref link_sticker_id_to_userStickers: userStickers.sticker_id > stickers.id

*/

const reset = async () => {
  try {
    await pool.query(`
      DROP TABLE IF EXISTS habit_tags;
      DROP TABLE IF EXISTS user_stickers;
      DROP TABLE IF EXISTS habits;
      DROP TABLE IF EXISTS tags;
      DROP TABLE IF EXISTS stickers;
      DROP TABLE IF EXISTS users;

      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        points INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE habits (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(120) NOT NULL,
        description TEXT
      );

      CREATE TABLE tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
      );

      CREATE TABLE habit_tags (
        habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
        tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (habit_id, tag_id)
      );

      CREATE TABLE stickers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        price INTEGER NOT NULL CHECK (price >= 0),
        image_url TEXT
      );

      CREATE TABLE user_stickers (
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        sticker_id INTEGER NOT NULL REFERENCES stickers(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, sticker_id)
      );
    `);

    // minimal seed: 1 user + 1 tag + 1 sticker (for testing UI)

    await pool.query(`
    INSERT INTO users (username, password, points)
    VALUES ('demo', '$2b$10$examplehash', 50)
    ON CONFLICT (username) DO UPDATE
      SET points = EXCLUDED.points;

    INSERT INTO tags (name) VALUES ('sample') ON CONFLICT DO NOTHING;

    -- global store stickers
    INSERT INTO stickers (name, price, image_url) VALUES
      ('Gold Star', 50, 'https://media.istockphoto.com/id/1457587098/vector/sticker-of-a-cute-cartoon-gold-star.jpg?s=612x612&w=0&k=20&c=QGPV_wTT2GLRJ2JoFa1cS8qRId4dLi9TKq6XP76mMyE='),
      ('Flame',     75, 'https://dejpknyizje2n.cloudfront.net/media/carstickers/versions/large-flame-sticker-u9940-x450.png'),
      ('Rocket',   120, 'https://dejpknyizje2n.cloudfront.net/media/carstickers/versions/cartoon-spaceship-rocket-sticker-u0e4d-x450.png')
    ON CONFLICT (name) DO NOTHING;
`);

    console.log('✅ schema reset; minimal seed inserted');
  } finally {
    await pool.end();
  }
};

reset();
