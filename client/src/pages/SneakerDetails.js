import React, {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentBtn from '../components/CommentBtn'
import './SneakerDetails.css'

const SneakerDetails = ({data}) => {

    const {id} = useParams();
    const [post, setPost] = useState({id: 0, brand_name: "", description: "", sizes: "", price: "", img_url: ""})
    const [comments, setComments] = useState([])

    useEffect(() => {
        const result = data.filter(item => item.id === parseInt(id))[0];

        setPost({id: parseInt(result.id), brand_name: result.brand_name, description: result.description, sizes: result.sizes, price: result.price, img_url: result.img_url});


        const fetchComments = async () => {
            const response = await fetch('/api/comments/' + id)
            const data = await response.json()
            setComments(data)
        }

        fetchComments();

    }, [data, id]);


    return (
        <div className="out">
        <div className="details-banner">
        <h3 className="brand_name">{post.brand_name}</h3>
        <div className="details-container">
            <p className="details-description">{post.description}</p>
        </div>
        </div>

            <div className="flex-container">
                <div className="left-side" style={{ backgroundImage:`url(${post.img_url})`}}>
                </div>
                <div className="right-side">
                    {/* <p>{"✔️ Sizes: " + post.sizes }</p> */}
                    <p className="details-price">{"🏷️ Price: " + post.price}</p>
                    <p className="right-side-brand_name">{post.brand_name}</p>
                    <Link to={'../../comment/create/'+ id }><button className="addCommentBtn">Create Comment</button></Link>
                </div>
            </div>

            <div className="flex-container">
                <div className="comments-container">
                    <p className="heart-me"> ❤️ Heart me!</p>
                    <div className="comments">
                    {
                    comments && comments.length > 0 ?
                    comments.map((comment,index) => 
                        <CommentBtn id={comment.id}  num_votes={comment.num_votes} comments={comment.comment}/>
                    ) : ''
                    }
                </div>
                </div>
            </div>
            
        </div>
    
    )
}

export default SneakerDetails

