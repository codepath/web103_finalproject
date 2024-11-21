import { pool } from '../config/database.js'

const createTrip = async (req, res) => {
    try {
        const {
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
        } = req.body;

        const results = await pool.query(`
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
            RETURNING *
        `, [
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
        ]);

        res.status(201).json(results.rows[0]);
    } catch (error) {
        console.error('Error in createTrip:', error); // Log the full error object
        res.status(409).json({ error: error.message || "An unknown error occurred" });
    }
};



const getTrips = async (req, res) => {
  try {
      const results = await pool.query('SELECT * FROM trips ORDER BY id ASC');
      res.status(200).json(results.rows);
  } catch (error) {
      res.status(409).json({ error: error.message });
  }
};


const getTrip = async (req, res) => {
  try {
      const id = parseInt(req.params.id);
      const results = await pool.query('SELECT * FROM trips WHERE id = $1', [id]);
      res.status(200).json(results.rows[0]);
  } catch (error) {
      res.status(409).json({ error: error.message });
      console.error('Unable to get trip:', error.message);
  }
};

const updateTrip = async (req, res) => {
  try {
      const {
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
      } = req.body;
      const id = parseInt(req.params.id);

      const results = await pool.query(
          `UPDATE trips 
          SET title = $1, 
              description = $2, 
              start_point = $3, 
              end_point = $4, 
              num_days = $5, 
              start_date = $6, 
              end_date = $7, 
              mode_of_transport = $8, 
              chosen_destination = $9, 
              time_to_spend = $10, 
              budget = $11, 
              currency = $12
          WHERE id = $13 RETURNING *`,
          [
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
              currency,
              id
          ]
      );

      res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error('Error in createTrip:', error); // Log the full error object
    res.status(409).json({ error: error.message || 'An unknown error occurred' });
}
};

const deleteTrip = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
      await pool.query('DELETE FROM activities WHERE trip_id = $1', [id]);
      const results = await pool.query('DELETE FROM trips WHERE id = $1 RETURNING *', [id]);
      res.status(200).json(results.rows[0]);
  } catch (error) {
      res.status(409).json({ error: error.message });
  }
};


export default {
    createTrip,
    getTrips,
    getTrip,
    updateTrip,
    deleteTrip
}