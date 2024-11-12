import { pool } from '../config/database.js'

const getBookingsByUserId = async (req, res) => {
    const user_id = req.params.user_id;
    try {
        const results = await pool.query('SELECT * FROM bookings WHERE user_id=$1', [user_id])
        
        if (results.rows.length === 0){
            res.status(404).json({ error: "No free bookings for this user" })

        } else {
            res.status(200).json(results.rows);
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const addBooking = async (req, res) => {
    const { user_id, salon_id, employee_id, time_slot_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO bookings (user_id, salon_id, employee_id, time_slot_id) VALUES ($1, $2, $3, $4)', 
            [user_id, salon_id, employee_id, time_slot_id]
        );
        res.status(201).json(result);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

const deleteBookingByBookingId = async (req, res) => {
    const booking_id = req.params.booking_id;
    try {
        const result = await pool.query('DELETE FROM bookings WHERE id=$1', [booking_id])
        res.status(200).json(result)
    }
    catch(error){
        res.status(409).json({ error: error.message })
    }
}

export default { getBookingsByUserId, addBooking, deleteBookingByBookingId }