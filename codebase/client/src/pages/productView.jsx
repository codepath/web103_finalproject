import '../styles/product.css';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ProductView = () => {
    const location = useLocation();
    console.log(location);
    const productData = location.state.productData;
    const {category, title, price, imgSrc, imgHoverSrc, description, id, quantity, color, metal, curLiked} = productData;
    const [liked, setLiked] = useState(curLiked);
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
    }, []);

    const handleLike = () => {
      if (liked === 1) {
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
  

  return (
    <>
    <h1 className="pageTitle">Product View</h1>
    <section className="py-5">
      <div className="container px-4 px-lg-5 my-5">
        <div className="row gx-4 gx-lg-5 align-items-center">
          <div className="col-md-6">
            <img className="card-img-top mb-5 mb-md-0" src={imgSrc} alt="..." />
          </div>
          <div className="col-md-6">
            <div className="small mb-1">ID: {id}</div>
            <h1 className="display-5 fw-bolder">{title}</h1>
            <div className="fs-5 mb-5">
              {/* <span className="text-decoration-line-through">${oldPrice}</span> */}
              <span>{price}</span>
            </div>
            <br/>
            <p className="lead">{description}</p>
            <br/>
            <div className="d-flex">
              <p className="lead bold">In Stock:&nbsp;</p>
              <p className="lead">{quantity}</p>
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
            <div onClick={handleLike}>
              {liked === 1 ? <div className='heart'></div> : <div className='heart clearHeart'></div>}
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default ProductView;