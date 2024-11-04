import pool from './database.js'
import clubsData from '../data/clubs.js'
import eventsData from '../data/events.js'
import boardMembersData from '../data/board_members.js'
import categoriesData from '../data/categories.js'
import imagesData from '../data/images.js'
import locationsData from '../data/locations.js'
import clubEventsData from '../data/club_events.js'

const createTables = async () => {
  const createTablesQuery = `
    DROP TABLE IF EXISTS
      club_events,
      club_locations,
      club_board_members,
      club_categories,
      club_images,
      event_locations,
      event_categories,
      event_images,
      board_members,
      categories,
      locations,
      images,
      clubs,
      events
    CASCADE;

    CREATE TABLE IF NOT EXISTS clubs (
      id SERIAL PRIMARY KEY,
      name VARCHAR(250) NOT NULL,
      description TEXT,
      email VARCHAR(250)
    );

    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      name VARCHAR(250) NOT NULL,
      start_time TIMESTAMPTZ,
      end_time TIMESTAMPTZ,
      description TEXT,
      capacity INT,
      registered INT
    );

    CREATE TABLE IF NOT EXISTS locations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT
    );

    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(250) NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS board_members (
      id SERIAL PRIMARY KEY,
      fullname VARCHAR(250) NOT NULL,
      introduction TEXT,
      email TEXT
    );

    CREATE TABLE IF NOT EXISTS images (
      id SERIAL PRIMARY KEY,
      name VARCHAR(250),
      url TEXT NOT NULL,
      taken_date DATE
    );

    CREATE TABLE IF NOT EXISTS club_locations (
      club_id INT,
      location_id INT,
      PRIMARY KEY(club_id, location_id),
      CONSTRAINT fk_club
        FOREIGN KEY(club_id)
        REFERENCES clubs(id)
        ON DELETE CASCADE,
      CONSTRAINT fk_location
        FOREIGN KEY(location_id)
        REFERENCES locations(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS club_board_members (
      club_id INT,
      board_member_id INT,
      PRIMARY KEY(club_id, board_member_id),
      CONSTRAINT fk_club
        FOREIGN KEY(club_id)
        REFERENCES clubs(id)
        ON DELETE CASCADE,
      CONSTRAINT fk_board_member
        FOREIGN KEY(board_member_id)
        REFERENCES board_members(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS club_categories (
      club_id INT,
      category_id INT,
      PRIMARY KEY(club_id, category_id),
      CONSTRAINT fk_club
        FOREIGN KEY(club_id)
        REFERENCES clubs(id)
        ON DELETE CASCADE,
      CONSTRAINT fk_category
        FOREIGN KEY(category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS club_images (
      club_id INT,
      image_id INT,
      PRIMARY KEY(club_id, image_id),
      CONSTRAINT fk_club
        FOREIGN KEY(club_id)
        REFERENCES clubs(id)
        ON DELETE CASCADE,
      CONSTRAINT fk_image
        FOREIGN KEY(image_id)
        REFERENCES images(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS event_locations (
      event_id INT,
      location_id INT,
      PRIMARY KEY(event_id, location_id),
      CONSTRAINT fk_event
        FOREIGN KEY(event_id)
        REFERENCES events(id)
        ON DELETE CASCADE,
      CONSTRAINT fk_location
        FOREIGN KEY(location_id)
        REFERENCES locations(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS event_categories (
      event_id INT,
      category_id INT,
      PRIMARY KEY(event_id, category_id),
      CONSTRAINT fk_event
        FOREIGN KEY(event_id)
        REFERENCES events(id)
        ON DELETE CASCADE,
      CONSTRAINT fk_category
        FOREIGN KEY(category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS event_images (
      event_id INT,
      image_id INT,
      PRIMARY KEY(event_id, image_id),
      CONSTRAINT fk_event
        FOREIGN KEY(event_id)
        REFERENCES events(id)
        ON DELETE CASCADE,
      CONSTRAINT fk_image
        FOREIGN KEY(image_id)
        REFERENCES images(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS club_events (
      club_id INT,
      event_id INT,
      PRIMARY KEY(club_id, event_id),
      CONSTRAINT fk_club
        FOREIGN KEY(club_id)
        REFERENCES clubs(id)
        ON DELETE CASCADE,
      CONSTRAINT fk_event
        FOREIGN KEY(event_id)
        REFERENCES events(id)
        ON DELETE CASCADE
    );
  `

  try {
    const res = await pool.query(createTablesQuery)
    console.log('tables created successfully')
  } catch (err) {
    console.error('error creating tables', err)
  }
}

