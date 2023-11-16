import React, { useState } from 'react';
import '../styles/AddBook.css'

const AddBook = () => {
    const [book, setBook] = useState({ id: 0, name: '', author: '', image: '', description: '' });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setBook((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }

    const isValidImageUrl = (url) => {
        // Basic URL format validation
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    };

    const createBook = async (event) => {
        event.preventDefault()

        // Validate the image URL before submitting
        if (!isValidImageUrl(book.image)) {
            alert('Please provide a valid image URL.');
            return; // Prevent form submission if URL is invalid
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(book)
        }

        await fetch(`http://localhost:3001/api/books`, options)
        window.location.href = '/browse'
    }

    return (
        <div>
            <center><h3>Add New Book</h3></center>
            <form>
                <label>Title</label> <br />
                <input type="text" id="name" name="name" value={book.name} onChange={handleChange}/><br />
                <br/>

                <label>Author</label><br />
                <input type="text" id="author" name="author" value={book.author} onChange={handleChange}/><br />
                <br/>

                <label>Image URL </label><br />
                <input type="text" id="image" name="image" value={book.image} onChange={handleChange}/><br />
                <br/>

                <label>Description</label><br />
                <br />
                <textarea rows="5" cols="50" id="description" name="description" value={book.description} onChange={handleChange}>
                </textarea>
                <br/>

                <input type="submit" value="Submit" onClick={createBook} />
            </form>
        </div>
    )
}

export default AddBook