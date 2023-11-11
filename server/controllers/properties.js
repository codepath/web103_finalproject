import { pool } from "../config/database.js";

const getUserProperties = async (request, response) => {
  try {
    const userId = parseInt(request.params.id);
    const properties = await pool.query(
      "SELECT listings.*, ARRAY_AGG(listingsImages.image_url) AS image_urls, propertyAmenities.* FROM listings LEFT JOIN listingsImages ON listings.property_id = listingsImages.property_id JOIN propertyAmenities ON listings.property_id = propertyAmenities.property_id WHERE listings.user_id = $1 GROUP BY listings.id, propertyAmenities.property_id;",
      [userId]
    );
    response.status(200).json(properties.rows);
  } catch (error) {
    response.status(409).json({ error: error.message });
  }
};

//post a new property with its images and amenities
const postNewProperty = async (request, response) => {
  try {
    const hostId = parseInt(request.params.id);
    const {
      address1,
      address2,
      city,
      state,
      zipcode,
      rating,
      numBeds,
      numBaths,
      numBedrooms,
      propertyType,
      imagesArray,
      amenitiesArray,
    } = request.body;

    //add property to properties table
    const property = await pool.query(
      "INSERT INTO properties (host_id, address1, address2, city, state, zipcode, rating, num_beds, num_baths, num_bedrooms, property_type,) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id",
      [
        hostId,
        address1,
        address2,
        city,
        state,
        zipcode,
        rating,
        numBeds,
        numBaths,
        numBedrooms,
        propertyType,
      ]
    );

    const propertyId = property.rows[0].id;

    const {
      wifi,
      dryer,
      washer,
      iron,
      airConditioner,
      heater,
      poolAvailable,
      grill,
      hotTub,
      freeParking,
      evCharger,
      beachFront,
      waterFront,
      mountainView,
      cityView,
      gym,
      elevator,
      wheelchairAccessilbe,
      petFriendly,
      smokingAllowed,
    } = amenitiesArray;

    //add all amenities to propertyAmenities table
    const addedAmenities = await pool.query(
      "INSERT INTO propertyAmenities (property_id, wifi, dryer, washer, iron, air_conditioner, heater, pool, grill, hot_tub, free_parking, ev_charger, beach_front, water_front, mountain_view, city_view, gym, elevator, wheelchair_accessilbe, pet_friendly, smoking_allowed) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING *",
      [
        wifi,
        dryer,
        washer,
        iron,
        airConditioner,
        heater,
        poolAvailable,
        grill,
        hotTub,
        freeParking,
        evCharger,
        beachFront,
        waterFront,
        mountainView,
        cityView,
        gym,
        elevator,
        wheelchairAccessilbe,
        petFriendly,
        smokingAllowed,
      ]
    );
    //each image is an array of urls
    for (image of imagesArray) {
      try {
        const addedImages = await pool.query(
          "INSERT INTO listingsImages (property_id, image_url) VALUES ($1, $2) RETURNING *",
          [propertyId, image]
        );
        response.json(addedImages.rows[0]);
      } catch (error) {
        response.status(409).json({ error: error.message });
      }
    }
    response.status(200).json({
      property: property.rows[0],
      amenities: addedAmenities.rows[0],
      images: addedImages.rows[0],
    });
  } catch (error) {
    response.status(409).json({ error: error.message });
  }
};

export default {
  getUserProperties,
  postNewProperty,
};
