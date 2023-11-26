import { pool } from "../config/database.js";
const createSneaker = async (req, res) => {
  try {
    const {
      name,
      brand,
      description,
      price,
      size,
      color,
      stock_quantity,
      category,
      target_audience,
      image_url,
    } = req.body;
    console.log(req.body);
    const sneakerResult = await pool.query(
      `INSERT INTO sneakers (name, brand, description, price, size, color, stock_quantity, category, target_audience)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING id`,
      [
        name,
        brand,
        description,
        price,
        size,
        color,
        stock_quantity,
        category,
        target_audience,
      ]
    );

    const productId = sneakerResult.rows[0].id;

    // Assume imageUrls is an array of image URLs associated with the sneakers
    const imageUrls = [];
    imageUrls.push(image_url);

    // Insert image URLs into the images table
    const imageInsertPromises = imageUrls.map(async (imageUrl) => {
      await pool.query(
        `INSERT INTO images (product_id, image_url)
          VALUES($1, $2)`,
        [productId, imageUrl]
      );
    });

    await Promise.all(imageInsertPromises);

    res
      .status(201)
      .json({ message: "Sneaker and images created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSneakers = async (req, res) => {
  try {
    const results = await pool.query(
      "SELECT s.*, i.image_url FROM sneakers s LEFT JOIN images i ON s.id = i.product_id ORDER BY s.id ASC"
    );

    const sneakers = [];

    // Group results by sneaker id
    const groupedResults = results.rows.reduce((acc, row) => {
      if (!acc[row.id]) {
        acc[row.id] = { ...row, images: [] };
        sneakers.push(acc[row.id]);
      }

      if (row.image_url) {
        acc[row.id].images.push(row.image_url);
      }

      return acc;
    }, {});

    res.status(200).json(sneakers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSneaker = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const results = await pool.query(
      "SELECT s.*, i.image_url FROM sneakers s LEFT JOIN images i ON s.id = i.product_id WHERE s.id = $1",
      [id]
    );

    if (results.rows.length === 0) {
      res.status(404).json({ error: "Sneaker not found" });
      return;
    }

    const sneaker = { ...results.rows[0], images: [] };

    // Add images to the sneaker object
    for (const row of results.rows) {
      if (row.image_url) {
        sneaker.images.push(row.image_url);
      }
    }

    res.status(200).json(sneaker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const updateSneaker = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      name,
      brand,
      description,
      price,
      size,
      color,
      stock_quantity,
      category,
      target_audience,
      image_url, // Array of image URLs
    } = req.body;
    console.log(req.body);
    // Update sneaker details
    const updatedSneakerResult = await pool.query(
      `UPDATE sneakers
        SET name = $1, brand = $2, description = $3, price = $4, size = $5, color = $6, stock_quantity = $7, category = $8, target_audience = $9
        WHERE id = $10
        RETURNING *`,
      [
        name,
        brand,
        description,
        price,
        size,
        color,
        stock_quantity,
        category,
        target_audience,
        id,
      ]
    );

    if (updatedSneakerResult.rows.length === 0) {
      res.status(404).json({ error: "Sneaker not found" });
      return;
    }

    const updatedSneaker = updatedSneakerResult.rows[0];

    // Delete existing images for the sneaker
    await pool.query("DELETE FROM images WHERE product_id = $1", [id]);
    const image = [];
    console.log(image_url);
    image.push[image_url];
    // console.log(image);
    await pool.query(
      `INSERT INTO images (product_id, image_url)
          VALUES($1, $2)`,
      [id, image_url]
    );

    res.status(200).json(updatedSneaker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteSneaker = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(id);
    // Delete sneaker
    const deletedSneakerResult = await pool.query(
      "DELETE FROM sneakers WHERE id = $1 RETURNING *",
      [id]
    );

    if (deletedSneakerResult.rows.length === 0) {
      res.status(404).json({ error: "Sneaker not found" });
      return;
    }

    const deletedSneaker = deletedSneakerResult.rows[0];

    // Delete associated images
    await pool.query("DELETE FROM images WHERE product_id = $1", [id]);

    res.status(200).json({ message: "Sneaker deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  createSneaker,
  getSneakers,
  getSneaker,
  updateSneaker,
  deleteSneaker,
};
