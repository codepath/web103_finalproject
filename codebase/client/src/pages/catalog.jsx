// components/Catalog.jsx
import React from "react";
import {useState, useEffect, useMemo} from 'react';
import ProductCard from "../components/productCard";
import Dropdown from "../components/dropdown";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import "../styles/catalog.css";

const Catalog = () => {
  const [options, setOptions] = useState({
  type: ['bracelets', 'earrings', 'necklaces & pendants', 'rings', 'other accessories'], 
  color: ['silver', 'gold', 'rose gold', 'multi-color'],
  metal: ['silver', 'gold', 'rose gold'],
  minPrice: [10, 20, 50, 100, 200],
  maxPrice: [20, 50, 100, 200, 500]
  });

  const [params, setParams] = useState({minPrice: undefined, maxPrice: undefined, color: '', type: '', metal: ''});
  const [items, setItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = useMemo(() => getAuth(), []);

  useEffect(() => {  
    // Function to fetch items
    const fetchItems = async (userId) => {
      console.log("test1")
      try {
        const queryString = Object.entries(params)
          .filter(([_, value]) => value !== undefined && value !== '')
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&');
  
        let url = 'http://localhost:3001/api/items/filter';
        url += `?${queryString}`;
  
        if (userId) {
          url += `&currentUserId=${userId}`;
        }
  
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
  
        const data = await response.json();
        setItems(data);
        console.log(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };
  
    // Check for existing user authentication
    const currentUser = auth.currentUser;
    if (currentUser) {
      fetchItems(currentUser.uid);
    }
  
    // Set up authentication listener only if not authenticated
    const unsubscribe = !currentUser ? onAuthStateChanged(auth, (user) => {
      console.log("test2")
      if (user) {
        setCurrentUser(user.uid);
        fetchItems(user.uid);
      } else {
        setCurrentUser(null);
        fetchItems(null);
      }
    }) : () => {};
  
    return () => {
      unsubscribe();
    };
  }, [params]);

  return (
    <>
      <h1 className="pageTitle">Catalog</h1>
      <div className="dropdowns">
          <Dropdown title="Category" options={options.type} params={params} setParams={setParams} filter="type"/>
          <Dropdown title="Color" options={options.color} params={params} setParams={setParams} filter="color"/>
          <Dropdown title="Metal" options={options.metal} params={params} setParams={setParams} filter="metal"/>
          <Dropdown title="Min Price" options={options.minPrice} params={params} setParams={setParams} filter="minPrice"/>
          <Dropdown title="Max Price" options={options.maxPrice} params={params} setParams={setParams} filter="maxPrice"/>
      </div>
        {loading ? <div className="loader-containerSml"><div className="loader"></div></div> :
        <section className="cards">
        { items.length === 0 ? "" : items.map((item) => ( //can add a no items found message here if you want
          <ProductCard
            key={item.id}
            category={item.type}
            title={item.title}
            price={item.price}
            imgSrc={item.img_url}
            imgHoverSrc={item.img_url}
            description={item.description}
            id={item.id}
            quantity={item.quantity}
            color={item.color}
            metal={item.metal}
            liked={item.is_liked}
          />
        ))
        }
        </section>
        }
    </>
  );
};

export default Catalog;
