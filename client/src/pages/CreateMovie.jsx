import React, { useState } from "react";
import '../css/CreateMovie.css';

const CreateMovie = () => {
    // Create a state variable for the form data
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        actors: "",
        director: "",
        publish_date: null,
        img_url: "",
        trailer_url: "",
    });

    /**
     * Function to handle form input changes
     * @param {*} event 
     */
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    /**
     * Function to handle form submission
     * @param {*} event 
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("/api/movies/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }

        // Route user back to home page after submitting form
        window.location.href = "/";

    };

    return (
        <div className="create-movie">
            <h2>Create a New Movie</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="poster">Image URL:</label>
                <input
                    type="text"
                    id="img_url"
                    name="img_url"
                    value={formData.img_url}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="trailer">Trailer URL:</label>
                <input
                    type="text"
                    id="trailer_url"
                    name="trailer_url"
                    value={formData.trailer_url}
                    onChange={handleChange}
                />

                <label htmlFor="actors">Actors:</label>
                <input
                    type="text"
                    id="actors"
                    name="actors"
                    value={formData.actors}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="director">Director:</label>
                <input
                    type="text"
                    id="director"
                    name="director"
                    value={formData.director}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="publish_date">Publish Date:</label>
                <input
                    type="date"
                    id="publish_date"
                    name="publish_date"
                    value={formData.publish_date}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Create Movie</button>
            </form>
        </div>
    );
};

export default CreateMovie;
