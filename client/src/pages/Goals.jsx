import { useState, useEffect } from 'react'
import './Goals.css'

const USER_ID = 1

const Goals = () => {
  const [form, setForm] = useState({
    goal: 'maintain',
    calorie_target: 2000,
    protein_target: 150,
    carb_target: 200,
    fat_target: 65,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/users/${USER_ID}`)
      const data = await res.json()
      if (res.ok && data) setForm(data)
    }
    fetchUser()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSaved(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch(`/api/users/${USER_ID}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaved(true)
  }

  const goalOptions = [
    { value: 'cut',      label: 'Cut (Calorie Deficit)' },
    { value: 'bulk',     label: 'Bulk (Calorie Surplus)' },
    { value: 'maintain', label: 'Maintain (Maintenance)' },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Goals Settings</h1>
        <p className="page-subtitle">Set your daily macro targets based on your fitness goal</p>
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
              {goalOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
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
                min="0"
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
              />
            </div>
          </div>

          <button type="submit" className="btn-primary goals-save-btn">
            Save Goals
          </button>
          {saved && <p className="goals-saved-msg">Goals saved!</p>}
        </form>
      </div>
    </div>
  )
}

export default Goals
