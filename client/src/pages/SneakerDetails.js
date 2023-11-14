import React, {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentBtn from '../components/CommentBtn'
import './SneakerDetails.css'

const SneakerDetails = ({data}) => {

    const {id} = useParams();
    const [post, setPost] = useState({id: 0, name: "", description: "", sizes: "", price: "", image_url: ""})
    const [comments, setComments] = useState([])

    useEffect(() => {
        const result = data.filter(item => item.id === parseInt(id))[0];

        setPost({id: parseInt(result.id), name: result.name, description: result.description, sizes: result.sizes, price: result.price, image_url: result.image_url});


        const fetchComments = async () => {
            const response = await fetch('/api/reviews/' + id)
            const data = await response.json()
            setComments(data)
        }

        fetchComments();

    }, [data, id]);


    return (
        <div className="out">
        <div className="details-banner">
        <h3 className="brand_name">{post.name}</h3>
        <div className="details-container">
            <p className="details-description">{post.description}</p>
        </div>
        </div>

            <div className="flex-container">
                <div className="left-side" style={{ backgroundImage:`url(${post.image_url})`}}>
                </div>
                <div className="right-side">
                    {/* <p>{"✔️ Sizes: " + post.sizes }</p> */}
                    <p className="details-price">{"🏷️ Price: " + post.price}</p>
                    <p className="right-side-brand_name">{post.name}</p>
                    <Link to={'../../comment/reviews/'+ id }><button className="addCommentBtn">Review</button></Link>
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

