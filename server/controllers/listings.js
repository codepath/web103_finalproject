import { pool } from "../config/database.js";

//get all listings that are currently advertised
const getAllListings = async (request, response) => {
  response.cookie("visited", true, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  try {
    const query = `
      SELECT
        listings.*,
        properties.*,
        propertyAmenities.*,
        (
          SELECT json_agg(listingAvailability.*)
          FROM listingAvailability
          WHERE listingAvailability.listing_id = listings.id
        ) AS availability,
        json_agg(DISTINCT listingImages.*) AS images
      FROM listings
      INNER JOIN properties ON properties.id = listings.property_id
      INNER JOIN propertyAmenities ON properties.id = propertyAmenities.property_id
      LEFT JOIN listingImages ON properties.id = listingImages.property_id
      GROUP BY listings.id, properties.id, propertyAmenities.id
    `;

    const results = await pool.query(query);
    response.status(200).json(results.rows);
  } catch (error) {
    response.status(409).json({ error: error.message });
  }
};

//get all listings that specific user currently has advertised
const getUserListings = async (request, response) => {
  try {
    const id = parseInt(request.params.id);
    const results = await pool.query(
      "SELECT listings.* FROM users JOIN listings ON users.id = listings.user_id WHERE users.id = $1",
      [id]
    );
    response.status(200).json(results.rows);
  } catch (error) {
    response.status(409).json({ error: error.message });
  }
};

//get single listing
const getListingById = async (request, response) => {
  console.log(request.cookies);
  try {
    const id = parseInt(request.params.id);
    const results = await pool.query("SELECT * FROM listings WHERE id = $1", [
      id,
    ]);
    response.status(200).json(results.rows);
  } catch (error) {
    response.status(409).json({ error: error.message });
  }
};

//create a new listing
const postNewListing = async (request, response) => {
  try {
    const propertyId = parseInt(request.params.id);
    const { title, pricePerNight } = request.body;
    // const propertyExists = await pool.query(
    //   "SELECT * FROM properties WHERE id = $1",
    //   [propertyId]
    // );
    // if (propertyExists.rowCount === 0) {
    //     const newProperty = await pool.query(`INSERT INTO properties (host_id, address1, address2, city, state, country, zipcode, rating, num_beds, num_baths, num_bedrooms, property_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [propertyId, title, pricePerNight, images, amenities, availability]);

    // }
    //     else {
    //     }
    const newListing = await pool.query(
      `INSERT INTO listings (title, property_id, price_per_night) VALUES ($1, $2, $3) RETURNING *`,
      [title, propertyId, pricePerNight]
    );
    response.status(201).json(newListing.rows[0]);
  } catch (error) {
    response.status(409).json({ error: error.message });
  }
};

//add images to a listing
const postNewListingImages = async (request, response) => {
  try {
    const propertyId = parseInt(request.params.id);
    const { images } = request.body;

    for (let image of images) {
      try {
        const newImage = await pool.query(
          `INSERT INTO listingImages (property_id, image_url) VALUES ($1, $2) RETURNING *`,
          [propertyId, image]
        );
        response.status(201).json(newImage.rows[0]);
      } catch (error) {
        response.status(409).json({ error: error.message });
      }
    }
  } catch (error) {
    response.status(409).json({ error: error.message });
  }
};

//add availability to a new listing
const postNewListingAvailability = async (request, response) => {
  try {
    const listingId = parseInt(request.params.id);
    const { startAvailability, endAvailability } = request.body;
    const newAvailability = await pool.query(
      `INSERT INTO listingAvailability (listing_id, start_availability, end_availability) VALUES ($1, $2, $3) RETURNING *`,
      [listingId, startAvailability, endAvailability]
    );
    response.status(201).json(newAvailability.rows[0]);
  } catch (error) {
    response.status(409).json({ error: error.message });
  }
};
// const propertyExists = await pool.query(
//   "SELECT * FROM properties WHERE id = $1",
//   [propertyId]
// );
// if (propertyExists.rowCount === 0) {
//     const newProperty = await pool.query(`INSERT INTO properties (host_id, address1, address2, city, state, country, zipcode, rating, num_beds, num_baths, num_bedrooms, property_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [propertyId, title, pricePerNight, images, amenities, availability]);

// }
//     else {
//     }
//     const newListing = await pool.query(
//       `INSERT INTO listings (title, property_id, price_per_night) VALUES ($1, $2, $3) RETURNING *`,
//       [title, propertyId, pricePerNight]
//     );
//     response.status(201).json(newListing.rows[0]);
//   } catch (error) {
//     response.status(409).json({ error: error.message });
//   }
// };
export default {
  getAllListings,
  getUserListings,
  getListingById,
  postNewListing,
  postNewListingAvailability,
  postNewListingImages,
};
