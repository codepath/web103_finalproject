import '../styles/product.css';

const Product = (props) => {
    const { imageUrl, sku, title, oldPrice, newPrice, description } = props;

  return (
    <>
    <h1 className="pageTitle">Product</h1>
    <section className="py-5">
      <div className="container px-4 px-lg-5 my-5">
        <div className="row gx-4 gx-lg-5 align-items-center">
          <div className="col-md-6">
            <img className="card-img-top mb-5 mb-md-0" src={imageUrl} alt="..." />
          </div>
          <div className="col-md-6">
            <div className="small mb-1">SKU: {sku}</div>
            <h1 className="display-5 fw-bolder">{title}</h1>
            <div className="fs-5 mb-5">
              <span className="text-decoration-line-through">${oldPrice}</span>
              <span>${newPrice}</span>
            </div>
            <p className="lead">{description}</p>
            <div className="d-flex">
              <svg className="card__like me-3" viewBox="0 0 24 24">
                <path fill="#000000" d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z" />
              </svg>
              <input
                className="form-control text-center me-3"
                id="inputQuantity"
                type="number"
                value={props.quantity || 1}
                style={{ maxWidth: '3rem' }}
              />
              {/* <button className="btn btn-outline-dark flex-shrink-0" type="button">
                <i className="bi-cart-fill me-1"></i>
                Add to cart
              </button> taken out for now since are not using cart functionality */}
              
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Product;