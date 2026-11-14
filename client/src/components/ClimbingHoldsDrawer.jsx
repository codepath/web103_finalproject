import { useEffect, useMemo, useState } from 'react'
import { fetchHolds } from '../api/holds'
import { SIZES } from '../utils/holdFootprint'

const HOLD_TYPES = ['crimp', 'jug', 'sloper', 'pocket', 'pinch']
const ROLES = ['start', 'hand', 'foot', 'finish']
const ROTATIONS = [0, 45, 90, 135, 180, 225, 270, 315]

// Paintbrush palette: pick a hold, role and rotation here, then click a bolt on the wall.
function ClimbingHoldsDrawer({ selectedHold, onSelectHold, role, onRoleChange, rotation, onRotationChange }) {
  const [holds, setHolds] = useState([])
  const [status, setStatus] = useState('loading')
  const [activeType, setActiveType] = useState(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetchHolds()
      .then((data) => {
        if (cancelled) return
        setHolds(data)
        setStatus('ready')
      })
      .catch(() => !cancelled && setStatus('error'))
    return () => {
      cancelled = true
    }
  }, [attempt])

  // One section per hold type, each ordered small -> large.
  const sections = useMemo(() => {
    const byType = new Map()
    for (const hold of holds) {
      if (!byType.has(hold.holdType)) byType.set(hold.holdType, [])
      byType.get(hold.holdType).push(hold)
    }
    const types = [...HOLD_TYPES.filter((type) => byType.has(type)), ...[...byType.keys()].filter((type) => !HOLD_TYPES.includes(type))]
    return types.map((type) => ({
      type,
      holds: byType.get(type).sort((a, b) => SIZES.indexOf(a.size) - SIZES.indexOf(b.size)),
    }))
  }, [holds])

  const current = sections.find((section) => section.type === activeType) ?? sections[0]

  return (
    <div className="holds-drawer">
      <p className="holds-drawer-title">Hold drawer</p>

      {status === 'loading' && <p className="holds-drawer-note">Loading holds…</p>}
      {status === 'error' && (
        <div className="holds-drawer-note" role="alert">
          Couldn't load the hold catalog.{' '}
          <button className="holds-drawer-retry" onClick={() => { setStatus('loading'); setAttempt((count) => count + 1) }} type="button">Retry</button>
        </div>
      )}
      {status === 'ready' && sections.length === 0 && <p className="holds-drawer-note">No holds available yet.</p>}

      {current && (
        <>
          <div className="holds-drawer-tabs" role="tablist" aria-label="Hold type">
            {sections.map((section) => (
              <button
                aria-selected={section.type === current.type}
                className={section.type === current.type ? 'selected' : ''}
                key={section.type}
                onClick={() => setActiveType(section.type)}
                role="tab"
                type="button"
              >
                {section.type}
              </button>
            ))}
          </div>
          <div className="holds-drawer-grid">
            {current.holds.map((hold) => (
              <button
                aria-pressed={selectedHold?.id === hold.id}
                className={`hold-card${selectedHold?.id === hold.id ? ' selected' : ''}`}
                key={hold.id}
                onClick={() => onSelectHold(selectedHold?.id === hold.id ? null : hold)}
                title={hold.name}
                type="button"
              >
                <img src={hold.imageUrl} alt="" draggable={false} />
                <span>{hold.size}</span>
              </button>
            ))}
          </div>
        </>
      )}

      <fieldset>
        <legend>Role</legend>
        <div className="role-picker">
          {ROLES.map((item) => (
            <button className={role === item ? 'selected' : ''} key={item} onClick={() => onRoleChange(item)} type="button">{item}</button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Rotation</legend>
        <div className="role-picker rotation-picker">
          {ROTATIONS.map((degrees) => (
            <button className={rotation === degrees ? 'selected' : ''} key={degrees} onClick={() => onRotationChange(degrees)} type="button">{degrees}°</button>
          ))}
        </div>
      </fieldset>
    </div>
  )
}

export default ClimbingHoldsDrawer
