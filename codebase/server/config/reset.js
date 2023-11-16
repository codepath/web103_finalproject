import { pool } from './database.js'
import './dotenv.js'

// const createItemsTable = async () => {
//     const createItemsTableQuery = `
//     CREATE TABLE IF NOT EXISTS items (
//         id serial PRIMARY KEY,
//         title varchar(100) NOT NULL,
//         description varchar(500),
//         img_url text NOT NULL,
//         quantity integer,
//         price money NOT NULL,
//         color varchar(100),
//         type varchar(100) NOT NULL,
//         metal varchar(100)
//     );
//     `
//     try {
//         const res = await pool.query(createItemsTableQuery)
//         console.log('🎉 items created successfully')
//     } catch (err) {
//         console.error('⚠️ error creating items table', err)
//     }
// }

// const createUsersTable = async () => {
//     const createUsersTableQuery = `
//     CREATE TABLE IF NOT EXISTS users (
//         id serial PRIMARY KEY,
//         email varchar(100) NOT NULL,
//         first_name varchar(100),
//         last_name varchar(100),
//         address varchar(100),
//         city varchar(100),
//         state varchar(100),
//         zip varchar(100),
//         phone varchar(100)
//     );
//     `
//     try {
//         const res = await pool.query(createUsersTableQuery)
//         console.log('🎉 users created successfully')
//     } catch (err) {
//         console.error('⚠️ error creating users table', err)
//     }
// }

const createUsersSavedItemsTable = async () => {
    const createUsersSavedItemsTableQuery = `
    CREATE TABLE IF NOT EXISTS users_saved_items (
        item_id int NOT NULL,
        user_id int NOT NULL,
        PRIMARY KEY (item_id, user_id),
        FOREIGN KEY (item_id) REFERENCES items(id) ON UPDATE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE
    );
    `
    try {
        const res = await pool.query(createUsersSavedItemsTableQuery)
        console.log('🎉 users_saved_items created successfully')
    } catch (err) {
        console.error('⚠️ error creating users_saved_items table', err)
    }
}

const createUserCartItemsTable = async () => {
    const createUserCartItemsTableQuery = `
    CREATE TABLE IF NOT EXISTS users_cart_items (
        item_id int NOT NULL,
        user_id int NOT NULL,
        PRIMARY KEY (item_id, user_id),
        FOREIGN KEY (item_id) REFERENCES items(id) ON UPDATE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE
    );
    `
    try {
        const res = await pool.query(createUserCartItemsTableQuery)
        console.log('🎉 users_cart_items created successfully')
    } catch (err) {
        console.error('⚠️ error creating users_cart_items table', err)
    }
}

const createUserOrderTable = async () => {
    const createUserOrderTableQuery = `
    CREATE TABLE IF NOT EXISTS users_orders (
        item_id int NOT NULL,
        user_id int NOT NULL,
        order_date date NOT NULL,
        quantity int NOT NULL,
        PRIMARY KEY (item_id, user_id),
        FOREIGN KEY (item_id) REFERENCES items(id) ON UPDATE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE
    );
    `
    try {
        const res = await pool.query(createUserOrderTableQuery)
        console.log('🎉 users_orders created successfully')
    } catch (err) {
        console.error('⚠️ error creating users_orders table', err)
    }
}

const create = async () => {
    // await createItemsTable()
    // await createUsersTable()
    await createUsersSavedItemsTable()
    await createUserCartItemsTable()
    await createUserOrderTable()
}

create()