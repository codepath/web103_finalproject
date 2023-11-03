import { pool } from '../config/database.js'
import './dotenv.js'
import booksData from '../data/books.js'

const createBooksTable = async () => {
    const createBooksTableQuery = `
    DROP TABLE IF EXISTS books;
        CREATE TABLE IF NOT EXISTS books (
            id serial PRIMARY KEY,
            name varchar(100) NOT NULL,
            author varchar(100) NOT NULL,
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

const seedBooksTable = async () => {
    await createBooksTable()
    booksData.forEach((book)=> {
        const insertQuery = {
            text: 
            `INSERT INTO books (name, author, description) VALUES ($1, $2, $3)`
        }

        const values = [
            book.name,
            book.author, 
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