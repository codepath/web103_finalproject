import { useState, useEffect, useCallback } from 'react'
import MultiDatePicker from '../components/MultiDatePicker'
import './Log.css'

const today = new Date().toISOString().split('T')[0]

const COLORS = { Protein: '#3b82f6', Carbs: '#f59e0b', Fat: '#ef4444' }

const macroPercents = (protein, carbs, fat) => {
  const pc = protein * 4, cc = carbs * 4, fc = fat * 9
  const total = pc + cc + fc
  if (total === 0) return { pPct: 0, cPct: 0, fPct: 0 }
  return {
    pPct: Math.round((pc / total) * 100),
    cPct: Math.round((cc / total) * 100),
    fPct: Math.round((fc / total) * 100),
  }
}

const MacroLine = ({ protein, carbs, fat }) => {
  const { pPct, cPct, fPct } = macroPercents(protein, carbs, fat)
  return (
    <div className="log-macro-line">
      <span className="log-macro-protein">Protein {Math.round(protein)}g - {pPct}%</span>
      <span className="log-macro-carbs">Carbs {Math.round(carbs)}g - {cPct}%</span>
      <span className="log-macro-fat">Fat {Math.round(fat)}g - {fPct}%</span>
    </div>
  )
}

// ── Combined macro pie chart (right panel) ─────────────────────────────────────
const CombinedMacroPanel = ({ combined, dateCount }) => {
  const { protein, carbs, fat, calories, meals } = combined

  const proteinCals = protein * 4
  const carbsCals   = carbs   * 4
  const fatCals     = fat     * 9
  const total       = proteinCals + carbsCals + fatCals

  const slices = [
    { label: 'Protein', value: proteinCals, grams: protein },
    { label: 'Carbs',   value: carbsCals,   grams: carbs   },
    { label: 'Fat',     value: fatCals,     grams: fat     },
  ]

  const cx = 100, cy = 100, r = 80
  const toXY = (angle) => {
    const rad = (angle - 90) * (Math.PI / 180)
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  let cursor = 0
  const paths = total > 0
    ? slices.map(slice => {
        const sweep = (slice.value / total) * 359.9999
        const start = toXY(cursor)
        const end   = toXY(cursor + sweep)
        const large = sweep > 180 ? 1 : 0
        const d = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`
        cursor += sweep
        return { ...slice, d, pct: Math.round((slice.value / total) * 100) }
      })
    : []

  const hasData = total > 0

  return (
    <div className="macro-chart-panel log-macro-panel">
      <h2 className="section-title">Combined Breakdown</h2>
      <p className="log-panel-meta">
        {dateCount} date{dateCount !== 1 ? 's' : ''} &bull; {meals} meal{meals !== 1 ? 's' : ''}
      </p>

      {!hasData ? (
        <p className="empty-state" style={{ marginTop: 16 }}>No macro data for selected dates</p>
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
              <span>{Math.round(calories)} kcal</span>
            </div>
            <div className="macro-total-row">
              <span>Protein</span>
              <span>{Math.round(protein)}g &nbsp;·&nbsp; {Math.round(proteinCals)} kcal</span>
            </div>
            <div className="macro-total-row">
              <span>Carbs</span>
              <span>{Math.round(carbs)}g &nbsp;·&nbsp; {Math.round(carbsCals)} kcal</span>
            </div>
            <div className="macro-total-row">
              <span>Fat</span>
              <span>{Math.round(fat)}g &nbsp;·&nbsp; {Math.round(fatCals)} kcal</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}


// ── Day modal ──────────────────────────────────────────────────────────────────
const DayModal = ({ date, meals, onClose }) => {
  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  const dayTotals = meals.reduce((acc, m) => !m.totals ? acc : {
    calories: acc.calories + m.totals.calories,
    protein:  acc.protein  + m.totals.protein,
    carbs:    acc.carbs    + m.totals.carbs,
    fat:      acc.fat      + m.totals.fat,
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 })

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{formatDate(date)}</h2>
            <p className="modal-subtitle">{meals.length} meal{meals.length !== 1 ? 's' : ''} &bull; {dayTotals.calories} kcal</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-day-totals">
          <MacroLine protein={dayTotals.protein} carbs={dayTotals.carbs} fat={dayTotals.fat} />
        </div>
        <div className="modal-meal-list">
          {meals.map((meal, idx) => (
            <div key={meal.id} className={`modal-meal-row ${idx < meals.length - 1 ? 'modal-meal-row--border' : ''}`}>
              <p className="modal-meal-name">{meal.name}</p>
              {meal.totals ? (
                <>
                  <p className="modal-meal-meta">{meal.totals.calories} kcal &bull; {meal.totals.itemCount} items</p>
                  <MacroLine protein={meal.totals.protein} carbs={meal.totals.carbs} fat={meal.totals.fat} />
                </>
              ) : (
                <p className="modal-meal-meta">—</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
const Log = ({ user }) => {
  const [dayMap, setDayMap]               = useState({})
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const [selectedDates, setSelectedDates] = useState([today])
  const [dismissed, setDismissed]         = useState(new Set())
  const [activeDate, setActiveDate]       = useState(null)

  const fetchLog = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/meals/user/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const meals = await res.json()
      if (!res.ok || !Array.isArray(meals)) { setError('Failed to load meals.'); setLoading(false); return }

      const map = {}
      for (const meal of meals) {
        const date = meal.date?.split('T')[0] ?? meal.date
        if (!map[date]) map[date] = []
        map[date].push({ ...meal, totals: null })
      }

      for (const date of Object.keys(map)) {
        for (let i = 0; i < map[date].length; i++) {
          const r = await fetch(`/api/meal-food-items/meal/${map[date][i].id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          const items = await r.json()
          if (r.ok && Array.isArray(items)) {
            map[date][i].totals = {
              calories:  Math.round(items.reduce((s, x) => s + (x.calories || 0) * x.quantity, 0)),
              protein:   items.reduce((s, x) => s + (x.protein  || 0) * x.quantity, 0),
              carbs:     items.reduce((s, x) => s + (x.carbs    || 0) * x.quantity, 0),
              fat:       items.reduce((s, x) => s + (x.fat      || 0) * x.quantity, 0),
              itemCount: items.length,
            }
          }
        }
      }
      setDayMap({ ...map })
    } catch { setError('Failed to load log.') }
    finally  { setLoading(false) }
  }, [user.id])

  useEffect(() => { fetchLog() }, [fetchLog])

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }


  const entries = Object.entries(dayMap)
    .filter(([date]) => selectedDates.length === 0 || selectedDates.includes(date))
    .sort(([a], [b]) => new Date(b) - new Date(a))

  const combined = entries.reduce((acc, [, meals]) =>
    meals.reduce((a, m) => !m.totals ? a : {
      calories: a.calories + m.totals.calories,
      protein:  a.protein  + m.totals.protein,
      carbs:    a.carbs    + m.totals.carbs,
      fat:      a.fat      + m.totals.fat,
      meals:    a.meals    + 1,
    }, acc),
    { calories: 0, protein: 0, carbs: 0, fat: 0, meals: 0 }
  )

  const showPanel = selectedDates.length > 0

  return (
    <div className="page-container">
      <div className="log-header">
        <h1>Daily Log</h1>
        <p className="page-subtitle">Pick dates on the calendar to compare totals</p>
      </div>

      <div className="card log-search-card">
        <MultiDatePicker value={selectedDates} onChange={setSelectedDates} />
      </div>

      {error   && <p className="error-message">{error}</p>}
      {loading && <p className="log-loading">Loading log…</p>}

      {!loading && entries.length === 0 && selectedDates.length === 0 && (
        <div className="card"><p className="empty-state">No meals logged yet</p></div>
      )}

      <div className={showPanel ? 'log-body-layout' : ''}>
        {/* ── Left: date list ── */}
        <div className="log-body-left">
          {entries.length > 0 && (
            <div className="card log-date-list">
              {entries.map(([date, meals], idx) => {
                const dt = meals.reduce((acc, m) => !m.totals ? acc : {
                  calories: acc.calories + m.totals.calories,
                  protein:  acc.protein  + m.totals.protein,
                  carbs:    acc.carbs    + m.totals.carbs,
                  fat:      acc.fat      + m.totals.fat,
                }, { calories: 0, protein: 0, carbs: 0, fat: 0 })

                return (
                  <div key={date} className={`log-date-item ${idx < entries.length - 1 ? 'log-date-item--border' : ''}`}>
                    <button className="log-date-row" onClick={() => setActiveDate(date)}>
                      <span className="log-date-label">{formatDate(date)}</span>
                      <span className="log-date-arrow">›</span>
                    </button>
                    {!dismissed.has(date) && (
                      <div className="log-date-summary">
                        <div className="log-date-summary-top">
                          <span className="log-date-summary-meta">{meals.length} meal{meals.length !== 1 ? 's' : ''} &bull; {dt.calories} kcal</span>
                          <button className="log-dismiss-btn" onClick={() => setDismissed(prev => new Set([...prev, date]))}>✕</button>
                        </div>
                        <MacroLine protein={dt.protein} carbs={dt.carbs} fat={dt.fat} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Right: combined macro panel ── */}
        {showPanel && (
          <CombinedMacroPanel
            combined={combined}
            dateCount={selectedDates.length}
          />
        )}
      </div>

      {activeDate && (
        <DayModal
          date={activeDate}
          meals={dayMap[activeDate] || []}
          onClose={() => setActiveDate(null)}
        />
      )}
    </div>
  )
}

export default Log
