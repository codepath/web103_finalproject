import React, { useState } from 'react';
import './CreateTrip.css'
import invite_people_icon from '../assets/invite_people_icon.png'

const CreateTrip = () => {

    const [trip, setTrip] = useState({id: 0, title: "", description: "", img_url: "", num_days: 0, start_date: "", end_date: "", total_cost: 0.0 })
    
    const handleChange = (event) => {
        const {name, value} = event.target;
        setTrip( (prev) => {
            return {
                ...prev,
                [name]:value,
            }
        })
    }
    
    const createTrip = (event) => {
        event.preventDefault();
        const options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(trip)
        }

        fetch('/api/trips', options)
        window.location.href = '/'
    }
    
    const resetTrip = (event) => {
        event.preventDefault();
        setTrip({id: 0, title: "", description: "", img_url: "", num_days: 0, start_date: "", end_date: "", total_cost: 0.0 })
    }

    return (
        <div className='plan_trip'>
            <div className='plan-trip-ribbon'>
                <div className="plan-trip-ribbon-title">
                    <div className="title"><h4>Plan your</h4></div>
                    <div className='subtitle'><h4>Trip</h4></div>
                </div>
                <div className = 'icons'>
                    <img src={invite_people_icon}/>
                </div>
            </div>
            <table className='form-table'>
                <tr>
                    <td><label className="form-label">Title:</label></td>
                    <td><input type="text" id="title" name="title" value={trip.title} onChange={handleChange}/></td>
                    <td><label className="form-label">Description:</label></td>
                    <td><input type="text" id="description" name="description" value={trip.description} onChange={handleChange}/></td>
                </tr>
                <tr>
                    <td><label className="form-label">Start Point:</label></td>
                    <td><input type='text' placeholder='Enter start point' /></td>
                    <td><label className="form-label">End Point:</label></td>
                    <td><input type='text' placeholder='Enter end point' /></td>
                    <td><label className="form-label">Duration:</label></td>
                    <td><input type='text' placeholder='Enter duration' /></td>
                </tr>
                <tr>
                    <td><label className="form-label">Start Date:</label></td>
                    <td><input type="text" id="start_date" name="start_date" value={trip.start_date} onChange={handleChange}/></td>
                    <td><label className="form-label">End Date:</label></td>
                    <td><input type="text" id="end_date" name="end_date" value={trip.end_date} onChange={handleChange}/></td>
                    <td><label className="form-label">Mode of Transport:</label></td>
                    <td>
                        <input type='radio' id='flight' name='transport' value='Flight' />
                        <label htmlFor='flight'>Flight</label>
                        <input type='radio' id='car' name='transport' value='Car' />
                        <label htmlFor='car'>Car</label>
                    </td>
                </tr>
                <tr>
                    <td><label className="form-label">Add Destination:</label></td>
                    <td>
                        <select>
                            <option value='must-see'>Must-see attractions</option>
                            <option value='accommodation'>Accommodation</option>
                            <option value='restaurants'>Restaurants</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td><label className="form-label">Chosen Destination:</label></td>
                    <td><input type='text' placeholder='Enter chosen destination' /></td>
                    <td><label className="form-label">Time to Spend:</label></td>
                    <td><input type='text' placeholder='HH:MM' /></td>
                    <td><label className="form-label">Budget:</label></td>
                    <td>
                        <select>
                            <option value='USD'>USD</option>
                            <option value='EUR'>EUR</option>
                            <option value='INR'>INR</option>
                        </select>
                        <input type="text" id="total_cost" name="total_cost" value={trip.total_cost} onChange={handleChange}/>
                    </td>
                </tr>
                <tr>
                    <td colSpan='6'>
                        <button type='button'>Add Destination</button>
                    </td>
                </tr>
                <tr>
                    <td colSpan='6' style={{ textAlign: 'center' }}>
                        <input type="submit" value="Submit" onClick={createTrip}/>
                        <input type='submit' value="Cancel" onClick={resetTrip}></input>
                    </td>
                </tr>
            </table>
        </div>
    )
}

export default CreateTrip