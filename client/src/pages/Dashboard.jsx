import { useState, useEffect } from 'react'
import './Dashboard.css'

const Dashboard = ({ user }) => {
  const [meals, setMeals] = useState([])
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTodaysMeals()
  }, [])

  const fetchTodaysMeals = async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const response = await fetch(`/api/meals/user/${user.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    
    if (!response.ok) {
      setError('Failed to load meals')
      setLoading(false)
      return
    }
    
    const today = new Date().toISOString().split('T')[0]
    const todaysMeals = data.filter(meal => meal.date?.startsWith(today))
    setMeals(todaysMeals)
    
    let cal = 0, pro = 0, carb = 0, fat = 0
    for (const meal of todaysMeals) {
      const itemsRes = await fetch(`/api/meal-food-items/meal/${meal.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const items = await itemsRes.json()
      if (itemsRes.ok && Array.isArray(items)) {
        items.forEach(item => {
          cal += item.calories * item.quantity
          pro += item.protein * item.quantity
          carb += item.carbs * item.quantity
          fat += item.fat * item.quantity
        })
      }
    }
    setTotals({
      calories: Math.round(cal),
      protein: Math.round(pro),
      carbs: Math.round(carb),
      fat: Math.round(fat),
    })
    setLoading(false)
  }

  const getRemaining = (current, target) => {
    const remaining = target - current
    return remaining > 0 ? remaining : 0
  }

  const getProgressColor = (current, target) => {
    const percentage = (current / target) * 100
    if (percentage >= 100) return '#dc3545'
    if (percentage >= 85) return '#ffc107'
    return '#4a6cf7'
  }

  if (loading) return <div className="loading-spinner">Loading your dashboard...</div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Welcome back, {user.name}!</h1>
        <p className="page-subtitle">Track your daily macro progress</p>
      </div>
      
      {error && <p className="error-message">{error}</p>}

      <div className="card">
        <h2 className="section-title">Today's Progress</h2>
        
        {[
          { label: 'Calories', key: 'calories', target: user?.calorie_target, unit: 'kcal', icon: '🔥' },
          { label: 'Protein', key: 'protein', target: user?.protein_target, unit: 'g', icon: '💪' },
          { label: 'Carbs', key: 'carbs', target: user?.carb_target, unit: 'g', icon: '🍚' },
          { label: 'Fat', key: 'fat', target: user?.fat_target, unit: 'g', icon: '🥑' },
        ].map(({ label, key, target, unit, icon }) => {
          const current = totals[key]
          const percentage = target ? (current / target) * 100 : 0
          const remaining = getRemaining(current, target)
          
          return (
            <div className="macro-row" key={key}>
              <div className="macro-label-row">
                <span className="macro-name">{icon} {label}</span>
                <span className="macro-value">
                  {current} / {target} {unit}
                  <span style={{ color: remaining > 0 ? '#28a745' : '#dc3545', marginLeft: '8px' }}>
                    ({remaining > 0 ? `${remaining} left` : 'Over limit'})
                  </span>
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${Math.min(percentage, 100)}%`,
                    backgroundColor: getProgressColor(current, target)
                  }} 
                />
              </div>
              {percentage >= 100 && (
                <small style={{ color: '#dc3545', marginTop: '4px', display: 'block' }}>
                  ⚠️ You've exceeded your {label.toLowerCase()} target for today!
                </small>
              )}
            </div>
          )
        })}
      </div>

      <div className="card">
        <h2 className="section-title">Remaining Macros</h2>
        {[
          { label: 'Calories', key: 'calories', target: user?.calorie_target, unit: 'kcal' },
          { label: 'Protein',  key: 'protein',  target: user?.protein_target,  unit: 'g' },
          { label: 'Carbs',    key: 'carbs',    target: user?.carb_target,     unit: 'g' },
          { label: 'Fat',      key: 'fat',      target: user?.fat_target,      unit: 'g' },
        ].map(({ label, key, target, unit }) => {
          const current = totals[key]
          const remaining = getRemaining(current, target)
          return (
            <div className="macro-row" key={key}>
              <div className="macro-label-row">
                <span className="macro-name">{label}</span>
                <span className="macro-value">
                  {target
                    ? current > target
                      ? <span className="over-target">Over target</span>
                      : `${remaining} ${unit} left`
                    : '—'
                  }
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="dashboard-header">
        <h2 className="section-heading">Today's Meals</h2>
        <button 
          className="btn-primary" 
          onClick={() => window.location.href = '/meals/new'}
        >
          + Add Meal
        </button>
      </div>
      
      <div className="card">
        {meals.length === 0 ? (
          <div className="empty-state">
            <p>No meals logged for today</p>
            <button 
              className="btn-primary" 
              onClick={() => window.location.href = '/meals/new'}
              style={{ marginTop: '16px' }}
            >
              Log Your First Meal
            </button>
          </div>
        ) : (
          meals.map(meal => (
            <div key={meal.id} className="meal-row">
              <div>
                <span className="meal-name">{meal.name}</span>
                {meal.notes && <small className="meal-notes">{meal.notes}</small>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Dashboard