const seedMainTablesData = async () => {
  await createTables()

  boardMembersData.forEach(member => {
    const insertQuery = `
      INSERT INTO board_members (fullname, introduction, email)
      VALUES ($1, $2, $3)
    `
    const values = [
      member.fullname,
      member.introduction,
      member.email
    ]
    pool.query(insertQuery, values, (err, _) => {
      if (err) {
        console.error('error inserting board_member', err)
      }
    })
  })

  categoriesData.forEach(category => {
    const insertQuery = `
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
    `
    const values = [
      category.name,
      category.description
    ]
    pool.query(insertQuery, values, (err, _) => {
      if (err) {
        console.error('error inserting categories', err)
      }
    })
  })

  locationsData.forEach(location => {
    const insertQuery = `
      INSERT INTO locations (name, address)
      VALUES ($1, $2)
    `
    const values = [
      location.name,
      location.address
    ]
    pool.query(insertQuery, values, (err, _) => {
      if (err) {
        console.error('error inserting locations', err)
      }
    })
  })

  imagesData.forEach(image => {
    const insertQuery = `
      INSERT INTO images (name, url, taken_date)
      VALUES ($1, $2, $3)
    `
    const values = [
      image.name,
      image.url,
      image.taken_date
    ]
    pool.query(insertQuery, values, (err, _) => {
      if (err) {
        console.error('error inserting images', err)
      }
    })
  })

  clubsData.forEach(club => {
    const insertClubQuery = `
      INSERT INTO clubs (name, description, email)
      VALUES ($1, $2, $3)
    `
    const clubValues = [
      club.name,
      club.description,
      club.email
    ]
    pool.query(insertClubQuery, clubValues, (err, _) => {
      if (err) {
        console.error('error inserting clubs', err)
      }
    })
  })

  eventsData.forEach(event => {
    const insertEventQuery = `
      INSERT INTO events (name, start_time, end_time, description, capacity, registered)
      VALUES ($1, $2, $3, $4, $5, $6)
    `
    const eventValues = [
      event.name,
      event.startTime,
      event.endTime,
      event.description,
      event.capacity,
      event.registered
    ]
    pool.query(insertEventQuery, eventValues, (err, _) => {
      if (err) {
        console.error('error inserting events', err)
      }
    })
  })
}

const seedRelationTablesData = async () => {
  await seedMainTablesData()

  clubsData.forEach(club => {
    club.location.forEach((loc_index) => {
      const loc_name = locationsData[loc_index-1].name
      const insertLocationQuery = `
        INSERT INTO club_locations (club_id, location_id)
        SELECT c.id, l.id
        FROM clubs AS c
        JOIN locations AS l
        ON 1=1
        WHERE c.name = '${club.name}'
          AND l.name = '${loc_name}';
      `
      pool.query(insertLocationQuery, (err, _) => {
        if (err) {
          console.error('error inserting club_locations', err)
        }
      })
    })

    club.category.forEach((category_index) => {
      const category_name = categoriesData[category_index-1].name
      const insertCategoryQuery = `
        INSERT INTO club_categories (club_id, category_id)
        SELECT clubs.id, categories.id
        FROM clubs
        JOIN categories
        ON 1=1
        WHERE clubs.name = '${club.name}'
          AND categories.name = '${category_name}';
      `
      pool.query(insertCategoryQuery, (err, _) => {
        if (err) {
          console.error('error inserting club_categories', err)
        }
      })
    })

    club.board.forEach((board_index) => {
      const board_fullname = boardMembersData[board_index-1].fullname
      const insertBoardQuery = `
        INSERT INTO club_board_members (club_id, board_member_id)
        SELECT clubs.id, board_members.id
        FROM clubs
        JOIN board_members
        ON 1=1
        WHERE clubs.name = '${club.name}'
          AND board_members.fullname = '${board_fullname}';
      `
      pool.query(insertBoardQuery, (err, _) => {
        if (err) {
          console.error('error inserting club_board_members', err)
        }
      })
    })

    club.image.forEach((image_index) => {
      const image_url = imagesData[image_index-1].url
      const insertImageQuery = `
        INSERT INTO club_images (club_id, image_id)
        SELECT clubs.id, images.id
        FROM clubs
        JOIN images
        ON 1=1
        WHERE clubs.name = '${club.name}'
          AND images.url = '${image_url}';
      `
      pool.query(insertImageQuery, (err, _) => {
        if (err) {
          console.error('error inserting club_images', err)
        }
      })
    })

  })

  eventsData.forEach(event => {
    event.location.forEach((loc_index) => {
      const loc_name = locationsData[loc_index-1].name
      const insertLocationQuery = `
        INSERT INTO event_locations (event_id, location_id)
        SELECT e.id, l.id
        FROM events AS e
        JOIN locations AS l
        ON 1=1
        WHERE e.name = '${event.name}'
          AND l.name = '${loc_name}';
      `
      pool.query(insertLocationQuery, (err, _) => {
        if (err) {
          console.error('error inserting event_locations', err)
        }
      })
    })

    event.category.forEach((category_index) => {
      const category_name = categoriesData[category_index-1].name
      const insertCategoryQuery = `
        INSERT INTO event_categories (event_id, category_id)
        SELECT events.id, categories.id
        FROM events
        JOIN categories
        ON 1=1
        WHERE events.name = '${event.name}'
          AND categories.name = '${category_name}';
      `
      pool.query(insertCategoryQuery, (err, _) => {
        if (err) {
          console.error('error inserting event_categories', err)
        }
      })
    })

    event.image.forEach((image_index) => {
      const image_url = imagesData[image_index-1].url
      const insertImageQuery = `
        INSERT INTO event_images (event_id, image_id)
        SELECT events.id, images.id
        FROM events
        JOIN images
        ON 1=1
        WHERE events.name = '${event.name}'
          AND images.url = '${image_url}';
      `
      pool.query(insertImageQuery, (err, _) => {
        if (err) {
          console.error('error inserting event_images', err)
        }
      })
    })

  })

  clubEventsData.forEach((pair) => {
    const club_name = clubsData[pair.club_id - 1].name
    const event_name = eventsData[pair.event_id - 1].name

    const insertClubEventQuery = `
      INSERT INTO club_events (club_id, event_id)
      SELECT c.id, e.id
      FROM clubs AS c
      JOIN events AS e
      ON 1=1
      WHERE c.name = '${club_name}'
        AND e.name = '${event_name}'
    `
    pool.query(insertClubEventQuery, (err, _) => {
      if (err) {
        console.log(insertClubEventQuery)
        console.error('error inserting club_events', err)
      }
    })
  })

}

seedRelationTablesData()