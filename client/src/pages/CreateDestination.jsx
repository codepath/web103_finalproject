import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './CreateDestination.css'

const CreateDestination = () => {

    const [destination, setDestination] = useState({destination: "", description: "", city: "", country: "", img_url: "", flag_img_url: "" })
    const {trip_id} = useParams();

    const handleChange = (event) => {
        const {name, value} = event.target;
        setDestination( (prev) => {
            return {
                ...prev,
                [name]:value,
            }
        })
    }
    
    const createDestination = async (event) => {
        
        event.preventDefault();


        const addDestination = async () => {

 
        
        }

        const createTripDestination = async (destination_id) => {


        
        }


    }

    return (
        <div>
            <center><h3>Add Destination</h3></center>
            <form>
                <label>Destination</label> <br />
                <input type="text" id="destination" name="destination" value={destination.destination} onChange={handleChange}/><br />
                <br/>

                <label>Description</label><br />
                <textarea rows="5" cols="50" id="description" name="description" value={destination.description} onChange={handleChange}>
                </textarea>
                <br/>

                <label>City </label><br />
                <input type="text" id="city" name="city" value={destination.city} onChange={handleChange}/><br />
                <br/>

                <label>Country</label><br />
                <input type="text" id="country" name="country" value={destination.country} onChange={handleChange}/><br />
                <br/>

                <label>Image URL </label><br />
                <input type="text" id="img_url" name="img_url" value={destination.img_url} onChange={handleChange}/><br />
                <br/>

                <label>Flag Image URL</label><br />
                <input type="text" id="flag_img_url" name="flag_img_url" value={destination.flag_img_url} onChange={handleChange}/><br />
                <br/>

                <label>Trip ID</label><br />
                <input type="text" id="flag_img_url" name="flag_img_url" value={trip_id} readOnly/><br />
                <br/>

                <input type="submit" value="Submit" onClick={createDestination} />
            </form>
        </div>
    )
}

export default CreateDestination