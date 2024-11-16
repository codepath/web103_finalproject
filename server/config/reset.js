import './dotenv.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'
import pg from 'pg'

const config = {
    user: 'postgres',
    password: 'wZtCFSYDWXobdnzuxPnLouaQrxLNNbym',
    host: 'junction.proxy.rlwy.net',
    port: '13602',
    database: 'railway'
}

console.log(config)
const pool = new pg.Pool(config)

const currentPath = fileURLToPath(import.meta.url)
const tripsFile = fs.readFileSync(path.join(dirname(currentPath), './data/data.json'))
const tripsData = JSON.parse(tripsFile)

const createTripsTable = async () => {
    const createTripsTableQuery = `

        DROP TABLE IF EXISTS trips CASCADE;
        CREATE TABLE IF NOT EXISTS trips (
            id serial PRIMARY KEY,
            title varchar(100) NOT NULL,
            description varchar(500) NOT NULL,
            start_point varchar(1000) ,
            end_point varchar(1000) ,
            num_days integer ,
            start_date date ,
            end_date date ,
            mode_of_transport varchar(50) ,
            chosen_destination varchar(100) ,
            time_to_spend varchar(50) ,
            budget numeric(10, 2) ,
            currency varchar(10) 
        );
    `;
    try {
        const res = await pool.query(createTripsTableQuery);
        console.log('🎉 trips table created successfully');
    } catch (error) {
        console.error('⚠️ error creating trips table', error);
    }
};
/*
const seedTripsTable = async () => {
    await createTripsTable();
    tripsData.forEach((trip) => {
        const insertQuery = {
            text: `
                INSERT INTO trips (
                    title, 
                    description, 
                    start_point, 
                    end_point, 
                    num_days, 
                    start_date, 
                    end_date, 
                    mode_of_transport, 
                    chosen_destination, 
                    time_to_spend, 
                    budget, 
                    currency
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            `
        };
        const values = [
            trip.title,
            trip.description,
            trip.start_point,
            trip.end_point,
            trip.num_days,
            trip.start_date,
            trip.end_date,
            trip.mode_of_transport,
            trip.chosen_destination,
            trip.time_to_spend,
            trip.budget,
            trip.currency
        ];
        pool.query(insertQuery, values, (err, res) => {
            if (err) {
                console.error('⚠️ error inserting trip', err);
                return;
            }

            console.log(`✅ ${trip.title} added successfully`);
        });
    });
};
*/

const createDestinationsTable = async () => {
    const createDestinationsTableQuery = `
        CREATE TABLE IF NOT EXISTS destinations (
            id serial PRIMARY KEY,
            destination varchar(100) NOT NULL,
            description varchar(500) NOT NULL,
            city varchar(100) NOT NULL,
            country varchar(100) NOT NULL,
            img_url text NOT NULL,
            flag_img_url text NOT NULL
        );
    `
    try {
        const res = await pool.query(createDestinationsTableQuery)
        console.log('🎉 destinations table created successfully')
    }
    catch (error) {
        console.error('⚠️ error creating destinations table', error)
    }
}

const createActivitiesTable = async () => {
    const createActivitiesTableQuery = `
        CREATE TABLE IF NOT EXISTS activities (
            id serial PRIMARY KEY,
            trip_id int NOT NULL,
            activity varchar(100) NOT NULL,
            num_votes integer DEFAULT 0,
            FOREIGN KEY(trip_id) REFERENCES trips(id)
        );
    `
    try {
        const res = await pool.query(createActivitiesTableQuery)
        console.log('🎉 activities table created successfully')
    }
    catch (error) {
        console.error('⚠️ error creating activities table', error)
    }
}

const createTripsDestinationsTable = async () => {
    const createTripsDestinationsTableQuery = `
        CREATE TABLE IF NOT EXISTS trips_destinations (
            trip_id int NOT NULL,
            destination_id int NOT NULL,
            PRIMARY KEY (trip_id, destination_id),
            FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE,
            FOREIGN KEY (destination_id) REFERENCES destinations(id) ON UPDATE CASCADE
        );
    `
    try {
        const res = await pool.query(createTripsDestinationsTableQuery)
        console.log('🎉 trips_destinations table created successfully')
    }
    catch (error) {
        console.error('⚠️ error creating trips_destinations table', error)
    }
}

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
        console.error('⚠️ error creating users table', error)
    }
}

const createTripsUsersTable = async () => {
    const createTripsUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS trips_users (
            trip_id int NOT NULL,
            user_id int NOT NULL,
            PRIMARY KEY (trip_id, user_id),
            FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE
        );
    `
    try {
        const res = await pool.query(createTripsUsersTableQuery)
        console.log('🎉 trips_users table created successfully')
    }
    catch (error) {
        console.error('⚠️ error creating trips_users table', error)
    }
}

const fetchAndInsertData = async () => {
    //seedTripsTable()
    await createTripsTable()
    await createDestinationsTable()
    await createActivitiesTable()
    await createTripsDestinationsTable()
    await createUsersTable()
    await createTripsUsersTable()
    
};

fetchAndInsertData();