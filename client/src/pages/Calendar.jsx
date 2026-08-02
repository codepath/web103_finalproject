import { useState, useEffect } from 'react'
import api from '../services/api.jsx'
import scheduledMealsApi from '../services/scheduledMealsApi.js'
import leftC from '../assets/left-caret.png'
import rightC from '../assets/right-caret.png'

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack']

const toDateStr = (date) => date.toISOString().slice(0, 10)

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [recipes, setRecipes] = useState([])
  const [meals, setMeals] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ recipe_id: '', meal_type: mealTypes[0] })

  const refreshMeals = async () => {
    const mealData = await scheduledMealsApi.getScheduledMeals()
    setMeals(Array.isArray(mealData) ? mealData : [])
  }

  useEffect(() => {
    const load = async () => {
      const recipeData = await api.getRecipes()
      setRecipes(recipeData || [])
      refreshMeals()
    }
    load()
  }, [])

  const shiftDay = (amount) => {
    setSelectedDate((prev) => {
      const next = new Date(prev)
      next.setDate(next.getDate() + amount)
      return next
    })
  }

  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7 // 0 = Monday

  const mealsByDate = meals.reduce((acc, m) => {
    const key = m.date.slice(0, 10)
    acc[key] = acc[key] || []
    acc[key].push(m)
    return acc
  }, {})

  const selectedDateStr = toDateStr(selectedDate)
  const selectedDayMeals = mealsByDate[selectedDateStr] || []

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSchedule = async (event) => {
    event.preventDefault()
    if (!form.recipe_id) return
    await scheduledMealsApi.createScheduledMeal({ ...form, date: selectedDateStr })
    setShowForm(false)
    setForm({ recipe_id: '', meal_type: mealTypes[0] })
    refreshMeals()
  }

  const handleDelete = async (id) => {
    await scheduledMealsApi.deleteScheduledMeal(id)
    setMeals((prev) => prev.filter((m) => m.id !== id))
  }
  
  const handleMealDay = (cellDate, recipe_id) => {
    setSelectedDate(cellDate)
    if (recipe_id) {
      window.location.href = `/recipe/${recipe_id}`
      console.log(recipe_id)
    }
  }

  return (
    <div style={styles.body}>

      <div style={styles.topBox}>
        <h1 style={styles.title}>Meal Calendar</h1>
        <div>
          <div style={styles.setDateBox}>
            <img
              onClick={() => shiftDay(-1)}
              src={leftC}
              style={styles.caret}
            />
            <p style={styles.dowState}>{selectedDate.toLocaleString('default', { month: 'short' })} {selectedDate.getDate()}</p>
            <img
              onClick={() => shiftDay(1)}
              src={rightC}
              style={styles.caret} />
          </div>
          <button style={styles.scheduleBtn} onClick={() => setShowForm((prev) => !prev)}>+Schedule Meal</button>
        </div>

      </div>

      {showForm && (
        <form style={styles.form} onSubmit={handleSchedule}>
          <select name="recipe_id" value={form.recipe_id} onChange={handleChange} style={styles.input}>
            <option value="">Select a recipe</option>
            {recipes.map((r) => (
              <option key={r.id} value={r.id}>{r.title}</option>
            ))}
          </select>
          <select name="meal_type" value={form.meal_type} onChange={handleChange} style={styles.input}>
            {mealTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button type="submit" style={styles.scheduleBtn}>Save</button>
        </form>
      )}

      <div style={styles.grid}>
        <div style={styles.dow}>Monday</div>
        <div style={styles.dow}>Tuesday</div>
        <div style={styles.dow}>Wednesday</div>
        <div style={styles.dow}>Thursday</div>
        <div style={styles.dow}>Friday</div>
        <div style={styles.dow}>Saturday</div>
        <div style={styles.dow}>Sunday</div>

        {Array.from({ length: firstWeekday }, (_, i) => (
          <div key={`blank-${i}`} style={styles.day}></div>
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const dayNum = i + 1
          const cellDate = new Date(year, month, dayNum)
          const cellDateStr = toDateStr(cellDate)
          const isSelected = cellDateStr === selectedDateStr
          const dayMeals = mealsByDate[cellDateStr] || []
          return (
            <div
              key={dayNum}
              style={{ ...styles.day, ...(isSelected ? styles.daySelected : {}) }}
              onClick={() => handleMealDay(cellDate, dayMeals[0]?.recipe_id)}
            >
              <span>{dayNum}</span>
              {dayMeals.length > 0 && <span style={styles.mealDot}>{dayMeals.length} meal{dayMeals.length > 1 ? 's' : ''}</span>}
            </div>
          )
        })}
      </div>

      <div style={styles.selectedBox}>
        <h2>{selectedDate.toDateString()}</h2>
        <ul style={styles.list}>
          {selectedDayMeals.map((m) => (
            <li key={m.id} style={styles.item}>
              {m.meal_type} — {m.title}
              <button style={styles.deleteBtn} onClick={() => handleDelete(m.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}

export default Calendar

const styles = {
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginLeft: '30px',
  },
  form: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginBottom: '10px',
  },
  input: {
    height: '35px',
    borderRadius: '5px',
  },
  scheduleBtn: {
    cursor: 'pointer',
    marginRight: '30px',
    fontSize: '15px',
    backgroundColor: '#333333',
    color: 'white',
    border: 'solid black',
    width: '200px',
    height: '45px',
    borderRadius: '5px',
    borderWidth: '1px',
    textDecoration: 'none',
    margin: '10px',
  },
  topBox: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7,150px)',
    marginTop: '20px',
  },
  dow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid black',
    borderRadius: '10px',
    height: '30px',
  },
  day: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid black',
    borderRadius: '10px',
    height: '100px',
    cursor: 'pointer',
  },
  daySelected: {
    backgroundColor: '#dcdcdc',
  },
  mealDot: {
    fontSize: '11px',
  },
  dowState: {
    fontSize: '20px',
    paddingLeft: '10px',
  },
  caret: {
    height: '20px',
    cursor: 'pointer',
  },
  setDateBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  selectedBox: {
    width: '100%',
    maxWidth: '800px',
    marginTop: '20px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    border: 'solid black',
    borderWidth: '1px',
    borderRadius: '10px',
    padding: '10px',
    marginBottom: '10px',
    maxWidth: '500px',
  },
  deleteBtn: {
    cursor: 'pointer',
  },
}
