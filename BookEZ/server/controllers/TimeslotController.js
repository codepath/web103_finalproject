import { pool } from '../config/database.js'

const getATimeslotById = async (req, res) => {
    const {timeslot_id}= req.params;
    try {
        // const results = await pool.query('SELECT * FROM time_slots WHERE employee_id=$1 AND is_booked=False', [employee_id])
        const results = await pool.query('SELECT * FROM time_slots WHERE id=$1', [timeslot_id])
        
        if (results.rows.length === 0){
            res.status(404).json({ error: "No timeslot found" })

        } else {
            res.status(200).json(results.rows);
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getFreeTimeslotsByEmployeeId = async (req, res) => {
    const employee_id = req.params.employee_id;
    try {
        // const results = await pool.query('SELECT * FROM time_slots WHERE employee_id=$1 AND is_booked=False', [employee_id])
        const results = await pool.query('SELECT * FROM time_slots WHERE employee_id=$1', [employee_id])
        
        if (results.rows.length === 0){
            res.status(404).json({ error: "No free timeslot for this employee" })

        } else {
            res.status(200).json(results.rows);
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const bookTimeslotByTimeslotId = async (req, res) => {
    const {timeslot_id} = req.params;
    try {
        const result = await pool.query('UPDATE time_slots SET is_booked=True WHERE id=$1 RETURNING *', [timeslot_id]);
        
        // console.log(timeslot_id); 

        if (result.rows.length === 0) {
            res.status(404).json({ error: "Timeslot not found" });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export default { getFreeTimeslotsByEmployeeId, bookTimeslotByTimeslotId, getATimeslotById }