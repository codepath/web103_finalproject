import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import './MealDetail.css'

const MealDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [meal, setMeal] = useState(null)
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', date: '' })

  useEffect(() => {
    fetchMeal()
    fetchItems()
  }, [])

  const fetchMeal = async () => {
    try {
      const res = await fetch(`/api/meals/${id}`)
      const data = await res.json()
      if (res.ok && data) {
        setMeal(data)
        setEditForm({ name: data.name, date: data.date?.split('T')[0] })
      }
      else setError('Failed to load meal.')
    } catch {
      setError('Failed to load meal.')
    }
  }

  const fetchItems = async () => {
    try {
      const res = await fetch(`/api/meal-food-items/meal/${id}`)
      const data = await res.json()
      if (res.ok && Array.isArray(data)) setItems(data)
      else setError('Failed to load food items.')
    } catch {
      setError('Failed to load food items.')
    }
  }

  const handleEdit = async () => {
    const res = await fetch(`/api/meals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editForm.name,
        date: editForm.date,
        user_id: meal.user_id,
        notes: meal.notes || '',
      }),
    })
    if (res.ok) {
      const updated = await res.json()
      setMeal(updated)
      setEditing(false)
    } else {
      setError('Failed to update meal.')
    }
  }

  const handleDelete = async () => {
    const res = await fetch(`/api/meals/${id}`, { method: 'DELETE' })
    if (res.ok) navigate('/meals')
    else setError('Failed to delete meal.')
  }

  const formatDate = (dateStr) => {
    const datePart = dateStr?.split('T')[0]
    const d = new Date(datePart + 'T12:00:00')
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  const totals = items.reduce((acc, item) => ({
    calories: acc.calories + item.calories,
    protein:  acc.protein  + item.protein,
    carbs:    acc.carbs    + item.carbs,
    fat:      acc.fat      + item.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

  return (
    <div className="page-container">
      <div className="meal-detail-topbar">
        <button className="btn-back" onClick={() => navigate('/meals')}>← Back to Meals</button>
        <div className="meal-detail-actions">
          <button className="btn-outline" onClick={() => setEditing(!editing)}>✏ Edit</button>
          <button className="btn-danger-outline" onClick={handleDelete}>🗑 Delete Meal</button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {meal && (
        <div className="card meal-detail-header">
          {editing ? (
            <>
              <input
                className="form-input"
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                style={{ marginBottom: 12 }}
              />
              <input
                type="date"
                className="form-input"
                value={editForm.date}
                onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                style={{ marginBottom: 12 }}
              />
              <div className="edit-modal-actions">
                <button className="btn-primary" onClick={handleEdit}>Save</button>
                <button className="btn-outline" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h1 className="meal-detail-name">{meal.name}</h1>
              <p className="meal-detail-date">{formatDate(meal.date)}</p>
            </>
          )}
        </div>
      )}

      <div className="card">
        <h2 className="section-title">Food Items</h2>
        <table className="meal-detail-table">
          <thead>
            <tr>
              <th>Food Item</th>
              <th>Quantity</th>
              <th>Calories</th>
              <th>Protein</th>
              <th>Carbs</th>
              <th>Fat</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}{item.serving_unit}</td>
                <td>{item.calories}</td>
                <td>{item.protein}g</td>
                <td>{item.carbs}g</td>
                <td>{item.fat}g</td>
              </tr>
            ))}
            <tr className="totals-row">
              <td><strong>Total</strong></td>
              <td></td>
              <td><strong>{totals.calories}</strong></td>
              <td><strong>{totals.protein}g</strong></td>
              <td><strong>{totals.carbs}g</strong></td>
              <td><strong>{totals.fat}g</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MealDetail