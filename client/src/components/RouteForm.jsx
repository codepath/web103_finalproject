import { useState } from 'react'
import WallComponent from './WallComponent'
import HoldLegend from './Hold'
import { grades } from '../data/starterRoutes'
import ClimbingHoldsDrawer from './ClimbingHoldsDrawer'
import { findOverlappingHold, getHoldSize, SIZES } from '../utils/holdFootprint'

function RouteForm({ existing, onSave }) {
  const [name, setName] = useState(existing?.name ?? '')
  const [grade, setGrade] = useState(existing?.grade ?? 'V0')
  const [wallType, setWallType] = useState(existing?.wallType ?? 'Vertical')
  const [role, setRole] = useState('hand')
  const [rotation, setRotation] = useState(0)
  const [catalogHold, setCatalogHold] = useState(null)
  const [holds, setHolds] = useState(existing?.holds ?? [])
  const [error, setError] = useState('')
  const [selectedCell, setSelectedCell] = useState(null)
  const selectedHold = selectedCell && holds.find((hold) => hold.row === selectedCell.row && hold.col === selectedCell.col)

  function handleCellClick(row, col) {
    if (!catalogHold) {
      setError('Pick a hold from the drawer first.')
      return
    }
    setError('')
    setHolds((current) => [
      ...current,
      { row, col, role, holdId: catalogHold.id, imageUrl: catalogHold.imageUrl, size: catalogHold.size, rotation },
    ])
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

  // A placed hold can only change to a size that still fits without overlapping its neighbors.
  function sizeFits(size) {
    const others = holds.filter((hold) => hold !== selectedHold)
    return !findOverlappingHold(selectedHold.row, selectedHold.col, size, others)
  }

  function resizeHold(size) {
    updateSelectedHold({ size })
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
        <ClimbingHoldsDrawer
          selectedHold={catalogHold}
          onSelectHold={(hold) => { setCatalogHold(hold); setError('') }}
          role={role}
          onRoleChange={setRole}
          rotation={rotation}
          onRotationChange={setRotation}
        />
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions">
          <button className="button button-reset" onClick={() => { setHolds([]); setSelectedCell(null) }} type="button">Reset Wall</button>
          <button className="button button-primary" type="submit">Save route</button>
        </div>
      </div>
      <div>
        <p className="wall-instruction">
          {catalogHold
            ? <>Click a bolt to place a <strong>{catalogHold.name}</strong> as a <strong>{role}</strong> hold at {rotation}°. Click a placed hold to edit it.</>
            : 'Pick a hold from the drawer, then click a bolt to place it. Click a placed hold to edit it.'}
        </p>
        {selectedHold && (
          <div className="hold-actions">
            <span>
              <strong>{getHoldSize(selectedHold)} {selectedHold.role}</strong> hold · row {selectedHold.row}, col {selectedHold.col} · {selectedHold.rotation ?? 0}°
            </span>
            <div className="hold-size-buttons" role="group" aria-label="Hold size">
              {SIZES.map((item) => {
                const isCurrent = getHoldSize(selectedHold) === item
                const fits = isCurrent || sizeFits(item)
                return (
                  <button
                    className={`button button-reset${isCurrent ? ' selected' : ''}`}
                    disabled={!fits}
                    key={item}
                    onClick={() => resizeHold(item)}
                    title={fits ? `Make this a ${item} hold` : `A ${item} hold would overlap a neighboring hold`}
                    type="button"
                  >
                    {item}
                  </button>
                )
              })}
            </div>
            <button className="button button-reset" onClick={cycleRole} type="button">Cycle role</button>
            <button className="button button-reset" onClick={rotateHold} type="button">Rotate 45°</button>
            <button className="button button-danger" onClick={removeHold} type="button">Remove</button>
            <button className="button button-reset" onClick={() => setSelectedCell(null)} type="button">Done</button>
          </div>
        )}
        <WallComponent holds={holds} wallType={wallType} placingSize={catalogHold?.size ?? 'medium'} editable onCellClick={handleCellClick} onPlacedHoldClick={handlePlacedHoldClick} />
        <HoldLegend />
      </div>
    </form>
  )
}

export default RouteForm
