import React, { useState, useEffect } from 'react';
import SneakersCard from '../components/SneakersCard';
import './ReadSneakers.css';


const ReadSneakers = (props) => {

    const [posts, setPosts] = useState([]);
    

    useEffect(() => {
        setPosts(props.data);
    }, [props]);
    
    return (
        <div>

        <div className="ReadSneakers">
        <div className="banner">
        <h3>Your Sneaker Journey</h3>
        <p className="welcome-paragraph">Thank you for joining us on this exciting journey through sneaker culture, fashion, and innovation. <br /> We invite you to explore, discover, and be inspired as we continue to fuel our passion and yours.</p>
        </div>

            {
                posts && posts.length > 0 ?
                posts.map((post,index) => 
                   <SneakersCard key={post.id} 
                         id={post.id} 
                         brand_name={post.brand_name} 
                         description={post.description} 
                         sizes={post.sizes} 
                         price={post.price}
                         img_url={post.img_url} />
                ) : <h3 className="noResults">{'No Sneakers Yet 😞'}</h3>
            }
        </div> 
    </div> 
    )
}

export default ReadSneakers;