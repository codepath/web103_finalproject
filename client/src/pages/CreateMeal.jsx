import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import './CreateMeal.css'

const COLORS = {
  Protein: '#3b82f6',
  Carbs:   '#f59e0b',
  Fat:     '#ef4444',
}

const MacroPieChart = ({ addedItems }) => {
  const totals = addedItems.reduce(
    (acc, item) => {
      const q = item.quantity || 1
      return {
        protein:  acc.protein  + (item.protein  || 0) * q,
        carbs:    acc.carbs    + (item.carbs    || 0) * q,
        fat:      acc.fat      + (item.fat      || 0) * q,
        calories: acc.calories + (item.calories || 0) * q,
      }
    },
    { protein: 0, carbs: 0, fat: 0, calories: 0 }
  )

  const proteinCals = totals.protein * 4
  const carbsCals   = totals.carbs   * 4
  const fatCals     = totals.fat     * 9
  const total       = proteinCals + carbsCals + fatCals

  const slices = [
    { label: 'Protein', value: proteinCals, grams: totals.protein },
    { label: 'Carbs',   value: carbsCals,   grams: totals.carbs   },
    { label: 'Fat',     value: fatCals,     grams: totals.fat     },
  ]

  const cx = 100, cy = 100, r = 80

  const toXY = (angle) => {
    const rad = (angle - 90) * (Math.PI / 180)
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  let cursor = 0
  const paths = total > 0
    ? slices.map((slice) => {
        const sweep = (slice.value / total) * 359.9999
        const start = toXY(cursor)
        const end   = toXY(cursor + sweep)
        const large = sweep > 180 ? 1 : 0
        const d = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`
        cursor += sweep
        return { ...slice, d, pct: Math.round((slice.value / total) * 100) }
      })
    : []

  return (
    <div className="macro-chart-panel">
      <h2 className="section-title">Macro Breakdown</h2>

      {addedItems.length === 0 ? (
        <p className="empty-state">Add food items to see breakdown</p>
      ) : (
        <>
          <svg viewBox="0 0 200 200" className="pie-chart">
            {paths.map(s => (
              <path key={s.label} d={s.d} fill={COLORS[s.label]} />
            ))}
          </svg>

          <div className="macro-legend">
            {paths.map(s => (
              <div key={s.label} className="legend-item">
                <span className="legend-dot" style={{ background: COLORS[s.label] }} />
                <span className="legend-label">{s.label}</span>
                <span className="legend-grams">{Math.round(s.grams)}g</span>
                <span className="legend-pct">{s.pct}%</span>
              </div>
            ))}
          </div>

          <div className="macro-totals">
            <div className="macro-total-row">
              <span>Total Calories</span>
              <span>{Math.round(totals.calories)} kcal</span>
            </div>
            <div className="macro-total-row">
              <span>Protein</span>
              <span>{Math.round(totals.protein)}g &nbsp;·&nbsp; {Math.round(proteinCals)} kcal</span>
            </div>
            <div className="macro-total-row">
              <span>Carbs</span>
              <span>{Math.round(totals.carbs)}g &nbsp;·&nbsp; {Math.round(carbsCals)} kcal</span>
            </div>
            <div className="macro-total-row">
              <span>Fat</span>
              <span>{Math.round(totals.fat)}g &nbsp;·&nbsp; {Math.round(fatCals)} kcal</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ── Select Multiple Food Items Modal ──────────────────────────────────────────
const SelectFoodModal = ({ allFoodItems, addedItems, onAdd, onClose }) => {
  const [query, setQuery]     = useState('')
  const [checked, setChecked] = useState(new Set())

  // Already-added item ids — used to dim rows that are already in the list
  const addedIds = new Set(addedItems.map(i => i.id))

  const filtered = allFoodItems.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  )

  const toggle = (id) =>
    setChecked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const handleAdd = () => {
    const toAdd = allFoodItems
      .filter(item => checked.has(item.id) && !addedIds.has(item.id))
      .map(item => ({ ...item, quantity: 1 }))
    onAdd(toAdd)
    onClose()
  }

  // Close on Escape key
  const handleKey = (e) => { if (e.key === 'Escape') onClose() }

  return (
    <div className="sfm-overlay" role="dialog" aria-modal="true" aria-label="Select food items" onClick={onClose} onKeyDown={handleKey}>
      <div className="sfm-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="sfm-header">
          <h2 className="sfm-title">Select Food Items</h2>
          <button className="sfm-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Search inside modal */}
        <div className="sfm-search-wrap">
          <span className="sfm-search-icon">🔍</span>
          <input
            autoFocus
            type="text"
            className="form-input sfm-search"
            placeholder="Search food items…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {/* Food list */}
        <div className="sfm-list" role="list">
          {filtered.length === 0 && (
            <p className="sfm-empty">No items match your search</p>
          )}
          {filtered.map(item => {
            const isChecked  = checked.has(item.id)
            const isAdded    = addedIds.has(item.id)
            return (
              <label
                key={item.id}
                className={`sfm-row ${isChecked ? 'sfm-row--checked' : ''} ${isAdded ? 'sfm-row--added' : ''}`}
                role="listitem"
              >
                <input
                  type="checkbox"
                  className="sfm-checkbox"
                  checked={isChecked}
                  onChange={() => toggle(item.id)}
                  aria-label={item.name}
                />
                <div className="sfm-row-info">
                  <span className="sfm-row-name">{item.name}</span>
                  <span className="sfm-row-meta">
                    {item.calories} kcal &bull; P {item.protein}g &bull; C {item.carbs}g &bull; F {item.fat}g &bull; per {item.serving_unit}
                    {isAdded && <span className="sfm-badge">already added</span>}
                  </span>
                </div>
              </label>
            )
          })}
        </div>

        {/* Footer */}
        <div className="sfm-footer">
          <button className="btn-outline sfm-cancel-btn" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary sfm-add-btn"
            onClick={handleAdd}
            disabled={checked.size === 0}
          >
            Add Selected{checked.size > 0 ? ` (${checked.size})` : ''}
          </button>
        </div>

      </div>
    </div>
  )
}

const CreateMeal = ({ user }) => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [allFoodItems, setAllFoodItems] = useState([])
  const [search, setSearch] = useState('')
  const [addedItems, setAddedItems] = useState([])
  const [error, setError] = useState(null)
  const [showSelectModal, setShowSelectModal] = useState(false)

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('/api/food-items', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (res.ok && Array.isArray(data)) setAllFoodItems(data)
        else setError('Failed to load food items. Please try again.')
      } catch {
        setError('Failed to load food items. Please try again.')
      }
    }
    fetchFoodItems()
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const filteredFoodItems = allFoodItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  const addItem = (item) => {
    if (addedItems.find(i => i.id === item.id)) return
    setAddedItems([...addedItems, { ...item, quantity: 1 }])
    setSearch('')
  }

  // Merge items from the multi-select modal, skipping any already present
  const addMultipleItems = (items) => {
    const existingIds = new Set(addedItems.map(i => i.id))
    const newOnes = items.filter(i => !existingIds.has(i.id))
    setAddedItems(prev => [...prev, ...newOnes])
  }

  const removeItem = (id) => setAddedItems(addedItems.filter(i => i.id !== id))

  const updateQuantity = (id, qty) => {
    setAddedItems(addedItems.map(i => i.id === id ? { ...i, quantity: parseFloat(qty) || 0 } : i))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    const mealRes = await fetch('/api/meals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ...form, user_id: user.id, notes: '' }),
    })
    const meal = await mealRes.json()

    for (const item of addedItems) {
      await fetch(`/api/meal-food-items/meal/${meal.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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

      <div className="create-meal-layout">
        <form className="create-meal-left" onSubmit={handleSubmit}>
          <div className="card">
            <div className="form-grid-2">
              <div className="form-group">
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
              <div className="form-group">
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
              <div className="search-row">
                <div className="search-wrapper">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search for food items..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="form-input search-input"
                  />
                  {search && filteredFoodItems.length > 0 && (
                    <div className="search-dropdown">
                      {filteredFoodItems.map(item => (
                        <div key={item.id} className="search-result" onClick={() => addItem(item)}>
                          <span>{item.name}</span>
                          <span className="search-result-meta">{item.calories} kcal / {item.serving_unit}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-outline select-multi-btn"
                  onClick={() => setShowSelectModal(true)}
                >
                  Select Multiple Items
                </button>
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

        <MacroPieChart addedItems={addedItems} />
      </div>

      {showSelectModal && (
        <SelectFoodModal
          allFoodItems={allFoodItems}
          addedItems={addedItems}
          onAdd={addMultipleItems}
          onClose={() => setShowSelectModal(false)}
        />
      )}
    </div>
  )
}

export default CreateMeal
