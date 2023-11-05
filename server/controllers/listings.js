import { pool } from "../config/database.js";

const getAllListings = async (request, response) => {
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

export default {
  getAllListings,
};
