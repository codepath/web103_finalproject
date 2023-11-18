import { pool } from "./database.js";
import "./dotenv.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";

const currentPath = fileURLToPath(import.meta.url);

const usersFile = fs.readFileSync(
  path.join(dirname(currentPath), "../config/data/users.json")
);
const propertiesFile = fs.readFileSync(
  path.join(dirname(currentPath), "../config/data/properties.json")
);
const listingsFile = fs.readFileSync(
  path.join(dirname(currentPath), "../config/data/listings.json")
);
const listingAvailabilityFile = fs.readFileSync(
  path.join(dirname(currentPath), "../config/data/listingAvailability.json")
);
const propertyAmenitiesFile = fs.readFileSync(
  path.join(dirname(currentPath), "../config/data/propertyAmenities.json")
);

const listingImagesFile = fs.readFileSync(
  path.join(dirname(currentPath), "../config/data/listingImages.json")
);

const usersData = JSON.parse(usersFile);
const propertiesData = JSON.parse(propertiesFile);
const listingsData = JSON.parse(listingsFile);
const listingAvailabilityData = JSON.parse(listingAvailabilityFile);
const propertyAmenitiesData = JSON.parse(propertyAmenitiesFile);
const listingImagesData = JSON.parse(listingImagesFile);

const createUsersTable = async () => {
  const createUsersTableQuery = {
    text: `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        address1 VARCHAR(255), 
        address2 VARCHAR(255),
        city VARCHAR(255), 
        state VARCHAR(255), 
        country VARCHAR(255), 
        zipcode VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        user_name VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        image_url VARCHAR(255),
        is_active BOOLEAN DEFAULT true
    )`,
  };
  try {
    const res = await pool.query(createUsersTableQuery);
    console.log("🎉 users table created successfully");
  } catch (err) {
    console.log("⚠️ error creating users table", err);
  }
};

const createPropertiesTable = async () => {
  const createPropertiesTableQuery = {
    text: `CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        host_id INTEGER REFERENCES users(id) NOT NULL,
        address1 VARCHAR(255) NOT NULL,
        address2 VARCHAR(255),
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        zipcode VARCHAR(255) NOT NULL,
        rating FLOAT NOT NULL,
        num_beds INTEGER NOT NULL,
        num_baths INTEGER NOT NULL,
        num_bedrooms INTEGER NOT NULL,
        property_type VARCHAR(255) NOT NULL
    )`,
  };
  try {
    const res = await pool.query(createPropertiesTableQuery);
    console.log("🎉 properties table created successfully");
  } catch (err) {
    console.log("⚠️ error creating properties table", err);
  }
};

const createListingsTable = async () => {
  const createListingsTableQuery = {
    text: `CREATE TABLE IF NOT EXISTS listings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        property_id INTEGER REFERENCES properties(id) NOT NULL,
        price_per_night MONEY NOT NULL
    )`,
  };
  try {
    const res = await pool.query(createListingsTableQuery);
    console.log("🎉 listings table created successfully");
  } catch (err) {
    console.log("⚠️ error creating listings table", err);
  }
};

const createListingAvailabilityTable = async () => {
  const createListingAvailabilityTableQuery = {
    text: `CREATE TABLE IF NOT EXISTS listingAvailability (
        id SERIAL PRIMARY KEY,
        listing_id INTEGER REFERENCES listings(id) NOT NULL,
        start_availability DATE NOT NULL,
        end_availability DATE NOT NULL
    )`,
  };
  try {
    const res = await pool.query(createListingAvailabilityTableQuery);
    console.log("🎉 listingAvailability table created successfully");
  } catch (err) {
    console.log("⚠️ error creating listingAvailability table", err);
  }
};

const createPropertyAmenitiesTable = async () => {
  const createPropertyAmenitiesTableQuery = {
    text: `CREATE TABLE IF NOT EXISTS propertyAmenities (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) NOT NULL,
        wifi BOOLEAN NOT NULL,
        dryer BOOLEAN NOT NULL,
        washer BOOLEAN NOT NULL,
        iron BOOLEAN NOT NULL,
        air_conditioner BOOLEAN NOT NULL,
        heater BOOLEAN NOT NULL,
        pool BOOLEAN NOT NULL,
        grill BOOLEAN NOT NULL,
        hot_tub BOOLEAN NOT NULL,
        free_parking BOOLEAN NOT NULL,
        ev_charger BOOLEAN NOT NULL,
        beach_front BOOLEAN NOT NULL,
        water_front BOOLEAN NOT NULL,
        mountain_view BOOLEAN NOT NULL,
        city_view BOOLEAN NOT NULL,
        gym BOOLEAN NOT NULL,
        elevator BOOLEAN NOT NULL,
        wheelchair_accessible BOOLEAN NOT NULL,
        pet_friendly BOOLEAN NOT NULL,
        smoking_allowed BOOLEAN NOT NULL
    )`,
  };

  try {
    const res = await pool.query(createPropertyAmenitiesTableQuery);
    console.log("🎉 propertyAmenities table created successfully");
  } catch (err) {
    console.log("⚠️ error creating propertyAmenities table", err);
  }
};

const createListingImagesTable = async () => {
  const createListingImagesTableQuery = {
    text: `CREATE TABLE IF NOT EXISTS listingImages (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) NOT NULL,
        image_url VARCHAR(255) NOT NULL
    )`,
  };

  try {
    const res = await pool.query(createListingImagesTableQuery);
    console.log("🎉 listingImages table created successfully");
  } catch (err) {
    console.log("⚠️ error creating listingImages table", err);
  }
};

