
import { pool } from "./database.js";
import './dotenv.js'


const createQuestionTable = async () => {
    // every question should have a user associated with it
    const createQuestionTableQuery = `
        DROP TABLE IF EXISTS questions;

        CREATE TABLE IF NOT EXISTS questions (
            id serial PRIMARY KEY,
            title text,
            role text,
            requirements text,
            qualifications text,
            technical BOOLEAN,
            behavioral BOOLEAN,
            qList text
            )`
    try {
        const res = await pool.query(createQuestionTableQuery)
        console.log('🎉 Question table created successfully')
    }
    catch (err) {
      console.error('⚠️ error creating question table', err)
    }
}

createQuestionTable()