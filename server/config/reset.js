import { pool } from '../config/database.js'
import './dotenv.js'
import booksData from '../data/books.js'

// create books
const createBooksTable = async () => {
    const createBooksTableQuery = `
        CREATE TABLE IF NOT EXISTS books (
        id serial PRIMARY KEY,
        name varchar(100) NOT NULL,
        author varchar(100) NOT NULL,
        image text NOT NULL,
        description text NOT NULL
    );
    `

    try {
        await pool.query(createBooksTableQuery)
        console.log('🎉 books table created successfully')
    } catch (err) {
        console.error('⚠️ error creating books table', err)
    }
}


// create readers
const createReadersTable = async () => {
    const createReadersTableQuery = `
        CREATE TABLE IF NOT EXISTS readers (
        id serial PRIMARY KEY,
        name varchar(100) NOT NULL,
        address text NOT NULL, 
        tel text,
        bio text
    );
    `

    try {
        await pool.query(createReadersTableQuery)
        console.log('🎉 readers table created successfully')
    } catch (err) {
        console.error('⚠️ error creating readers table', err)
    }
}

// create readers_books
const createReadersBooksTable = async () => {
    const createReadersBooksTableQuery = `
        CREATE TABLE IF NOT EXISTS ReadersBooks (
        reader_id int NOT NULL,
        book_id int NOT NULL,
        PRIMARY KEY (reader_id, book_id),
        FOREIGN KEY (reader_id) REFERENCES readers(id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES books(id) ON UPDATE CASCADE ON DELETE CASCADE
    );
    `

    try {
        await pool.query(createReadersBooksTableQuery)
        console.log('🎉 readers_books table created successfully')
    } catch (err) {
        console.error('⚠️ error creating readers_books table', err)
    }
}


// create reviews
const createReviewssTable = async () => {
    const createReviewsTableQuery = `
        CREATE TABLE IF NOT EXISTS reviews (
        id serial PRIMARY KEY,
        review text NOT NULL,
        rating int DEFAULT 0,
        reader_id int NOT NULL,
        book_id int NOT NULL,
        FOREIGN KEY (reader_id) REFERENCES readers(id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES books(id) ON UPDATE CASCADE ON DELETE CASCADE
    );
    `

    try {
        await pool.query(createReviewsTableQuery)
        console.log('🎉 reviews table created successfully')
    } catch (err) {
        console.error('⚠️ error creating reviews table', err)
    }
}


// seed books table
const seedBooksTable = async () => {
    await createBooksTable()
    booksData.forEach((book)=> {
        const insertQuery = {
            text: 
            `INSERT INTO books (name, author, image, description) VALUES ($1, $2, $3, $4)`
        }

        const values = [
            book.name,
            book.author, 
            book.image,
            book.description
        ]

        pool.query(insertQuery, values, (err, res) => {
            if (err) {
                console.error('⚠️ error inserting book', err)
                return
            }
        
            console.log(`✅ ${book.name} added successfully`)
        })
    })
}

seedBooksTable()
createReadersTable()
createReadersBooksTable()
createReviewssTable()