import { pool } from './database.js'
import './dotenv.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'

const currentPath = fileURLToPath(import.meta.url)
const moviesFile = fs.readFileSync(path.join(dirname(currentPath), '../config/data/data.json'))
const moviesData = JSON.parse(moviesFile)

const currentPathTag = fileURLToPath(import.meta.url)
const tagsFile = fs.readFileSync(path.join(dirname(currentPathTag), '../config/data/data_tag.json'))
const tagsData = JSON.parse(tagsFile)



const createMoviesTable = async () => {
    const createMoviesTableQuery = `
        DROP TABLE IF EXISTS movies CASCADE;

        CREATE TABLE IF NOT EXISTS movies (
            movie_id serial PRIMARY KEY,
            title varchar(500) NOT NULL,
            description text NOT NULL,
            tag varchar(100) NOT NULL,
            actors text NOT NULL,
            director varchar(100),
            publish_date date,
            img_url text NOT NULL,
            trailer_url text NOT NULL
        );
    `

    try {
        const res = await pool.query(createMoviesTableQuery)
        console.log('🎉 Movies table created successfully')
    } catch (err) {
        console.error('⚠️ error creating movies table', err)
    }
}

const seedMoviesTable = async () => {
    await createMoviesTable();

    for (const movie of moviesData) {
        const insertQuery = {
            text: 'INSERT INTO movies (title, description, tag, actors, director, publish_date, img_url, trailer_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING movie_id',
            values: [
                movie.title,
                movie.description,
                movie.tag,
                movie.actors,
                movie.director,
                movie.publish_date,
                movie.img_url,
                movie.trailer_url
            ]
        };

        try {
            const res = await pool.query(insertQuery);
            console.log(`✅ ${movie.title} added successfully`);

            // Assuming that tagsData is an array of genres such as ["Action", "Drama"]
            const tag = tagsData.find(t => t.genre === movie.tag);
            if (tag) {
                const insertMoviesTagsQuery = {
                    text: 'INSERT INTO movies_tags (movie_id, tag_id) VALUES ($1, $2)',
                    values: [res.rows[0].movie_id, tag.tag_id]
                };
                await pool.query(insertMoviesTagsQuery);
                console.log(`✅ ${movie.title} added successfully to movies_tags`);
            }
        }
        catch (err) {
            console.error(`⚠️ Error inserting movie: ${movie.title}`, err);
        }
    }
}


const createWishlistTable = async () => {
    const createWishlistTableQuery = `
        DROP TABLE IF EXISTS wishlist CASCADE;

        CREATE TABLE IF NOT EXISTS wishlist (
            user_id int,
            movie_id int
        );
    `

    try {
        const res = await pool.query(createWishlistTableQuery)
        console.log('🎉 Wishlist table created successfully')
    } catch (err) {
        console.error('⚠️ error creating wishlist table', err)
    }

}

const createTagsTables = async () => {
    const createTagsTableQuery = `
        DROP TABLE IF EXISTS tags CASCADE;

        CREATE TABLE IF NOT EXISTS tags (
            tag_id serial PRIMARY KEY,
            genre varchar(100)
        );
    `
    const createMoviesTagsTableQuery = `
    DROP TABLE IF EXISTS movies_tags CASCADE;
      
    CREATE TABLE IF NOT EXISTS movies_tags (
        movie_id int NOT NULL,
        tag_id int NOT NULL,
        PRIMARY KEY (movie_id, tag_id),
        FOREIGN KEY (movie_id) REFERENCES movies(movie_id) 
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(tag_id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
      );
    `

    try {
        await pool.query(createTagsTableQuery)
        console.log('🎉 Tags table created successfully')

        await pool.query(createMoviesTagsTableQuery)
        console.log('🎉 movies_tags table created successfully')
    } catch (err) {
        console.error('⚠️ error creating tags table or movies_tags table', err)
    }
}


const seedTagsTable = async () => {
    await createTagsTables();

    for (const tag of tagsData) {
        // Make sure to include tag_id in the insert statement
        const insertQuery = {
            text: 'INSERT INTO tags (tag_id, genre) VALUES ($1, $2)',
            values: [tag.tag_id, tag.genre]
        };

        try {
            await pool.query(insertQuery);
            console.log(`✅ Genre: ${tag.genre} with ID: ${tag.tag_id} added successfully`);
        } catch (err) {
            console.error(`⚠️ Error inserting tag: ${tag.genre}`, err);
        }
    }

    await seedMoviesTable();
}



const createUsersTable = async () => {
    const createUsersTableQuery = `
        DROP TABLE IF EXISTS users CASCADE;
        
        CREATE TABLE IF NOT EXISTS users (
            id serial PRIMARY KEY,
            fullname varchar(100) NOT NULL,
            username varchar(50) NOT NULL,
            password varchar(100) NOT NULL,
            email varchar(100) NOT NULL
        );
    `

    try {
        const res = await pool.query(createUsersTableQuery)
        console.log('🎉 users table created successfully')
    }
    catch (err) {
        console.error('⚠️ error creating users table', err)
    }
}


const seedUsersTable = async () => {
    await createUsersTable();

    const insertQuery = {
        text: 'INSERT INTO users (fullname, username, password, email) VALUES ($1, $2, $3, $4) RETURNING id',
        values: ['Admin', 'admin', 'thisisadmin', 'iamadmin@gmail.com']
    };

    try {
        const res = await pool.query(insertQuery);
        console.log(`✅ Admin added successfully`);
        
    } catch (err) {
        console.error(`⚠️ Error inserting admin or creating wishlist`, err);
    }
}


createWishlistTable()
seedTagsTable()
seedUsersTable()
// seedMoviesTable()
