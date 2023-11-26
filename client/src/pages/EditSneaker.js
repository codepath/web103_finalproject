import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./EditSneaker.css";

const EditSneaker = () => {
  const { id } = useParams();
  const [sneaker, setSneaker] = useState({
    id: 0,
    name: "",
    brand: "",
    description: "",
    price: "",
    size: "",
    color: "",
    stock_quantity: "",
    category: "",
    target_audience: "",
    image_url: "",
  });

  useEffect(() => {
    const fetchSneakerById = async () => {
      const response = await fetch("/api/sneakers/" + id);
      const data = await response.json();
      setSneaker(data);
    };

    fetchSneakerById();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSneaker((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const updateSneaker = (event) => {
    event.preventDefault();

    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sneaker),
    };

    fetch(`/api/sneakers/${id}`, options);
    window.location = "/";
  };

  const deleteSneaker = (event) => {
    event.preventDefault();

    const options = {
      method: "DELETE",
    };

    fetch(`/api/sneakers/${id}`, options);
    window.location = "/";
  };

  return (
    <div className="EditSneaker">
      <center>
        <h4 className="AddEdit">✏️ Edit Sneaker</h4>
      </center>
      <form>
        <label>Name</label> <br />
        <input
          type="text"
          id="name"
          name="name"
          value={sneaker.name}
          onChange={handleChange}
        />
        <br />
        <br />
        <label>Brand</label> <br />
        <input
          type="text"
          id="brand"
          name="brand"
          value={sneaker.brand}
          onChange={handleChange}
        />
        <br />
        <br />
        <label>Description</label>
        <br />
        <textarea
          rows="5"
          cols="50"
          id="description"
          name="description"
          value={sneaker.description}
          onChange={handleChange}
        ></textarea>
        <br />
        <label>Price</label>
        <br />
        <input
          type="text"
          id="price"
          name="price"
          value={sneaker.price}
          onChange={handleChange}
        />
        <br />
        <br />
        <label>Size</label>
        <br />
        <input
          type="text"
          id="size"
          name="size"
          value={sneaker.size}
          onChange={handleChange}
        />
        <br />
        <br />
        <label>Color</label>
        <br />
        <input
          type="text"
          id="color"
          name="color"
          value={sneaker.color}
          onChange={handleChange}
        />
        <br />
        <br />
        <label>Stock Quantity</label>
        <br />
        <input
          type="text"
          id="stock_quantity"
          name="stockquantity"
          value={sneaker.stock_quantity}
          onChange={handleChange}
        />
        <br />
        <br />
        <label>Category</label>
        <br />
        <input
          type="text"
          id="category"
          name="category"
          value={sneaker.category}
          onChange={handleChange}
        />
        <br />
        <br />
        <label>Target Audience</label>
        <br />
        <input
          type="text"
          id="target_audience"
          name="target_audience"
          value={sneaker.target_audience}
          onChange={handleChange}
        />
        <br />
        <br />
        <label>Image URL</label>
        <br />
        <input
          type="text"
          id="image_url"
          name="image_url"
          value={sneaker.image_url}
          onChange={handleChange}
        />
        <br />
        <input
          className="submitButton"
          type="submit"
          value="Edit"
          onClick={updateSneaker}
        />
        <button className="deleteButton" onClick={deleteSneaker}>
          Delete
        </button>
      </form>
    </div>
  );
};

export default EditSneaker;
