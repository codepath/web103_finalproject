import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import './CreateMeal.css'

const USER_ID = 1

const CreateMeal = () => {
  const navigate = useNavigate()
  const today = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })

  const [form, setForm] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [allFoodItems, setAllFoodItems] = useState([])
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [addedItems, setAddedItems] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const res = await fetch('/api/food-items')
        const data = await res.json()
        if (res.ok && Array.isArray(data)) setAllFoodItems(data)
        else setError('Failed to load food items. Please try again.')
      } catch {
        setError('Failed to load food items. Please try again.')
      }
    }
    fetchFoodItems()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const filteredFoodItems = allFoodItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  const addItem = (item) => {
    if (addedItems.find(i => i.id === item.id)) return
    setAddedItems([...addedItems, { ...item, quantity: 1 }])
    setSearch('')
  }

  const removeItem = (id) => {
    setAddedItems(addedItems.filter(i => i.id !== id))
  }

  const updateQuantity = (id, qty) => {
    setAddedItems(addedItems.map(i => i.id === id ? { ...i, quantity: parseFloat(qty) } : i))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const mealRes = await fetch('/api/meals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, user_id: USER_ID, notes: '' }),
    })
    const meal = await mealRes.json()

    for (const item of addedItems) {
      await fetch(`/api/meal-food-items/meal/${meal.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ food_item_id: item.id, quantity: item.quantity }),
      })
    }

    navigate('/meals')
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Create New Meal</h1>
        <p className="page-subtitle">Add food items to create a meal</p>
      </div>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="form-grid-2">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Meal Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g., Breakfast, Lunch, Dinner"
                value={form.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Search Food Items</label>
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search for food items..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="form-input search-input"
              />
              {searchFocused && filteredFoodItems.length > 0 && (
                <div className="search-dropdown">
                  {filteredFoodItems.map(item => (
                    <div key={item.id} className="search-result" onMouseDown={() => addItem(item)}>
                      <span>{item.name}</span>
                      <span className="search-result-meta">{item.calories} kcal / {item.serving_unit}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">Added Food Items</h2>
          {addedItems.length === 0 ? (
            <p className="empty-state">No food items added yet</p>
          ) : (
            addedItems.map(item => (
              <div key={item.id} className="added-item">
                <div>
                  <p className="added-item-name">{item.name}</p>
                  <p className="added-item-meta">{item.calories} kcal / {item.serving_unit}</p>
                </div>
                <div className="added-item-controls">
                  <input
                    type="number"
                    value={item.quantity}
                    min="0.1"
                    step="0.1"
                    onChange={e => updateQuantity(item.id, e.target.value)}
                    className="quantity-input"
                  />
                  <button type="button" className="btn-danger" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="create-meal-actions">
          <button type="submit" className="btn-primary create-meal-save">Save Meal</button>
          <button type="button" className="btn-outline" onClick={() => navigate('/meals')}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default CreateMeal
