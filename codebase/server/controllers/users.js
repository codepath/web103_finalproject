import pool from '../config/database.js'

const createUser = async (req, res) => {
  try {
    const { id, email, first_name, last_name, address, city, state, zip, phone } = req.body;
    const query = `
      INSERT INTO users (id, email, first_name, last_name, address, city, state, zip, phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [id, email, first_name, last_name, address, city, state, zip, phone];

    // Attempt to insert the user
    const results = await pool.query(query, values);
    res.status(201).json(results.rows[0]);
  } catch (error) {
    // Log the error message for debugging
    console.error('Error creating user:', error.message);

    // Check if the error message contains unique constraint violation
    if (error.message.includes('unique constraint')) {
      res.status(409).json({ error: 'Email already exists.' });
    } else {
      // If it's another type of error, return a generic 409 error message
      res.status(409).json({ error: 'Conflict while creating user.' });
    }
  }
};

// const filterItems = async (req, res) => { use these example routes for user routes
//     try {
//       const { minPrice, maxPrice, color, type, metal } = req.query;
  
//       const queryValues = [];
//       const queryParams = [];
  
//       if (minPrice !== undefined) {
//         queryValues.push(`price >= $${queryValues.length + 1}`);
//         queryParams.push(minPrice);
//       }
  
//       if (maxPrice !== undefined) {
//         queryValues.push(`price <= $${queryValues.length + 1}`);
//         queryParams.push(maxPrice);
//       }
  
//       if (color) {
//         queryValues.push(`color = $${queryValues.length + 1}`);
//         queryParams.push(color);
//       }
  
//       if (type) {
//         queryValues.push(`type = $${queryValues.length + 1}`);
//         queryParams.push(type);
//       }
  
//       if (metal) {
//         queryValues.push(`metal = $${queryValues.length + 1}`);
//         queryParams.push(metal);
//       }
  
//       const query = `
//         SELECT * FROM items
//         WHERE ${queryValues.join(' AND ')}
//       `;
  
//       const result = await pool.query(query, queryParams);
  
//       res.json(result.rows);
//     } catch (error) {
//       res.status(409).json({ error: error.message });
//     }
//   };

  const getUsers = async (req, res) => {
    try{
        const results = await pool.query('SELECT * FROM users')
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(409).json( { error: error.message } )
    }
}

const getUser = async (req, res) => {
    try{
        const id = parseInt(req.params.id)
        const results = await pool.query('SELECT * FROM users WHERE id = $1', [id])
        res.status(200).json(results.rows[0])

    } catch (error) {
      res.status(409).json( { error: error.message } )
      console.log('Unable to get user')
      console.log('Error:', error.message)
    }
} 

const updateUser = async (request, response) => {
    try {
      const { email, fist_name, last_name, address, city, state, zip, phone } = req.body
      const id = parseInt(req.params.id)
  
      const results = await pool.query('UPDATE users SET email=$1, first_name=$2, last_name=$3, address=$4, city=$5, state=$6, zip=$7, phone=$8 WHERE id = $9',
        [ email, fist_name, last_name, address, city, state, zip, phone, id]
      )
  
      res.status(200).json(results.rows);
    }
    catch(error){
      res.status(409).json( { error: error.message } )
    }
  }

  const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id)
  
    try {
      const saved_deletion = await pool.query('DELETE FROM users_cart_items WHERE user_id = $1',
        [id]
      )
      const cart_deletion = await pool.query('DELETE FROM users_saved_items WHERE user_id = $1',
        [id]
      )
      const order_deletion = await pool.query('DELETE FROM users_orders WHERE user_id = $1',
        [id]
      )
  
      const results = await pool.query('DELETE FROM users WHERE id = $1', [id])
      res.status(200).json(results.rows)
    }
    catch(error) {
      res.status(409).json( { error: error.message } )
    }
      
  }

  export default {
    createUser,
    // filterItems,
    getUsers,
    getUser,
    updateUser,
    deleteUser
  }