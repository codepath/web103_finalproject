import { pool } from "../config/database.js";
import { flowerMeanings } from "../config/data.js";
import { fetchDiscoverFlowers, fetchFlowerBySlug } from "../services/plantAPI.js";

const getFlowers = async (req, res) => {
  try {
    if (req.query.source === "trefle") {
      const result = await fetchDiscoverFlowers({
        page: req.query.page,
        search: req.query.search,
        color: req.query.color,
        bloomMonth: req.query.bloomMonth,
        growthHabit: req.query.growthHabit,
        sortBy: req.query.sortBy,
        sortDir: req.query.sortDir,
      });
      res.json(result);
      return;
    }

    const { meaning, family, search } = req.query;
    let query = "SELECT * FROM flowers WHERE true";
    const params = [];

    if (meaning) {
      params.push(`%${meaning}%`);
      query += ` AND flower_meaning ILIKE $${params.length}`;
    }
    if (family) {
      params.push(family);
      query += ` AND flower_family = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND name ILIKE $${params.length}`;
    }

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFlowerById = async (req, res) => {
  try {
    const lookupId = req.params.id;
    const isNumericId = /^\d+$/.test(String(lookupId));

    if (isNumericId) {
      const { rows } = await pool.query(
        "SELECT * FROM flowers WHERE id = $1",
        [Number(lookupId)]
      );
      if (rows.length) {
        res.json(rows[0]);
        return;
      }
    }

    const trefleFlower = await fetchFlowerBySlug(lookupId);
    res.json(trefleFlower);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFlowerMeanings = async (req, res) => {
  try {
    const meanings = Object.entries(flowerMeanings).map(([name, meaning]) => ({
      name,
      meaning,
    }));
    res.json(meanings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createFlower = async (req, res) => {
  try {
    const { name, description, flower_family, flower_meaning, image_url } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO flowers (name, description, flower_family, flower_meaning, image_url)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, description, flower_family, flower_meaning, image_url]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateFlower = async (req, res) => {
  try {
    const { name, description, flower_family, flower_meaning, image_url } = req.body;
    const { rows } = await pool.query(
      `UPDATE flowers SET name=$1, description=$2, flower_family=$3,
       flower_meaning=$4, image_url=$5 WHERE id=$6 RETURNING *`,
      [name, description, flower_family, flower_meaning, image_url, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Flower not found" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFlower = async (req, res) => {
  try {
    await pool.query("DELETE FROM flowers WHERE id = $1", [req.params.id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getFlowers, getFlowerById, getFlowerMeanings, createFlower, updateFlower, deleteFlower };
