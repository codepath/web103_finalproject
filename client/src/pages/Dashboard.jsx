import { useState, useEffect } from 'react'
import './Dashboard.css'

const USER_ID = 1

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [meals, setMeals] = useState([])
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 })

  useEffect(() => {
    fetchUser()
    fetchTodaysMeals()
  }, [])

  const fetchUser = async () => {
    const res = await fetch(`/api/users/${USER_ID}`)
    const data = await res.json()
    if (res.ok && data) setUser(data)
  }

  const fetchTodaysMeals = async () => {
    const res = await fetch(`/api/meals/user/${USER_ID}`)
    const data = await res.json()
    if (!res.ok || !Array.isArray(data)) return
    const today = new Date().toISOString().split('T')[0]
    const todaysMeals = data.filter(meal => meal.date?.startsWith(today))
    setMeals(todaysMeals)

    // Calculate totals across all today's meals
    let cal = 0, pro = 0, carb = 0, fat = 0
    for (const meal of todaysMeals) {
      const itemsRes = await fetch(`/api/meal-food-items/meal/${meal.id}`)
      const items = await itemsRes.json()
      items.forEach(item => {
        cal  += item.calories * item.quantity
        pro  += item.protein  * item.quantity
        carb += item.carbs    * item.quantity
        fat  += item.fat      * item.quantity
      })
    }
    setTotals({
      calories: Math.round(cal),
      protein:  Math.round(pro),
      carbs:    Math.round(carb),
      fat:      Math.round(fat),
    })
  }

  const pct = (current, target) =>
    target ? Math.min((current / target) * 100, 100) : 0

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Track your daily macro progress</p>
      </div>

      <div className="card">
        <h2 className="section-title">Today's Progress</h2>

        {[
          { label: 'Calories', key: 'calories', target: user?.calorie_target, unit: 'kcal' },
          { label: 'Protein',  key: 'protein',  target: user?.protein_target,  unit: 'g' },
          { label: 'Carbs',    key: 'carbs',    target: user?.carb_target,     unit: 'g' },
          { label: 'Fat',      key: 'fat',      target: user?.fat_target,      unit: 'g' },
        ].map(({ label, key, target, unit }) => (
          <div className="macro-row" key={key}>
            <div className="macro-label-row">
              <span className="macro-name">{label}</span>
              <span className="macro-value">{totals[key]} / {target ?? '—'} {unit}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct(totals[key], target)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <h2 className="section-heading">Today's Meals</h2>
      <div className="card">
        {meals.length === 0 ? (
          <p className="empty-state">No meals logged for today</p>
        ) : (
          meals.map(meal => (
            <div key={meal.id} className="meal-row">
              <span>{meal.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Dashboard
