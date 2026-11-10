import { useState } from 'react'
import WallComponent from './WallComponent'
import HoldLegend from './Hold'
import { grades } from '../data/starterRoutes'

function RouteForm({ existing, onSave }) {
  const [name, setName] = useState(existing?.name ?? '')
  const [grade, setGrade] = useState(existing?.grade ?? 'V0')
  const [wallType, setWallType] = useState(existing?.wallType ?? 'Vertical')
  const [role, setRole] = useState('hand')
  const [holds, setHolds] = useState(existing?.holds ?? [])
  const [error, setError] = useState('')
  const [selectedCell, setSelectedCell] = useState(null)
  const selectedHold = selectedCell && holds.find((hold) => hold.row === selectedCell.row && hold.col === selectedCell.col)

  // TODO(#12): use the hold selected in ClimbingHoldsDrawer instead of this default image.
  function handleCellClick(row, col) {
    setHolds((current) => [...current, { row, col, role, imageUrl: '/holds/jug-orange-medium.png', rotation: 0 }])
    setSelectedCell(null)
  }

  function handlePlacedHoldClick(hold) {
    setSelectedCell({ row: hold.row, col: hold.col })
  }

  function updateSelectedHold(changes) {
    setHolds((current) => current.map((hold) => (hold === selectedHold ? { ...hold, ...changes } : hold)))
  }

  function cycleRole() {
    const roles = ['start', 'hand', 'foot', 'finish']
    updateSelectedHold({ role: roles[(roles.indexOf(selectedHold.role) + 1) % roles.length] })
  }

  function rotateHold() {
    updateSelectedHold({ rotation: ((selectedHold.rotation ?? 0) + 45) % 360 })
  }

  function removeHold() {
    setHolds((current) => current.filter((hold) => hold !== selectedHold))
    setSelectedCell(null)
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
          <button className="button button-reset" onClick={() => { setHolds([]); setSelectedCell(null) }} type="button">Reset Wall</button>
          <button className="button button-primary" type="submit">Save route</button>
        </div>
      </div>
      <div>
        <p className="wall-instruction">Click a bolt to place a <strong>{role}</strong> hold. Click a placed hold to edit it.</p>
        {selectedHold && (
          <div className="hold-actions">
            <span>
              <strong>{selectedHold.role}</strong> hold · row {selectedHold.row}, col {selectedHold.col} · {selectedHold.rotation ?? 0}°
            </span>
            <button className="button button-reset" onClick={cycleRole} type="button">Cycle role</button>
            <button className="button button-reset" onClick={rotateHold} type="button">Rotate 45°</button>
            <button className="button button-danger" onClick={removeHold} type="button">Remove</button>
            <button className="button button-reset" onClick={() => setSelectedCell(null)} type="button">Done</button>
          </div>
        )}
        <WallComponent holds={holds} wallType={wallType} editable onCellClick={handleCellClick} onPlacedHoldClick={handlePlacedHoldClick} />
        <HoldLegend />
      </div>
    </form>
  )
}

export default RouteForm
