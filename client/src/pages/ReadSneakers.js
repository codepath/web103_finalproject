import React, { useState, useEffect } from 'react';
import SneakersCard from '../components/SneakersCard';
import './ReadSneakers.css';


const ReadSneakers = (props) => {

    const [posts, setPosts] = useState([]);
    const [brandSortOrder, setBrandSortOrder] = useState('descending');
    const [priceSortOrder, setPriceSortOrder] = useState('descending');

    useEffect(() => {
        setPosts(props.data);
    }, [props]);
    
    
    const handleBrandSort = () => {
        const sortedSneakers = [...posts].sort((a, b) => {
            if (brandSortOrder === 'ascending') {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });
        setPosts([...sortedSneakers]);

        setBrandSortOrder(brandSortOrder === 'descending' ? 'ascending' : 'descending');
    };

    const handlePriceSort = () => {
        const sortedSneakers = [...posts].sort((a, b) => {
            const priceA = parseFloat(a.price.replace('$', ''));
            const priceB = parseFloat(b.price.replace('$', ''));

            if (priceSortOrder === 'ascending') {
                return priceA - priceB;
            } else {
                return priceB - priceA;
            }
        });
        setPosts([...sortedSneakers]);

        setPriceSortOrder(priceSortOrder === 'descending' ? 'ascending' : 'descending');
    };

    return (
        <div>

        <div className="ReadSneakers">
            <div className="banner">
            <h3>Your Sneaker Journey</h3>
            <p className="welcome-paragraph">Thank you for joining us on this exciting journey through sneaker culture, fashion, and innovation. <br /> We invite you to explore, discover, and be inspired as we continue to fuel our passion and yours.</p>
        </div><br /> 

        <div className="Sort">
                <p>Sort By:</p>
                <button onClick={handleBrandSort}>
                    Brand ({brandSortOrder === 'ascending' ? ' A-Z' : ' Z-A'})
                </button> <br /><br />

                <button onClick={handlePriceSort}>
                    Price ({priceSortOrder === 'ascending' ? ' Low-High' : ' High-Low'})
                </button>
            </div>

            {
                posts && posts.length > 0 ?
                posts.map((post,index) => 
                   <SneakersCard key={post.id} 
                         id={post.id} 
                         brand_name={post.name} 
                         description={post.description} 
                         sizes={post.sizes} 
                         price={post.price}
                         image_url={post.image_url} />
                ) : <h3 className="noResults">{'No Sneakers Yet 😞'}</h3>
            }
        </div> 
    </div> 
    )
}

export default ReadSneakers;