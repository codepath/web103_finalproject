import { client } from './database.js';
import products from '../data/products.js';
import users from '../data/users.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to handle paths in ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const createTables = async () => {
    try {
        // Read the SQL file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Execute the full SQL script
        await client.query(schema);

        // --- VERIFICATION STEP ---
        // Query the database to list all public tables
        const result = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `);

        console.log("✅ Tables and Triggers created successfully!");
        console.log("Current tables in database:");
        result.rows.forEach(row => console.log(` - ${row.table_name}`));

    } catch (err) {
        console.error("Error creating tables", err);
        throw err;
    }
};

const seedProducts = async () => {
    for (const product of products) {
        const query = {
            text: `INSERT INTO products (name, price, current_quantity, category, description, image_url) 
                   VALUES ($1, $2, $3, $4, $5, $6)`,
            values: [product.name, product.price, product.current_quantity, product.category, product.description, product.image_url]
        };
        await client.query(query);
    }
    console.log(`Seeded ${products.length} products`);
};

const seedUsers = async () => {
    for (const user of users) {
        const query = {
            text: `INSERT INTO users (
                first_name, 
                last_name, 
                phone_number, 
                email, password, 
                address_line_1, 
                address_line_2, 
                city, 
                state, 
                zipcode, 
                user_role) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            values: [
                user.first_name, 
                user.last_name, 
                user.phone_number, 
                user.email, 
                user.password, 
                user.address_line_1, 
                user.address_line_2, 
                user.city, user.state, 
                user.zipcode, 
                user.user_role
            ]
        };
        await client.query(query);
    }
    console.log(`Seeded ${users.length} users`);
};

const seedDatabase = async () => {
    try {
        await createTables();
        await seedProducts();
        await seedUsers();
        console.log("Database initialization complete!");
    } catch (err) {
        console.error("Process failed:", err);
    } finally {
        await client.end();
    }
};

seedDatabase();