const seedUsersTable = async () => {
  await createUsersTable();

  usersData.forEach((user) => {
    const insertQuery = {
      text: "INSERT INTO users (first_name, last_name, address1, address2, city, state, country, zipcode, phone, user_name, email, password, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ,$9, $10, $11, $12, $13)",
    };

    const values = [
      user.first_name,
      user.last_name,
      user.address1,
      user.address2,
      user.city,
      user.state,
      user.country,
      user.zipcode,
      user.phone,
      user.user_name,
      user.email,
      user.password,
      user.is_active,
    ];
    try {
      pool.query(insertQuery, values);
      console.log(`✅ ${user.user_name} added successfully`);
    } catch (err) {
      console.error("⚠️ error inserting user", err);
    }
  });
};

const seedPropertiesTable = async () => {
  await createPropertiesTable();

  propertiesData.forEach((property) => {
    const insertQuery = {
      text: "INSERT INTO properties (host_id, address1, address2, city, state, country, zipcode, rating, num_beds, num_baths, num_bedrooms, property_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ,$9, $10, $11, $12)",
    };

    const values = [
      property.host_id,
      property.address1,
      property.address2,
      property.city,
      property.state,
      property.country,
      property.zipcode,
      property.rating,
      property.num_beds,
      property.num_baths,
      property.num_bedrooms,
      property.property_type,
    ];
    try {
      pool.query(insertQuery, values);
      console.log(`✅ ${property.host_id}'s property added successfully`);
    } catch (err) {
      console.error("⚠️ error inserting property", err);
    }
  });
};

const seedListingsTable = async () => {
  await createListingsTable();

  listingsData.forEach((listing) => {
    const insertQuery = {
      text: "INSERT INTO listings (title, property_id, price_per_night) VALUES ($1, $2, $3)",
    };

    const values = [
      listing.title,
      listing.property_id,
      listing.price_per_night,
    ];
    try {
      pool.query(insertQuery, values);
      console.log(`✅ ${listing.title} added successfully`);
    } catch (err) {
      console.error("⚠️ error inserting property", err);
    }
  });
};

const seedPropertyAmenitiesTable = async () => {
  await createPropertyAmenitiesTable();

  propertyAmenitiesData.forEach((amenityList) => {
    const insertQuery = {
      text: "INSERT INTO propertyAmenities (property_id, wifi, dryer, washer, iron, air_conditioner, heater, pool, grill, hot_tub, free_parking, ev_charger, beach_front, water_front, mountain_view, city_view, gym, elevator, wheelchair_accessible, pet_friendly, smoking_allowed) VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ,$9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)",
    };

    const values = [
      amenityList.property_id,
      amenityList.wifi,
      amenityList.dryer,
      amenityList.washer,
      amenityList.iron,
      amenityList.air_conditioner,
      amenityList.heater,
      amenityList.pool,
      amenityList.grill,
      amenityList.hot_tub,
      amenityList.free_parking,
      amenityList.ev_charger,
      amenityList.beach_front,
      amenityList.water_front,
      amenityList.mountain_view,
      amenityList.city_view,
      amenityList.gym,
      amenityList.elevator,
      amenityList.wheelchair_accessible,
      amenityList.pet_friendly,
      amenityList.smoking_allowed,
    ];
    try {
      pool.query(insertQuery, values);
      console.log(
        `✅ ${amenityList.property_id}'s amentieis added successfully`
      );
    } catch (err) {
      console.error("⚠️ error inserting amenities", err);
    }
  });
};

const seedListingAvailabilityTable = async () => {
  await createListingAvailabilityTable();

  listingAvailabilityData.forEach((listing) => {
    const insertQuery = {
      text: "INSERT INTO listingAvailability (listing_id, start_availability, end_availability) VALUES ($1, $2, $3)",
    };

    const values = [
      listing.listing_id,
      listing.start_availability,
      listing.end_availability,
    ];
    try {
      pool.query(insertQuery, values);
      console.log(`✅ ${listing.listing_id} availability added successfully`);
    } catch (err) {
      console.error("⚠️ error inserting property", err);
    }
  });
};

const seedListingImagesTable = async () => {
  await createListingImagesTable();

  listingImagesData.forEach((listingImage) => {
    const insertQuery = {
      text: "INSERT INTO listingImages (property_id, image_url) VALUES ($1, $2)",
    };

    const values = [listingImage.property_id, listingImage.image_url];
    try {
      pool.query(insertQuery, values);
      console.log(`✅ ${listingImage.image_url} added successfully`);
    } catch (err) {
      console.error("⚠️ error inserting listing image", err);
    }
  });
};

const dropAllTables = async () => {
  const dropTablesQuery =
    "DROP TABLE IF EXISTS users, properties, listings, listingAvailability, propertyAmenities, listingImages";

  try {
    await pool.query(dropTablesQuery);
    console.log("🎉 all tables dropped successfully");
  } catch (err) {
    console.log("⚠️ error dropping tables", err);
  }
};

const createSessionTable = async () => {
  const createSessionTableQuery = {
    text: `CREATE TABLE IF NOT EXISTS "session" (
        sid varchar NOT NULL COLLATE "default",
        sess json NOT NULL,
        expire timestamp(6) NOT NULL
      )
      WITH (OIDS=FALSE);
      ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;`,
  };

  try {
    const res = await pool.query(createSessionTableQuery);
    console.log("🎉 session table created successfully");
  } catch (err) {
    console.log("⚠️ error creating session table", err);
  }
};

// dropAllTables();
// seedUsersTable();
// seedPropertiesTable();
// seedListingsTable();
// seedPropertyAmenitiesTable();
// seedListingAvailabilityTable();
// seedListingImagesTable();
createSessionTable();
