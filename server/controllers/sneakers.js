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
      stockquantity,
      category,
      targetaudience,
      img_url,
    } = req.body;

    const sneakerResult = await pool.query(
      `INSERT INTO sneakers (name, brand, description, price, size, color, stockquantity, category, targetaudience)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING id`,
      [
        name,
        brand,
        description,
        price,
        size,
        color,
        stockquantity,
        category,
        targetaudience,
      ]
    );

    const productId = sneakerResult.rows[0].id;

    // Assume imageUrls is an array of image URLs associated with the sneakers
    const imageUrls = req.body.img_url || [];

    // Insert image URLs into the images table
    const imageInsertPromises = imageUrls.map(async (imageUrl) => {
      await pool.query(
        `INSERT INTO images (productid, imageurl)
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
    const results = await pool.query("SELECT * FROM sneakers ORDER BY id ASC");
    const sneakers = results.rows;

    // Fetch and attach images for each sneaker
    for (const sneaker of sneakers) {
      const imagesResult = await pool.query(
        "SELECT imageurl FROM images WHERE productid = $1",
        [sneaker.id]
      );
      sneaker.images = imagesResult.rows.map((row) => row.imageurl);
    }

    res.status(200).json(sneakers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSneaker = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const sneakerResult = await pool.query(
      "SELECT * FROM sneakers WHERE id = $1",
      [id]
    );

    if (sneakerResult.rows.length === 0) {
      res.status(404).json({ error: "Sneaker not found" });
    } else {
      const sneaker = sneakerResult.rows[0];

      // Fetch and attach images for the sneaker
      const imagesResult = await pool.query(
        "SELECT imageurl FROM images WHERE productid = $1",
        [sneaker.id]
      );
      sneaker.images = imagesResult.rows.map((row) => row.imageurl);

      res.status(200).json(sneaker);
    }
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
      stockquantity,
      category,
      targetaudience,
      img_url, // Array of image URLs
    } = req.body;

    // Update sneaker details
    const updatedSneakerResult = await pool.query(
      `UPDATE sneakers
        SET name = $1, brand = $2, description = $3, price = $4, size = $5, color = $6, stockquantity = $7, category = $8, targetaudience = $9
        WHERE id = $10
        RETURNING *`,
      [
        name,
        brand,
        description,
        price,
        size,
        color,
        stockquantity,
        category,
        targetaudience,
        id,
      ]
    );

    if (updatedSneakerResult.rows.length === 0) {
      res.status(404).json({ error: "Sneaker not found" });
      return;
    }

    const updatedSneaker = updatedSneakerResult.rows[0];

    // Delete existing images for the sneaker
    await pool.query("DELETE FROM images WHERE productid = $1", [id]);

    // Insert new images for the sneaker
    if (img_url && img_url.length > 0) {
      const imageValues = img_url.map((img_url) => [id, img_url]);
      await pool.query(
        "INSERT INTO images (productid, imageurl) VALUES $1:raw",
        [imageValues]
      );
    }

    res.status(200).json(updatedSneaker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteSneaker = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

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
    await pool.query("DELETE FROM images WHERE productid = $1", [id]);

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
