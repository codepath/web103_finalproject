import { useState } from 'react'
import { useNavigate } from 'react-router'
import './AddFoodItem.css'

const AddFoodItem = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    serving_unit: 'g',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    const token = localStorage.getItem('token')
    const response = await fetch('/api/food-items', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(form),
    })
    
    if (response.ok) {
      navigate('/foods')
    } else {
      const data = await response.json()
      setError(data.error || 'Failed to add food item')
    }
  }

  const servingUnits = ['g', 'oz', 'cup', 'tbsp', 'tsp', 'ml', 'piece', 'slice', 'egg', 'medium', 'large']

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Add Food Item</h1>
        <p className="page-subtitle">Add a new food item to your library</p>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Food Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Chicken Breast"
              value={form.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Serving Unit</label>
            <select
              name="serving_unit"
              value={form.serving_unit}
              onChange={handleChange}
              className="form-select"
            >
              {servingUnits.map(u => (
                <option key={u} value={u}>{u === 'g' ? 'Grams (g)' : u === 'oz' ? 'Ounces (oz)' : u === 'cup' ? 'Cup' : u === 'tbsp' ? 'Tablespoon (tbsp)' : u === 'tsp' ? 'Teaspoon (tsp)' : u}</option>
              ))}
            </select>
          </div>

          <p className="nutrition-label">Nutritional Information (per {form.serving_unit})</p>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Calories (kcal)</label>
              <input
                type="number"
                name="calories"
                value={form.calories}
                onChange={handleChange}
                className="form-input"
                min="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Protein (g)</label>
              <input
                type="number"
                name="protein"
                value={form.protein}
                onChange={handleChange}
                className="form-input"
                min="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Carbs (g)</label>
              <input
                type="number"
                name="carbs"
                value={form.carbs}
                onChange={handleChange}
                className="form-input"
                min="0"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Fat (g)</label>
              <input
                type="number"
                name="fat"
                value={form.fat}
                onChange={handleChange}
                className="form-input"
                min="0"
              />
            </div>
          </div>

          <div className="add-food-actions">
            <button type="submit" className="btn-primary add-food-save">Save Food Item</button>
            <button type="button" className="btn-outline" onClick={() => navigate('/foods')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddFoodItem