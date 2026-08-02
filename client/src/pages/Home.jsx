import React from 'react'
import { useEffect, useState } from 'react'
import Card from '../components/Card.jsx'
import Search from '../components/SearchBar.jsx'
import pizzaimage from "../assets/pizza_image.jpg"
import fourstar from "../assets/fourstar.png"
import api from "../services/api.jsx"

const Home = ({ user }) => {
  const [recipes, setRecipes] = useState([])
  const [sortBy, setSortBy] = useState('none')

  useEffect(() => {
    const loadRecipes = async () => {
      const data = await api.getRecipes()
      console.log("API DATA:", data)
      setRecipes(data)
    }
    loadRecipes()
  }, [])

  const sortedRecipes = [...recipes].sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.avg_rating ?? 0) - (a.avg_rating ?? 0)
    }
    if (sortBy === 'newest') {
      return b.id - a.id
    }
    if (sortBy === 'oldest') {
      return a.id - b.id
    }
    return 0
  })

  return (
    <div>
      <div style={styles.titleBox}>
        <h1 style={styles.filterTitle}>Recipe Results</ h1>
      </div>
      <div style={styles.filterBox}>

        <div style={styles.dropdownBox}>
          <div style={styles.dropdown}>
            <label style={styles.label}>Sort by Rating:</label>
            <select
              style={styles.select}
              value={sortBy === 'rating' ? 'rating' : ''}
              onChange={(e) => setSortBy(e.target.value || 'none')}
            >
              <option value="">--</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>
          <div style={styles.dropdown}>
            <label style={styles.label}>Sort by Date:</label>
            <select
              style={styles.select}
              value={sortBy === 'newest' || sortBy === 'oldest' ? sortBy : ''}
              onChange={(e) => setSortBy(e.target.value || 'none')}
            >
              <option value="">--</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        <Search></Search>

      </div>
      <div style={styles.feed}>
        {sortedRecipes.map((r) => (
          <Card
            key={r.id}
            id={r.id}
            title={r.title}
            image_url={r.image_url}
            avg_rating={r.avg_rating}
            loggedIn={!!user?.id}
          ></Card>
        ))}

        {/* <Card title="pizza" image_url={pizzaimage} num_stars={4}></Card> */}

      </div>
    </div>
  )
}

export default Home;

const styles = {
  titleBox: {
    textAlign: 'left',
    paddingLeft: '5px',
  },
  filterTitle: {
    fontSize: '20px',
    // height: '1px',
  },
  filterBox: {
    border: 'solid black',
    marginBottom: '20px',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  selectBox: {
    fontSize: '20px',
    padding: '10px',
  },
  dropdownBox: {
    display: 'flex',
    gap: 20,
  },
  dropdown: {
    display: "flex",
    // flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  label: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  select: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  feed: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '10px',
  },
}
