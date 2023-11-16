import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Book.css'

const EditBook = ( {data, api_url} ) => {
    const {id} = useParams();
    const [post, setPost] = useState({id: 0, name: '', author: '', image: '', description: '' })

    useEffect(() => {
        const result = data.filter(item => item.id === parseInt(id))[0];
        setPost({
            id: parseInt(result.id), 
            name: result.name,
            author: result.author,
            image: result.image,
            description: result.description
        });
    }, [data, api_url, id]);

    const isValidImageUrl = (url) => {
        // Basic URL format validation
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    };

    const handleChange = (event) => {
        const {name, value} = event.target;
        setPost( (prev) => {
            return {
                ...prev,
                [name]:value,
            }
        })
    }
    

    const updatePost = async (event) => {
        event.preventDefault();

        // Validate the image URL before submitting
        if (!isValidImageUrl(post.image)) {
            alert('Please provide a valid image URL.');
            return; // Prevent form submission if URL is invalid
        }

        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        }
        

        await fetch(`${api_url}/api/books/` + id, options)

        window.location.href =  `/book/details/${id}`
    }


    const deletePost = async (event) => {
        event.preventDefault();

        const options = {
            method: 'DELETE'
        }
        
        await fetch(`${api_url}/api/books/`+ id, options)

        window.location.href = '/browse'
    }

    return (
        <div>
            <center><h3> Update Book</h3></center>
            <form>
                <label>Title</label> <br />
                <input type="text" id="name" name="name" value={post.name} onChange={handleChange}/><br />
                <br/>

                <label>Author</label><br />
                <input type="text" id="author" name="author" value={post.author} onChange={handleChange}/><br />
                <br/>

                <label>Image URL </label><br />
                <input type="text" id="image" name="image" value={post.image} onChange={handleChange}/><br />
                <br/>

                <label>Description</label><br />
                <br />
                <textarea rows="5" cols="50" id="description" name="description" value={post.description} onChange={handleChange}>
                </textarea>
                <br/>

                <input type="submit" value="Submit" onClick={updatePost}/>
                <button className="deleteButton" onClick={deletePost}>Delete</button>
            </form>
        </div>
    )
}

export default EditBook
