import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import './Meals.css'

const MacroBar = ({ protein, carbs, fat }) => {
  const proteinCals = protein * 4
  const carbsCals   = carbs   * 4
  const fatCals     = fat     * 9
  const total       = proteinCals + carbsCals + fatCals

  if (total === 0) return null

  const pPct = Math.round((proteinCals / total) * 100)
  const cPct = Math.round((carbsCals   / total) * 100)
  const fPct = Math.round((fatCals     / total) * 100)

  return (
    <div className="macro-inline">
      <span className="macro-inline-protein">Protein {Math.round(protein)}g - {pPct}%</span>
      <span className="macro-inline-carbs">Carbs {Math.round(carbs)}g - {cPct}%</span>
      <span className="macro-inline-fat">Fat {Math.round(fat)}g - {fPct}%</span>
    </div>
  )
}

const Meals = ({ user }) => {
  const [meals, setMeals] = useState([])
  const [mealTotals, setMealTotals] = useState({})
  const [dateFilter, setDateFilter] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchMeals()
  }, [])

  const fetchMeals = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/meals/user/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok && Array.isArray(data)) {
        setMeals(data)
        fetchAllTotals(data)
      } else {
        setError('Failed to load meals. Please try again.')
      }
    } catch {
      setError('Failed to load meals. Please try again.')
    }
  }

  const fetchAllTotals = async (mealList) => {
    const token = localStorage.getItem('token')
    const totalsMap = {}
    for (const meal of mealList) {
      const res = await fetch(`/api/meal-food-items/meal/${meal.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const items = await res.json()
      if (!res.ok || !Array.isArray(items)) {
        setError('Failed to load meal details. Please try again.')
        continue
      }
      totalsMap[meal.id] = {
        calories:  Math.round(items.reduce((s, i) => s + (i.calories || 0) * i.quantity, 0)),
        protein:   items.reduce((s, i) => s + (i.protein  || 0) * i.quantity, 0),
        carbs:     items.reduce((s, i) => s + (i.carbs    || 0) * i.quantity, 0),
        fat:       items.reduce((s, i) => s + (i.fat      || 0) * i.quantity, 0),
        itemCount: items.length,
      }
    }
    setMealTotals(totalsMap)
  }

  const filtered = meals.filter(meal => {
    if (!dateFilter) return true
    return meal.date?.startsWith(dateFilter)
  })

  const grouped = filtered.reduce((acc, meal) => {
    const date = meal.date?.split('T')[0] ?? meal.date
    if (!acc[date]) acc[date] = []
    acc[date].push(meal)
    return acc
  }, {})

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="page-container">
      {error && <p className="error-message">{error}</p>}
      <div className="meals-header">
        <div>
          <h1>Meal History</h1>
          <p className="page-subtitle">View all your logged meals</p>
        </div>
        <Link to="/meals/new">
          <button className="btn-primary">+ New Meal</button>
        </Link>
      </div>

      <div className="card">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Filter by Date</label>
          <input
            type="date"
            className="form-input"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="card">
          <p className="empty-state">No meals found</p>
        </div>
      ) : (
        Object.entries(grouped)
          .sort(([a], [b]) => new Date(b) - new Date(a))
          .map(([date, dateMeals]) => (
            <div key={date}>
              <p className="date-heading">{formatDate(date)}</p>
              <div className="card" style={{ padding: 0 }}>
                {dateMeals.map((meal, idx) => {
                  const t = mealTotals[meal.id]
                  return (
                    <div key={meal.id} className={`meal-list-item ${idx < dateMeals.length - 1 ? 'meal-list-item--border' : ''}`}>
                      <div className="meal-list-left">
                        <p className="meal-list-name">{meal.name}</p>
                        <p className="meal-list-meta">
                          {t?.calories ?? '—'} kcal &bull; {t?.itemCount ?? '—'} items
                        </p>
                        {t && (
                          <MacroBar protein={t.protein} carbs={t.carbs} fat={t.fat} />
                        )}
                      </div>
                      <button className="btn-outline btn-view-details" onClick={() => navigate(`/meals/${meal.id}`)}>
                        👁 View Details
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
      )}
    </div>
  )
}

export default Meals
