import React from 'react'
import { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card.jsx'
import Search from '../components/SearchBar.jsx'
import api from "../services/api.jsx"
import favoritesApi from '../services/favoritesApi.js'

const Home = () => {  
  const [recipes, setRecipes] = useState([])
  const [favIds, setFavIds] = useState([])

  // filter / sort controls
  const [query, setQuery] = useState("")
  const [minRating, setMinRating] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")

  useEffect(() => {
    const loadRecipes = async () => {
      const data = await api.getRecipes()
      console.log("API DATA:", data)
      setRecipes(data)

      const favs = await favoritesApi.getFavorites()
      setFavIds(favs.map(f => f.recipe_id))
    }
    loadRecipes()
  }, [])

  const toggleFavorite = async (recipeId, isFav) => {
    setFavIds(prev =>
      isFav ? prev.filter(x => x !== recipeId) : [...prev, recipeId]
    )

    if (isFav) {
      await favoritesApi.deleteFavorite(recipeId)
    } else {
      await favoritesApi.createFavorite(recipeId)
    }
  }

  // Derive the visible list from `recipes` + the controls. We never mutate
  // `recipes` itself, so clearing a filter always brings every recipe back.
  const visibleRecipes = useMemo(() => {
    const search = query.trim().toLowerCase()

    const filtered = recipes.filter((r) => {
      const matchesSearch =
        search === "" || (r.title ?? "").toLowerCase().includes(search)

      // pg returns NUMERIC columns as strings, so coerce before comparing
      const matchesRating =
        minRating === "all" || Number(r.avg_rating ?? 0) >= Number(minRating)

      return matchesSearch && matchesRating
    })

    // The recipes table has no date column, so `id` (SERIAL) stands in for
    // insertion order: a higher id was added later.
    return [...filtered].sort((a, b) =>
      sortOrder === "newest" ? b.id - a.id : a.id - b.id
    )
  }, [recipes, query, minRating, sortOrder])

  return (
    <div>
      <div style={styles.titleBox}>
        <h1 style={styles.filterTitle}>
          Recipe Results ({visibleRecipes.length})
        </h1>
      </div>
      <div style={styles.filterBox}>
        
        <div style={styles.dropdownBox}>
          <div style={styles.dropdown}>
            <label style={styles.label} htmlFor="rating-filter">Min Rating:</label>
            <select
              id="rating-filter"
              style={styles.select}
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
            >
              <option value="all">All ratings</option>
              <option value="1">1+ stars</option>
              <option value="2">2+ stars</option>
              <option value="3">3+ stars</option>
              <option value="4">4+ stars</option>
            </select>
          </div>
          <div style={styles.dropdown}>
            <label style={styles.label} htmlFor="date-sort">Sort by Added:</label>
            <select
              id="date-sort"
              style={styles.select}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        <Search
          value={query}
          onChange={setQuery}
          placeholder="Search recipes..."
        />

      </div>
      <div style={styles.feed}>
        {visibleRecipes.map((r) => (
          <Card
            key={r.id}
            id={r.id}
            title={r.title}
            image_url={r.image_url}
            avg_rating={r.avg_rating}
            isFavorited={favIds.includes(r.id)}
            onToggle={toggleFavorite}
          ></Card>
        ))}

        {recipes.length > 0 && visibleRecipes.length === 0 && (
          <p style={styles.empty}>No recipes match your filters.</p>
        )}

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
  empty: {
    fontSize: '18px',
    padding: '10px',
  },
}
