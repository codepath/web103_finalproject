import { pool } from "./database.js";
import "./dotenv.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";

const currentPath = fileURLToPath(import.meta.url);

const sneakersFile = fs.readFileSync(
  path.join(dirname(currentPath), "../config/data/data.json")
);
const sneakersData = JSON.parse(sneakersFile);

const createSneakersTable = async () => {
  const createSneakersTableQuery = `
    CREATE TABLE IF NOT EXISTS sneakers (
      id serial PRIMARY KEY,
      name varchar(100) NOT NULL,
      brand varchar(100) NOT NULL,
      description text NOT NULL,
      price money NOT NULL,
      size numeric(7, 2) NOT NULL,
      color varchar(50) NOT NULL,
      stockquantity integer NOT NULL,
      category varchar(50) NOT NULL,
      targetaudience varchar(50) NOT NULL
    );
  `;

  try {
    const res = await pool.query(createSneakersTableQuery);
    console.log("🎉 sneakers table created successfully");
  } catch (err) {
    console.error("⚠️ error creating sneakers table", err);
  }
};

const createImagesTable = async () => {
  const createImagesTableQuery = `
      CREATE TABLE IF NOT EXISTS images (
        imageid serial PRIMARY KEY,
        productid integer NOT NULL,
        imageurl text NOT NULL,
        FOREIGN KEY(productid) REFERENCES sneakers(id)
      );
    `;

  try {
    const res = await pool.query(createImagesTableQuery);
    console.log("🎉 images table created successfully");
  } catch (err) {
    console.error("⚠️ error creating images table", err);
  }
};

const seedSneakersTable = async () => {
  await createSneakersTable();

  sneakersData.forEach((sneaker) => {
    const insertQuery = {
      text: "INSERT INTO sneakers (name, brand, description, price, size, color, stockquantity, category, targetaudience) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    };

    const values = [
      sneaker.name,
      sneaker.brand,
      sneaker.description,
      sneaker.price,
      sneaker.size,
      sneaker.color,
      sneaker.stockquantity,
      sneaker.category,
      sneaker.targetaudience,
    ];

    try {
      pool.query(insertQuery, values);
      console.log(`✅ ${sneaker.name} added successfully`);
    } catch (err) {
      console.error("⚠️ error inserting sneaker", err);
    }
  });
};

// Add a function to seed the images table
const seedImagesTable = async () => {
  await createImagesTable();

  sneakersData.forEach((sneaker) => {
    const insertImageQuery = {
      text: "INSERT INTO images (productid, imageurl) VALUES ($1, $2)",
    };

    const imageValues = [sneaker.id, sneaker.img_url];

    try {
      pool.query(insertImageQuery, imageValues);
      console.log(`✅ Image for ${sneaker.name} added successfully`);
    } catch (err) {
      console.error("⚠️ error inserting image", err);
    }
  });
};
const createReviewsTable = async () => {
  const createReviewsTableQuery = `
      CREATE TABLE IF NOT EXISTS reviews (
        reviewid serial PRIMARY KEY,
        productid integer NOT NULL,
        userid integer NOT NULL,
        rating integer NOT NULL,
        reviewtext text NOT NULL,
        reviewdate date NOT NULL
      );
    `;

  try {
    const res = await pool.query(createReviewsTableQuery);
    console.log("🎉 reviews table created successfully");
  } catch (err) {
    console.error("⚠️ error creating reviews table", err);
  }
};
const createUsersTable = async () => {
  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS user (
      id serial PRIMARY KEY,
      googleid integer NOT NULL,
      username varchar(100) NOT NULL,
      avatarurl varchar(500) NOT NULL,
      accesstoken varchar(500) NOT NULL
    );
  `;

  try {
    const res = await pool.query(createUsersTableQuery);
    console.log("🎉 users table created successfully");
  } catch (err) {
    console.error("⚠️ error creating users table", err);
  }
};

const createUserAddressTable = async () => {
  const createUserAddressTableQuery = `
      CREATE TABLE IF NOT EXISTS useraddress (
        id serial PRIMARY KEY,
        userid integer NOT NULL,
        address varchar(255) NOT NULL,
        city varchar(100) NOT NULL,
        postalcode varchar(10) NOT NULL,
        country varchar(100) NOT NULL,
        phone varchar(20) NOT NULL,
        FOREIGN KEY(userid) REFERENCES user(id)
      );
    `;

  try {
    const res = await pool.query(createUserAddressTableQuery);
    console.log("🎉 useraddress table created successfully");
  } catch (err) {
    console.error("⚠️ error creating useraddress table", err);
  }
};

seedSneakersTable();
seedImagesTable();
createReviewsTable();
createUsersTable;
createUserAddressTable();
