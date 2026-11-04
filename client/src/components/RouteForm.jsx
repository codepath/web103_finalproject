import { useState } from 'react'
import ClimbingWall from './ClimbingWall'
import HoldLegend from './Hold'
import { grades } from '../data/starterRoutes'

function RouteForm({ existing, onSave }) {
  const [name, setName] = useState(existing?.name ?? '')
  const [grade, setGrade] = useState(existing?.grade ?? 'V0')
  const [wallType, setWallType] = useState(existing?.wallType ?? 'Vertical')
  const [role, setRole] = useState('hand')
  const [holds, setHolds] = useState(existing?.holds ?? [])
  const [error, setError] = useState('')

  function handleHoldClick(row, col) {
    setHolds((current) => {
      const found = current.find((hold) => hold.row === row && hold.col === col)
      if (found) return current.filter((hold) => hold !== found)
      return [...current, { row, col, role, color: '#f97316' }]
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim() || !holds.some((hold) => hold.role === 'start') || !holds.some((hold) => hold.role === 'finish')) {
      setError('Add a route name, at least one start hold, and a finish hold before saving.')
      return
    }
    onSave({ id: existing?.id, name: name.trim(), grade, wallType, holds })
  }

  return (
    <form className="builder-layout" onSubmit={handleSubmit}>
      <div className="form-panel">
        <label>Route name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Moonwalk" /></label>
        <label>Grade<select value={grade} onChange={(event) => setGrade(event.target.value)}>{grades.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Wall type<select value={wallType} onChange={(event) => setWallType(event.target.value)}><option>Vertical</option><option>Slab</option><option>Overhang</option><option>Roof</option></select></label>
        <fieldset>
          <legend>Next hold role</legend>
          <div className="role-picker">{['start', 'hand', 'foot', 'finish'].map((item) => <button type="button" className={role === item ? 'selected' : ''} key={item} onClick={() => setRole(item)}>{item}</button>)}</div>
        </fieldset>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions">
          <button className="button button-reset" onClick={() => setHolds([])} type="button">Reset Wall</button>
          <button className="button button-primary" type="submit">Save route</button>
        </div>
      </div>
      <div>
        <p className="wall-instruction">Select <strong>{role}</strong> holds on the wall. Select a hold again to remove it.</p>
        <ClimbingWall holds={holds} interactive onHoldClick={handleHoldClick} />
        <HoldLegend />
      </div>
    </form>
  )
}

export default RouteForm
