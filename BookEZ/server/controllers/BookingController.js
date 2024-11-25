import { pool } from '../config/database.js'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

const getBookingsByUserId = async (req, res) => {
    const user_id = req.params.user_id;
    try {
        const results = await pool.query('SELECT * FROM bookings WHERE user_id=$1', [user_id])
        
        if (results.rows.length === 0){
            res.status(200).json([])
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

        const user_data = await pool.query('SELECT full_name, email FROM users WHERE id=$1', [user_id])
        const user_email = user_data.rows[0].email
        const user_name = user_data.rows[0].full_name
        console.log(`User Email id: ${user_email}, User name: ${user_name}`)


        const salon_data = await pool.query('SELECT * from salons WHERE id=$1', [salon_id])
        const salon_email = salon_data.rows[0].email
        const salon_name = salon_data.rows[0].name
        console.log(`Salon Email id: ${salon_email}`)

        const employee_data = await pool.query('SELECT name FROM employees WHERE id=$1', [employee_id])
        const employee_name = employee_data.rows[0].name
        console.log(`Employee Name: ${employee_name}`)

        const timeslot_data = await pool.query('SELECT * FROM time_slots WHERE id=$1', [time_slot_id])
        const start_time = timeslot_data.rows[0].start_time
        const end_time = timeslot_data.rows[0].end_time
        console.log(`Start time: ${start_time}; End time: ${end_time}`)

        // Send confirmation email
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS
            }
        });

        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: user_email,
            subject: 'Booking Confirmation',
            text: `Your booking at ${salon_name} with ${employee_name} from ${start_time} to ${end_time} is confirmed.`
        };

        transporter.sendMail(userMailOptions, (error, info) => {
            if (error) {
                console.error(`Error sending email: ${error.message}`);
            } else {
                console.log(`Email sent to ${user_email}: ${info.response}`);
            }
        });

        const salonMailOptions = {
            from: process.env.EMAIL_USER,
            to: salon_email,
            subject: `Booking Confirmation for ${employee_name}`,
            text: `${user_name} has booked an appointment for ${employee_name} from ${start_time} to ${end_time}`
        };

        transporter.sendMail(salonMailOptions, (error, info) => {
            if (error) {
                console.error(`Error sending email: ${error.message}`);
            } else {
                console.log(`Email sent to ${salon_email}: ${info.response}`);
            }
        });

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