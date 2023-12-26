import {Link} from "react-router-dom";
import "../styles/productCard.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function ProductCard({ category, title, price, imgSrc, imgHoverSrc, description, id, quantity, color, metal, liked}) {
  const [curLiked, setLiked] = useState(liked);
  const productData = {
    category,
    title,
    price,
    imgSrc,
    imgHoverSrc,
    description,
    id,
    quantity,
    color,
    metal,
    curLiked
  };
  const location = useLocation().pathname;
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.uid);
      } else {
        setCurrentUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
    console.log(currentUser);
  }, []);

  const handleLike = (e) => {
    e.preventDefault(); // Prevent the default link navigation behavior
    e.stopPropagation(); // Prevent event propagation to the parent elements
    if (curLiked === 1) {
      setLiked(0);
      const deleteLike = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/likes/${currentUser}/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
      deleteLike();
    } else {
      setLiked(1);
      const createLike = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/likes/${currentUser}/${id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
      createLike();
    }
  }

  return (<>
    {location == "/edititems" ? 
    <div className="card">
      <div className="editImgOverlayDiv">
      <Link to="/editItem" state={{productData:productData}}
      className="card_link removeLinkStyling">
    <div
      className="card__img lowerOpacity"
      style={{ backgroundImage: `url(${imgSrc})` }}
    ></div>
      <div
        className="card__img--hover editIconOpacity"
        style={{ backgroundImage: `url(${imgHoverSrc})` }}
      ></div>
    <div className="card__info">
      <span className="card__category">{category}</span>
      <h3 className="card__title">{title}</h3>
      <span className="card__by">
        <a className="card__author" title="author">{price}</a>
      </span>
      {/* <button className="btn btn-outline-dark flex-shrink-0" type="button">
          <i className="bi-cart-fill me-1"></i>
          Add to cart
      </button> taken out for now since we are not using the cart currently */}
    </div>
    <div className="card__info-hover">
      {/* <div className="card__clock-info">
        <svg className="card__clock" viewBox="0 0 24 24">
          <path d="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z" />
        </svg>
        <span className="card__time">{time}</span>
      </div> can use this icon on the top right for something else */}
    </div>
    </Link>
  </div>
  </div>
  :
  <div className="card">
  <Link to={`/productview/${id}`} state={{productData:productData}}
    className="card_link removeLinkStyling">
  <div
  className="card__img"
  style={{ backgroundImage: `url(${imgSrc})` }}
  ></div>
  <div
  className="card__img--hover"
  style={{ backgroundImage: `url(${imgHoverSrc})` }}></div>
  <div className="card__info">
  <span className="card__category">{category}</span>
  <h3 className="card__title">{title}</h3>
  <span className="card__by">
    <a className="card__author" title="author">{price}</a>
  </span>
  {/* <button className="btn btn-outline-dark flex-shrink-0" type="button">
      <i className="bi-cart-fill me-1"></i>
      Add to cart
  </button> taken out for now since we are not using the cart currently */}
  </div>
  <div className="card__info-hover"> {/* change opacity to 0 to only show these icons on hover. right now that feature is off */}
  <div className="lowerOpacity" onClick={handleLike}>
  {currentUser != null ? ( // Check if a guest user is logged in
                  <>
                  {curLiked === 1 ? (
                    <div className="heart"></div>
                  ) : (
                    <div className="heart clearHeart"></div>
                  )}
                  </>
              ) : ""}  
  </div>
  {/* <div className="card__clock-info">
    <svg className="card__clock" viewBox="0 0 24 24">
      <path d="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z" />
    </svg>
    <span className="card__time">{time}</span>
  </div> can use this icon on the top right for something else */}
  </div>
  </Link>
  </div>
  }</>
  );
}

export default ProductCard;
