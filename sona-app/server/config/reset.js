import pool from "./database.js";

const dropTables = `
  DROP TABLE IF EXISTS posts;
  DROP TABLE IF EXISTS follows;
  DROP TABLE IF EXISTS admin;
  DROP TABLE IF EXISTS profile;
  DROP TABLE IF EXISTS artists;
  DROP TABLE IF EXISTS users;
`;

const createTables = `
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'fan',
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE artists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    genre VARCHAR(50),
    photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
  );

  -- one-to-one: artists <-> profile
  CREATE TABLE profile (
    artist_id INTEGER UNIQUE REFERENCES artists(id) ON DELETE CASCADE,
    description TEXT,
    instagram VARCHAR(100),
    twitter VARCHAR(100),
    facebook VARCHAR(100),
    tiktok VARCHAR(100),
    spotify VARCHAR(255)
  );

  -- one-to-one: users <-> artists, via admin
  CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    artist_id INTEGER UNIQUE REFERENCES artists(id) ON DELETE CASCADE
  );

  -- many-to-many join table: users <-> artists
  CREATE TABLE follows (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
    notify_on_release BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, artist_id)
  );

  CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
`;

async function seed() {
  const client = await pool.connect();
  try {
    console.log("Dropping existing tables...");
    await client.query(dropTables);

    console.log("Creating tables...");
    await client.query(createTables);

    console.log("Seeding users...");
    const users = await client.query(`
      INSERT INTO users (username, role) VALUES
        ('testfan', 'fan'),
        ('testadmin', 'artist_admin')
      RETURNING id, username, role;
    `);
    const [fan, testAdmin] = users.rows;

    console.log("Seeding artists...");
    const artists = await client.query(`
      INSERT INTO artists (name, genre, photo) VALUES
        ('Test Artist 1', 'Pop', 'https://picsum.photos/seed/artist1/400/400'),
        ('Test Artist 2', 'Rock', 'https://picsum.photos/seed/artist2/400/400'),
        ('Test Artist 3', 'Hip-Hop', 'https://picsum.photos/seed/artist3/400/400')
      RETURNING id, name;
    `);
    const [artist1, artist2, artist3] = artists.rows;

    console.log("Seeding profiles...");
    await client.query(
      `INSERT INTO profile (artist_id, description, instagram, twitter, spotify) VALUES
        ($1, 'Placeholder bio for Test Artist 1.', '@testartist1', '@testartist1', 'https://open.spotify.com/artist/example1'),
        ($2, 'Placeholder bio for Test Artist 2.', '@testartist2', '@testartist2', 'https://open.spotify.com/artist/example2'),
        ($3, 'Placeholder bio for Test Artist 3.', '@testartist3', '@testartist3', 'https://open.spotify.com/artist/example3')
      `,
      [artist1.id, artist2.id, artist3.id],
    );

    console.log("Seeding admin link...");
    await client.query(
      `INSERT INTO admin (user_id, artist_id) VALUES ($1, $2)`,
      [testAdmin.id, artist1.id],
    );

    console.log("Seeding follows...");
    await client.query(
      `INSERT INTO follows (user_id, artist_id) VALUES ($1, $2), ($1, $3)`,
      [fan.id, artist1.id, artist3.id],
    );

    console.log("Seeding posts...");
    await client.query(
      `INSERT INTO posts (artist_id, content) VALUES
        ($1, 'Placeholder post from Test Artist 1.'),
        ($2, 'Placeholder post from Test Artist 2.')
      `,
      [artist1.id, artist2.id],
    );

    console.log("✅ Database reset and seeded successfully.");
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
