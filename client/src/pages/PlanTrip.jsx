    import React, { useState } from 'react';
    import '../App.css';
    import '../css/PlanTrip.css';
    import invite_people_icon from '../assets/invite_people_icon.png';
    import add_destination from '../assets/add_destination.png';
    import Trip from '../components/Trip.jsx';

    const PlanTrip = () => {
        const [trip, setTrip] = useState({
            id: 0,
            title: "",
            description: "",
            start_point: "",
            end_point: "",
            num_days: 0,
            start_date: "",
            end_date: "",
            mode_of_transport: "",
            chosen_destination: "",
            time_to_spend: "",
            budget: 0.0,
            currency: "",
        });
        
        const [attractions, setAttractions] = useState([]);

        const handleChange = (event) => {
            const { name, value } = event.target;
            setTrip((prev) => ({
                ...prev,
                [name]: value,
            }));
        };

        const createTrip = async (event) => {
            event.preventDefault();
            try {
                const response = await fetch('/api/trips', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(trip),
                });

                if (response.ok) {
                    console.log('Trip created successfully');
                    alert('Trip created successfully!');
                    setTrip({
                        id: 0,
                        title: "",
                        description: "",
                        start_point: "",
                        end_point: "",
                        num_days: 0,
                        start_date: "",
                        end_date: "",
                        mode_of_transport: "",
                        chosen_destination: "",
                        time_to_spend: "",
                        budget: 0.0,
                        currency: "",
                    });
                } else {
                    console.error('Failed to create trip');
                    alert('Failed to create trip');
                }
            } catch (error) {
                console.error('Error while creating trip:', error);
            }
        };
        
        const resetTrip = (event) => {
            event.preventDefault();
            setTrip({
                        id: 0,
                        title: "",
                        description: "",
                        start_point: "",
                        end_point: "",
                        num_days: 0,
                        start_date: "",
                        end_date: "",
                        mode_of_transport: "",
                        chosen_destination: "",
                        time_to_spend: "",
                        budget: 0.0,
                        currency: "",
                    });
        }
        
        const fetchAttractions = async () => {
            if (!trip.start_point || !trip.end_point) return;

            try {
                const directionsResponse = await fetch(
                    `http://localhost:3000/api/directions?origin=${encodeURIComponent(trip.start_point)}&destination=${encodeURIComponent(trip.end_point)}`
                );
                const directionsData = await directionsResponse.json();
                setAttractions(directionsData.places);
                console.log(attractions);
            } catch (error) {
                console.error("Error fetching attractions:", error);
            }
        };

        const handleAttractionClick = (attraction) => {
            setTrip((prev) => ({
                ...prev,
                chosen_destination: attraction,
            }));
        };

            return (
                <div className='plan_trip'>
                    <div className='plan-trip-ribbon'>
                        <div className="plan-trip-ribbon-title">
                            <div className="title1"><h4>Plan your</h4></div>
                            <div className='subtitle1'><h4>Trip</h4></div>
                        </div>
                        <div className = 'icons'>
                            <img src={invite_people_icon}/>
                        </div>
                    </div>
                    <table className='form-table'>
                    <tbody>
                        <tr>
                            <td><label className="form-label">Title:</label></td>
                            <td><input type='text' name='title' placeholder='Up to 50 Characters' className='inputCustomSize1' value={trip.title} onChange={handleChange} /></td>
                            <td><label className="form-label">Description:</label></td>
                            <td><input type='text' name='description' placeholder='Up to 200 Characters' className='inputCustomSize2' value={trip.description} onChange={handleChange} /></td>
                        </tr>
                    </tbody>
                </table>
                        <table className='form-table1'>
                        <tbody>
                            <tr>
                                <td><label className="form-label">Start Point:</label></td>
                                <td><input type='text' name='start_point'  value={trip.start_point} onChange={handleChange} onBlur={fetchAttractions} className='inputCustomSize1' /></td>
                                <td><label className="form-label">End Point:</label></td>
                                <td><input type='text' name='end_point'  value={trip.end_point} onChange={handleChange} onBlur={fetchAttractions} className='inputCustomSize1' /></td>
                                <td><label className="form-label">Duration:</label></td>
                                <td>
                                    <div className="duration-container">
                                        <input type='number' name= 'num_days' className='inputCustomSize1' value={trip.num_days} onChange={handleChange}  />
                                        <label className="form-label">days</label>
                                    </div>
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><label className="form-label">Start Date:</label></td>
                                <td><input type='date' name='start_date' className='inputCustomSize1' value={trip.start_date} onChange={handleChange} /></td>
                                <td><label className="form-label">End Date:</label></td>
                                <td><input type='date' name='end_date' className='inputCustomSize1' value={trip.end_date} onChange={handleChange} /></td>
                                <td><label className="form-label">Mode of Transport:</label></td>
                                <td>
                                    <div className="radio-container">
                                    <input type="radio" id="flight" name="mode_of_transport" value="Flight" checked={trip.mode_of_transport === "Flight"} onChange={handleChange} />
                                    <label  className="form-label" htmlFor="flight">Flight</label>
                                    <input type="radio" id="car" name="mode_of_transport" value="Car" checked={trip.mode_of_transport === "Car"} onChange={handleChange} /><label className="form-label" htmlFor="car">Car</label>
                                    </div>
                                    </td>
                                    <td></td>
                            </tr>
                            <tr>
                                <td><label className="form-label">Add Destination:</label></td>
                                <td><input type='text' className='inputCustomSize1'  value='Must-See Attractions' readOnly /></td>
                                <td></td>
                            </tr>
                            </tbody>
                            </table>

                            <div className="attractions-container">
                            <div className="subtitle2">
                                <h4>Attractions:</h4>
                            </div>
                            <div className="attractions-list">
                                {attractions.map((attraction, index) => (
                                     <Trip key={index} name={attraction} onClick={() => handleAttractionClick(attraction)} />
                                    ))}
                            </div>
                        </div>

                                <table className='form-table1'>
                                <tbody>
                            <tr>
                                <td><label className="form-label">Chosen Destination:</label></td>
                                <td><input type='text' placeholder='Enter chosen destination' className='inputCustomSize1'  value={trip.chosen_destination} onChange={handleChange} /></td>
                                <td><label className="form-label">Time to Spend:</label></td>
                                <td><input type='text' name = "time_to_spend" placeholder='HH:MM' className='inputCustomSize1'  value={trip.time_to_spend} onChange={handleChange} /></td>
                                <td><label className="form-label">Budget:</label></td>
                                <td>
                                <input type="number" name="budget" className='inputCustomSize1' value={trip.budget} onChange={handleChange} /></td>
                                    <td><input type='text' className='inputCustomSize2' name="currency" value='USD' readOnly />
                                    
                                    </td>
                            </tr>
                            <tr>
                                <td colSpan='6'>
                                        <div className='destination-container'>
                                            <div className='icon'><img src={add_destination}/></div>
                                            <div className="title1"><h4>Add</h4></div>
                                            <div className='subtitle2'><h4>Destination</h4></div>
                                        </div>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>	
                                <td></td>
                                <td></td>
                                <td>
                                <div className='button-container'>
                                    <button type='submit' onClick={createTrip}>Submit</button>
                                    <button type='button' onClick={resetTrip}>Cancel</button>
                                </div> 
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        };
        
        export default PlanTrip;