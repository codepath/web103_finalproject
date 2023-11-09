import { pool } from './database.js'
import './dotenv.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'

const currentPath = fileURLToPath(import.meta.url)
const moviesFile = fs.readFileSync(path.join(dirname(currentPath), '../config/data/data.json'))
const moviesData = JSON.parse(moviesFile)



const createMoviesTable = async () => {
    const createMoviesTableQuery = `
        CREATE TABLE IF NOT EXISTS movies (
            movie_id serial PRIMARY KEY,
            title varchar(500) NOT NULL,
            description text NOT NULL,
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
    await createMoviesTable()
  
    moviesData.forEach((movie) => {
        const insertQuery = {
            text: 'INSERT INTO movies (title, description, actors, director, publish_date, img_url, trailer_url) VALUES ($1, $2, $3, $4, $5, $6, $7)'
        }
        
        const values = [
            movie.title,
            movie.description,
            movie.actors,
            movie.director,
            movie.publish_date,
            movie.img_url,
            movie.trailer_url
        ]
        
        try {
            pool.query(insertQuery, values)
            console.log(`✅ ${movie.title} added successfully`)
        }
        catch (err) {
            console.error('⚠️ error inserting movies', err)
        }
    })
}


const createWishlistTable = async () => {
    const createWishlistTableQuery = `
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
        CREATE TABLE IF NOT EXISTS tags (
            tag_id serial PRIMARY KEY,
            genre varchar(100)
        );
    `
    const createMoviesTagsTableQuery = `
      CREATE TABLE IF NOT EXISTS movies_tags (
        movie_id int NOT NULL,
        tag_id int NOT NULL,
        PRIMARY KEY (movie_id, tag_id),
        FOREIGN KEY (movie_id) REFERENCES movies(movie_id) 
            ON UPDATE CASCADE
            On DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON UPDATE CASCADE
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




const createUsersTable = async () => {
    const createUsersTableQuery = `
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


seedMoviesTable()
createUsersTable()
createWishlistTable()
createTagsTables()









