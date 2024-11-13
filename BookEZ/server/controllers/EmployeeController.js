import { pool } from '../config/database.js'

const getEmployeeBySalonId = async (req, res) => {
    const salon_id = req.params.salon_id;
    try {
        const results = await pool.query('SELECT * FROM employees WHERE salon_id=$1', [salon_id])
        
        if (results.rows.length === 0){
            res.status(404).json({ error: "No employee found for this salon" })

        } else {
            res.status(200).json(results.rows);
        }
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

const getEmployeeById = async (req, res) => {
    const employeeId = req.params.employee_id;
    try {
        const results = await pool.query('SELECT * FROM employees WHERE id=$1', [employeeId])
        
        if (results.rows.length === 0){
            res.status(404).json({ error: "This employee is found at this salon" })
        } else {
            res.status(200).json(results.rows[0]);
        }
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

export default { getEmployeeBySalonId, getEmployeeById }