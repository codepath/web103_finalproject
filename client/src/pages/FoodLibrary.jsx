import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import './FoodLibrary.css'

const FoodLibrary = () => {
  const [foodItems, setFoodItems] = useState([])
  const [search, setSearch] = useState('')
  const [editItem, setEditItem] = useState(null)
  const [deleteError, setDeleteError] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchFoodItems()
  }, [])

  const fetchFoodItems = async () => {
    try {
      const res = await fetch('/api/food-items')
      const data = await res.json()
      if (res.ok && Array.isArray(data)) setFoodItems(data)
      else setError('Failed to load food items. Please try again.')
    } catch {
      setError('Failed to load food items. Please try again.')
    }
  }

  const handleDelete = async (id) => {
    const res = await fetch(`/api/food-items/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setFoodItems(foodItems.filter(item => item.id !== id))
      setDeleteError(null)
    } else {
      setDeleteError('This food item is used in a meal and cannot be deleted.')
    }
  }

  const handleEditChange = (e) => {
    setEditItem({ ...editItem, [e.target.name]: e.target.value })
  }

  const handleEditSave = async () => {
    await fetch(`/api/food-items/${editItem.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editItem),
    })
    setFoodItems(foodItems.map(i => i.id === editItem.id ? editItem : i))
    setEditItem(null)
  }

  const filtered = foodItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-container">
      <div className="food-library-header">
        <div>
          <h1>Food Library</h1>
          <p className="page-subtitle">Manage your food item database</p>
        </div>
        <Link to="/foods/new">
          <button className="btn-primary">+ Add Food Item</button>
        </Link>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="search-wrapper">
          <span className="search-icon-lib">🔍</span>
          <input
            type="text"
            placeholder="Search food items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-input search-input-lib"
          />
        </div>
      </div>

      {editItem && (
        <div className="edit-overlay">
          <div className="edit-modal card">
            <h2 className="section-title">Edit Food Item</h2>
            {['name', 'calories', 'protein', 'carbs', 'fat', 'serving_unit'].map(field => (
              <div className="form-group" key={field}>
                <label className="form-label">{field.replace('_', ' ')}</label>
                <input
                  name={field}
                  value={editItem[field]}
                  onChange={handleEditChange}
                  className="form-input"
                />
              </div>
            ))}
            <div className="edit-modal-actions">
              <button className="btn-primary" onClick={handleEditSave}>Save</button>
              <button className="btn-outline" onClick={() => setEditItem(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {deleteError && <p className="error-message">{deleteError}</p>}

      <div className="food-grid">
        {filtered.map(item => (
          <div key={item.id} className="food-card">
            <div className="food-card-header">
              <p className="food-card-name">{item.name}</p>
              <p className="food-card-serving">Per {item.serving_unit}</p>
            </div>
            <div className="food-card-macros">
              <span>Calories: {item.calories}</span>
              <span className="macro-protein">Protein: {item.protein}g</span>
              <span>Carbs: {item.carbs}g</span>
              <span className="macro-fat">Fat: {item.fat}g</span>
            </div>
            <div className="food-card-actions">
              <button className="btn-outline btn-edit" onClick={() => setEditItem(item)}>✏ Edit</button>
              <button className="btn-danger" onClick={() => handleDelete(item.id)}>🗑 Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FoodLibrary
