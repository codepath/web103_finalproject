import React from 'react';
import '../App.css';
import '../css/PlanTrip.css';
import invite_people_icon from '../assets/invite_people_icon.png';

const PlanTrip = () => {
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
                    <td><input type='text' placeholder='Enter title' /></td>
                    <td><label className="form-label">Description:</label></td>
                    <td><input type='text' placeholder='Enter description' /></td>
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
                    <td><input type='date' /></td>
                    <td><label className="form-label">End Date:</label></td>
                    <td><input type='date' /></td>
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
                        <input type='text' placeholder='Enter budget' />
                    </td>
                </tr>
                <tr>
                    <td colSpan='6'>
                        <button type='button'>Add Destination</button>
                    </td>
                </tr>
                <tr>
                    <td colSpan='6' style={{ textAlign: 'center' }}>
                        <button type='submit'>Submit</button>
                        <button type='button'>Cancel</button>
                    </td>
                </tr>
            </table>
        </div>
    );
};

export default PlanTrip;
