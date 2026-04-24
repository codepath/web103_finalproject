import { useState, useEffect } from 'react'
import './Goals.css'

const Goals = ({ user, setUser }) => {
  const [form, setForm] = useState({
    goal: user?.goal || 'maintain',
    calorie_target: user?.calorie_target || 2000,
    protein_target: user?.protein_target || 150,
    carb_target: user?.carb_target || 200,
    fat_target: user?.fat_target || 65,
  })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSaved(false)
    setError('')
  }

  const validateTargets = () => {
    if (form.calorie_target < 500 || form.calorie_target > 10000) {
      setError('Calories must be between 500 and 10,000')
      return false
    }
    if (form.protein_target < 0 || form.protein_target > 500) {
      setError('Protein must be between 0 and 500g')
      return false
    }
    if (form.carb_target < 0 || form.carb_target > 800) {
      setError('Carbs must be between 0 and 800g')
      return false
    }
    if (form.fat_target < 0 || form.fat_target > 200) {
      setError('Fat must be between 0 and 200g')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateTargets()) return
    
    const token = localStorage.getItem('token')
    const response = await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(form),
    })
    
    if (response.ok) {
      const updatedUser = await response.json()
      setUser(updatedUser)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      setError('Failed to save goals')
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Goals Settings</h1>
        <p className="page-subtitle">Set your daily macro targets for {user.name}</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Fitness Goal</label>
            <select
              name="goal"
              value={form.goal}
              onChange={handleChange}
              className="form-select"
            >
              <option value="cut">Cut (Calorie Deficit)</option>
              <option value="maintain">Maintain (Maintenance)</option>
              <option value="bulk">Bulk (Calorie Surplus)</option>
            </select>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Daily Calories (kcal)</label>
              <input
                type="number"
                name="calorie_target"
                value={form.calorie_target}
                onChange={handleChange}
                className="form-input"
                min="500"
                max="10000"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Daily Protein (g)</label>
              <input
                type="number"
                name="protein_target"
                value={form.protein_target}
                onChange={handleChange}
                className="form-input"
                min="0"
                max="500"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Daily Carbs (g)</label>
              <input
                type="number"
                name="carb_target"
                value={form.carb_target}
                onChange={handleChange}
                className="form-input"
                min="0"
                max="800"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Daily Fat (g)</label>
              <input
                type="number"
                name="fat_target"
                value={form.fat_target}
                onChange={handleChange}
                className="form-input"
                min="0"
                max="200"
              />
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn-primary goals-save-btn">
            Save Goals
          </button>
          {saved && <p className="goals-saved-msg">✓ Goals saved successfully!</p>}
        </form>
      </div>
    </div>
  )
}

export default Goals