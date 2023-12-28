import '../styles/product.css';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ProductView = () => {
  const location = useLocation();
  const itemId = location.pathname.split('/').pop(); // Extract item ID from the URL
  const [itemDetails, setItemDetails] = useState({});
  const [liked, setLiked] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  setTimeout(function () {
    // Get the reference to the element by its ID
    const element = document.getElementById('product'); 

    // Scroll to the element if it exists
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },1);

  useEffect(() => {
    const auth = getAuth();
  
    const fetchItemDetails = async (userId) => {
      try {
        let url = `http://localhost:3001/api/items/${itemId}`;
        console.log("test", userId);
        if (userId) {
          url += `?user_id=${userId}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
  
        const data = await response.json();
        setItemDetails(data);
        console.log(data);
        setLiked(data.is_liked);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };
  
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.uid);
        fetchItemDetails(user.uid); // Fetch item details after user is available
      } else {
        setCurrentUser(null);
        fetchItemDetails(null); // Fetch item details without user ID
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, []);

  const handleLike = async () => {
    if (!currentUser) {
      // Handle case when user is not logged in
      // You might want to redirect the user to the login page or show a message
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/likes/${currentUser}/${itemId}`, {
        method: liked === 1 ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      setLiked(liked === 1 ? 0 : 1);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div id="product">
      {loading ? 
      <div className='loader-containerMed'>
        {/* <div className="loader"></div> */}
      </div> 
      : <>
      <h1 className="pageTitle">Product View</h1>
      <section className="py-5">
        <div className="container px-4 px-lg-5 my-5">
          <div className="row gx-4 gx-lg-5 align-items-center">
            <div className="col-md-6">
              <img className="card-img-top mb-5 mb-md-0" src={itemDetails.img_url} alt="Product" />
            </div>
            <div className="col-md-6">
              <div className="small mb-1">ID: {itemDetails.id}</div>
              <h1 className="display-5 fw-bolder">{itemDetails.title}</h1>
              <div className="fs-5 mb-5">
                {/* <span className="text-decoration-line-through">${oldPrice}</span> */}
                <span>{itemDetails.price}</span>
              </div>
              <br/>
              <p className="lead">{itemDetails.description}</p>
              <br/>
              <div className="d-flex">
                <p className="lead bold">In Stock:&nbsp;</p>
                <p className="lead">{itemDetails.quantity}</p>
                {/* <input
                  className="form-control text-center me-3"
                  id="inputQuantity"
                  type="number"
                  value={1}
                  style={{ maxWidth: '3rem' }}
                /> */}
                {/* <button className="btn btn-outline-dark flex-shrink-0" type="button">
                  <i className="bi-cart-fill me-1"></i>
                  Add to cart
                </button> taken out for now since are not using cart functionality */}
              </div>
              {currentUser != null ? (
                <div onClick={handleLike}>
                  {liked === 1 ? <div className='heart'></div> : <div className='heart clearHeart'></div>}
                </div>
              ) : ""}
            </div>
          </div>
        </div>
      </section>
      </>}
    </div>
  );
};

export default ProductView;