import React from "react";
import "./Posts.css";
import { useEffect, useContext, useState } from "react";
import { UserContext } from "../../UserContext";
import PostCard from "../../Components/PostCard/PostCard";
//import { useState } from "react";

export default function Posts() {
  const { userContext } = useContext(UserContext);
  const [allPosts, setAllPosts] = useState([]);
  const [parsedPosts, setParsedPosts] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const url = `http://localhost:3000/posts`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        console.log(userContext);
        setAllPosts(data);
        setParsedPosts(data);
      } catch (error) {
        // Handle any network or API request errors
        alert("Login failed: " + error);
      }
    };
    fetchPosts();
  }, []);
  function runSearch(text) {
    if (text != "") {
      const inputText = text.toLowerCase();
      const newPost = allPosts.filter((post) => {
        if (post.title.toLowerCase().includes(inputText)) {
          return true;
        } else {
          return false;
        }
      });

      setParsedPosts(newPost);
    } else if (text === "") {
      setParsedPosts(allPosts);
    }
  }
  return (
    <div>
      <div className="row1-posts">
        <h1>Welcome explorer!</h1>
        <p>
          "Welcome to our vibrant Posts section. This is a digital space where
          knowledge meets community. Dive into a curated collection of
          insightful articles, engaging discussions, and the latest updates in
          the ever-evolving world of technology. Whether you're a seasoned
          professional, a passionate enthusiast, or a curious learner, our Posts
          section is designed to be your go-to destination for discovering
          trends, sharing experiences, and connecting with like-minded
          individuals. Explore thought-provoking content, stay informed about
          industry breakthroughs, and join the conversation that fuels
          innovation. Your journey into the digital realm begins here, where
          every post is a step toward expanding your tech horizons."
        </p>
      </div>
      <div className="row2-posts">
        <div className="row-search">
          <input
            className="searchBar"
            type="text"
            placeholder="search by title"
            value={search}
            onChange={(e) => {
              const word = e.target.value;
              setSearch(word);
              runSearch(word);
            }}
          />
          &nbsp;&nbsp;&nbsp;
          <button
            onClick={() => {
              runSearch(search);
            }}
            className="searchBarButton"
          >
            Search
          </button>
        </div>
        <p>{console.log(parsedPosts)}</p>
      </div>
    </div>
  );
}
