// components/Catalog.jsx
import React from "react";
import {useState, useEffect} from 'react';
import ProductCard from "../components/productCard";
import Dropdown from "../components/dropdown";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import "../styles/catalog.css";

const Likes = () => {
  // const [options, setOptions] = useState({
  // type: ['bracelets', 'earrings', 'necklaces & pendants', 'rings', 'other accessories'], 
  // color: ['silver', 'gold', 'rose gold', 'multi-color'],
  // metal: ['silver', 'gold', 'rose gold'],
  // minPrice: [10, 20, 50, 100, 200],
  // maxPrice: [20, 50, 100, 200, 500]
  // });

  // const [params, setParams] = useState({minPrice: undefined, maxPrice: undefined, color: '', type: '', metal: ''});

  // useEffect(() => {
  //   const fetchItems = async () => {
    
  //     const queryString = Object.entries(params)
  //     .filter(([_, value]) => value !== undefined && value !== '')
  //     .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
  //     .join('&');
    
  //   try {
  //     console.log(queryString)
  //     const response = await fetch(`http://localhost:3001/api/items/filter?${queryString}`);
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok.');
  //     }
      
  //     const data = await response.json();
  //     console.log(data);
  //     setItems(data);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }    
  // }
  // fetchItems();
  // }, [params]);

  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user.uid); // Set the user state to UID if the user is logged in
      } else {
        setUser(null); // Set the user state to null if there's no logged-in user
      }
    });

    return () => {
      // Unsubscribe from the auth state listener when the component unmounts
      unsubscribe();
    };
  }, []); // Empty dependency array to run this effect only once

  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (user) {
          const response = await fetch(`http://localhost:3001/api/likes/${user}`);
          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
          const data = await response.json();
          console.log(data);
          setItems(data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchItems();
  }, [user]);


  return (
    <>
      <h1 className="pageTitle">Likes</h1>
      {/* <div className="dropdowns">
          <Dropdown title="Category" options={options.type} params={params} setParams={setParams} filter="type"/>
          <Dropdown title="Color" options={options.color} params={params} setParams={setParams} filter="color"/>
          <Dropdown title="Metal" options={options.metal} params={params} setParams={setParams} filter="metal"/>
          <Dropdown title="Min Price" options={options.minPrice} params={params} setParams={setParams} filter="minPrice"/>
          <Dropdown title="Max Price" options={options.maxPrice} params={params} setParams={setParams} filter="maxPrice"/>
      </div> */}
      <section className="cards">
        { items.length === 0 ? "" : items.map((item) => ( //can add a no items found message here if you want
          <ProductCard
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
            liked={1}
          />
        ))
        }
      </section>
    </>
  );
};

export default Likes;
