import pool from "./database.js";

const dropTables = `
  DROP TABLE IF EXISTS posts CASCADE;
  DROP TABLE IF EXISTS follows CASCADE;
  DROP TABLE IF EXISTS merch CASCADE;
  DROP TABLE IF EXISTS admin CASCADE;
  DROP TABLE IF EXISTS profile CASCADE;
  DROP TABLE IF EXISTS artists CASCADE;
  DROP TABLE IF EXISTS users CASCADE;
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

  CREATE TABLE merch (
    id SERIAL PRIMARY KEY,
    artist_id INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    photo VARCHAR(255),
    stock INTEGER NOT NULL DEFAULT 0,
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
        ('testadmin', 'artist')
      RETURNING id, username, role;
    `);
    const [fan, testAdmin] = users.rows;

    console.log("Seeding artists...");
    const artists = await client.query(`
      INSERT INTO artists (name, genre, photo) VALUES
        ('Test Artist 1', 'Pop', 'https://picsum.photos/seed/artist1/400/400'),
        ('Test Artist 2', 'Rock', 'https://picsum.photos/seed/artist2/400/400'),
        ('Test Artist 3', 'Hip-Hop', 'https://picsum.photos/seed/artist3/400/400'),
        ('Test Artist 4', 'R&B', 'https://picsum.photos/seed/artist4/400/400'),
        ('Test Artist 5', 'Indie', 'https://picsum.photos/seed/artist5/400/400'),
        ('Test Artist 6', 'Electronic', 'https://picsum.photos/seed/artist6/400/400'),
        ('Test Artist 7', 'Jazz', 'https://picsum.photos/seed/artist7/400/400')
      RETURNING id, name;
    `);
    const [artist1, artist2, artist3, artist4, artist5, artist6, artist7] =
      artists.rows;

    console.log("Seeding merch...");
    await client.query(
      `INSERT INTO merch (artist_id, name, type, price, photo, stock) VALUES
    ($1, 'Tour T-Shirt', 'apparel', 25.00, 'https://picsum.photos/seed/merch1/400/400', 50),
    ($1, 'Vinyl Record', 'music', 30.00, 'https://picsum.photos/seed/merch2/400/400', 20),
    ($2, 'Hoodie', 'apparel', 45.00, 'https://picsum.photos/seed/merch3/400/400', 30),
    ($2, 'Poster', 'accessory', 15.00, 'https://picsum.photos/seed/merch4/400/400', 100),
    ($3, 'Snapback Hat', 'apparel', 28.00, 'https://picsum.photos/seed/merch5/400/400', 40),
    ($4, 'Band Tee', 'apparel', 35.00, 'https://picsum.photos/seed/merch6/400/400', 25),
    ($5, 'Concert Ticket', 'accessory', 50.00, 'https://picsum.photos/seed/merch7/400/400', 10)
  `,
      [artist1.id, artist2.id, artist3.id, artist4.id, artist5.id],
    );

    console.log("Seeding profiles...");
    await client.query(
      `INSERT INTO profile (artist_id, description, instagram, twitter, facebook, tiktok, spotify) VALUES
  ($1, 'Placeholder bio for Test Artist 1.', '@testartist1', '@testartist1', '@testartist1fb', '@testartist1tt', 'https://open.spotify.com/artist/example1'),
  ($2, 'Placeholder bio for Test Artist 2.', '@testartist2', '@testartist2', '@testartist2fb', '@testartist2tt', 'https://open.spotify.com/artist/example2'),
  ($3, 'Placeholder bio for Test Artist 3.', '@testartist3', '@testartist3', '@testartist3fb', '@testartist3tt', 'https://open.spotify.com/artist/example3'),
  ($4, 'Placeholder bio for Test Artist 4.', '@testartist4', '@testartist4', '@testartist4fb', '@testartist4tt', 'https://open.spotify.com/artist/example4'),
  ($5, 'Placeholder bio for Test Artist 5.', '@testartist5', '@testartist5', '@testartist5fb', '@testartist5tt', 'https://open.spotify.com/artist/example5'),
  ($6, 'Placeholder bio for Test Artist 6.', '@testartist6', '@testartist6', '@testartist6fb', '@testartist6tt', 'https://open.spotify.com/artist/example6'),
  ($7, 'Placeholder bio for Test Artist 7.', '@testartist7', '@testartist7', '@testartist7fb', '@testartist7tt', 'https://open.spotify.com/artist/example7')
      `,
      [
        artist1.id,
        artist2.id,
        artist3.id,
        artist4.id,
        artist5.id,
        artist6.id,
        artist7.id,
      ],
    );

    console.log("Seeding admin link...");
    await client.query(
      `INSERT INTO admin (user_id, artist_id) VALUES ($1, $2)`,
      [testAdmin.id, artist1.id],
    );

    console.log("Seeding follows...");
    await client.query(
      `INSERT INTO follows (user_id, artist_id) VALUES ($1, $2), ($1, $3), ($1, $4)`,
      [fan.id, artist1.id, artist3.id, artist5.id],
    );

    console.log("Seeding posts...");
    await client.query(
      `INSERT INTO posts (artist_id, content) VALUES
        ($1, 'Placeholder post from Test Artist 1.'),
        ($2, 'Placeholder post from Test Artist 2.'),
        ($3, 'Placeholder post from Test Artist 3.')
      `,
      [artist1.id, artist2.id, artist3.id],
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
