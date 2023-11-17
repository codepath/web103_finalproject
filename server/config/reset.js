import { pool } from '../config/database.js'
import './dotenv.js'


// create books
// DROP TABLE books CASCADE;
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
        book_id int NOT NULL,
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

const createBooksReviewsTable = async () => {
    const createBooksReviewsTableQuery = `
        CREATE TABLE IF NOT EXISTS Books_Reviews (
        book_id int NOT NULL,
        review_id int NOT NULL,
        PRIMARY KEY (book_id, review_id),
        FOREIGN KEY (book_id) REFERENCES books(id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (review_id) REFERENCES reviews(id) ON UPDATE CASCADE ON DELETE CASCADE
    );
    `

    try {
        await pool.query(createBooksReviewsTableQuery)
        console.log('🎉 books_reviews table created successfully')
    } catch (err) {
        console.error('⚠️ error creating books_reviews table', err)
    }
}

// users table
const createUsersTable = async () => {
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id serial PRIMARY KEY,
        githubid integer NOT NULL,
        username varchar(100) NOT NULL,
        avatarurl varchar(500) NOT NULL,
        accesstoken varchar(500) NOT NULL
      );
    `
  
    try {
      const res = await pool.query(createUsersTableQuery)
      console.log('🎉 users table created successfully')
    }
    catch (error) {
      console.error('⚠️ error creating users table', err)
    }
  }
  
  const createBooksUsersTable = async () => {
    const createBooksUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS books_users (
        book_id int NOT NULL,
        user_id int NOT NULL,
        PRIMARY KEY (book_id, user_id),
        FOREIGN KEY (book_id) REFERENCES books(id) ON UPDATE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE
      );
    `
  
    try {
      const res = await pool.query(createBooksUsersTableQuery)
      console.log('🎉 books_users table created successfully')
    }
    catch (error) {
      console.error('⚠️ error creating books_users table', err)
    }
  }
  
  const createUsersBooksTable = async () => {
    const createUsersBooksTableQuery = `
      CREATE TABLE IF NOT EXISTS users_books (
        id serial PRIMARY KEY,
        book_id int NOT NULL,
        username text NOT NULL,
        FOREIGN KEY (book_id) REFERENCES books(id)
      );
    `
  
    try {
        const res = await pool.query(createUsersBooksTableQuery)
        console.log('🎉 users_books table created successfully')
    } catch (err) {
        console.error('⚠️ error creating users_books table', err)
    }
  }




// seed books table
// const seedBooksTable = async () => {
//     await createBooksTable()
//     booksData.forEach((book)=> {
//         const insertQuery = {
//             text: 
//             `INSERT INTO books (name, author, image, description) VALUES ($1, $2, $3, $4)`
//         }

//         const values = [
//             book.name,
//             book.author, 
//             book.image,
//             book.description
//         ]

//         pool.query(insertQuery, values, (err, res) => {
//             if (err) {
//                 console.error('⚠️ error inserting book', err)
//                 return
//             }
        
//             console.log(`✅ ${book.name} added successfully`)
//         })
//     })
// }

// seedBooksTable()
createBooksTable()
createReadersTable()
createReadersBooksTable()
createReviewssTable()
createBooksReviewsTable()
createUsersTable ()
createBooksUsersTable()
createUsersBooksTable ()

