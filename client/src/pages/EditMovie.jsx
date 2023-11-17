import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import '../css/EditMovie.css';

const EditMovie = () => {
    const id = useParams().id;
    const [movie, setMovie] = useState({});

    // Create a state variable for the movie tags
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const getTags = async () => {
            try {
                const response = await fetch("/api/tags/");
                const data = await response.json();
                console.log(data);
                setTags(data);
            } catch (error) {
                console.error(error);
            }
        };
        getTags();
    }, []);

    /**
     * Hook to fetch movie data from the API
     */
    useEffect(() => {
        const fetchMovie = async () => {
            const response = await fetch(`/api/movies/${id}`);
            const data = await response.json();

            // Convert date to yyyy-mm-dd format
            const date = new Date(data.publish_date);
            const formattedDate = date.toISOString().split('T')[0];

            // Set the formatted date
            data.publish_date = formattedDate;

            setMovie(data);
        }
        fetchMovie();
    }, [id]);

    /**
     * Function to handle form input changes
     * @param {*} event 
     */
    const handleChange = (event) => {
        setMovie({
            ...movie,
            [event.target.name]: event.target.value,
        });
    };

    /**
     * Function to handle form submission
     * @param {*} event 
     */
    const handleSave = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`/api/movies/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(movie),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }

        // Route user back to home page after submitting form
        window.location.href = "/";
    }

    /**
     * Function to handle data deletion
     */
    const deleteData = async (event) => {
        event.preventDefault();

        // Display the confirmation dialog
        const userConfirmed = window.confirm("Are you sure you want to delete this movie?");

        if (userConfirmed) {
            try {
                const response = await fetch(`/api/movies/${id}`, {
                    method: "DELETE"
                });

                // Check if the delete was successful, then redirect
                if (response.ok) {
                    alert("Movie deleted successfully.");
                    window.location.href = "/";
                } else {
                    // Handle any errors if the fetch response wasn't ok
                    alert("There was an error deleting the movie.");
                }

            } catch (error) {
                console.error(error);
                alert("An error occurred while trying to delete the movie.");
            }
        } else {
            // If the user clicks "Cancel", do nothing
            console.log("User canceled the delete operation.");
        }
    }


    return (
        <div className='edit-movie'>
            <h2>Edit Movie #{id}</h2>
            <form>
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={movie.title}
                    onChange={handleChange}
                />

                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    name="description"
                    value={movie.description}
                    onChange={handleChange}
                />

                <label htmlFor="tag">Tags (Genre):</label>
                <select
                    id="tag"
                    name="tag"
                    value={movie.tag}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a genre</option>
                    {tags.map((tag) => (
                        <option key={tag.tag_id} value={tag.genre}>
                            {tag.genre}
                        </option>
                    ))}
                </select>

                <label htmlFor="poster">Image URL:</label>
                <input
                    type="text"
                    id="img_url"
                    name="img_url"
                    value={movie.img_url}
                    onChange={handleChange}
                />

                <label htmlFor="trailer">Trailer URL:</label>
                <input
                    type="text"
                    id="trailer_url"
                    name="trailer_url"
                    value={movie.trailer_url}
                    onChange={handleChange}
                />

                <label htmlFor="actors">Actors:</label>
                <input
                    type="text"
                    id="actors"
                    name="actors"
                    value={movie.actors}
                    onChange={handleChange}
                />

                <label htmlFor="director">Director:</label>
                <input
                    type="text"
                    id="director"
                    name="director"
                    value={movie.director}
                    onChange={handleChange}
                />

                <label htmlFor="publish_date">Publish Date:</label>
                <input
                    type="date"
                    id="publish_date"
                    name="publish_date"
                    value={movie.publish_date}
                    onChange={handleChange}
                />

                <div className='button-container'>
                    <button type="button" onClick={handleSave} className='edit'>
                        Save
                    </button>

                    <button type="button" onClick={deleteData} className='delete'>
                        Delete
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditMovie;
