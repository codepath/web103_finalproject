/**
 * MultiDatePicker
 *
 * A fully controlled, zero-dependency multi-date calendar picker.
 *
 * Props (on the default export):
 *   value    {string[]}  – array of selected date keys in "YYYY-MM-DD" format
 *   onChange {function}  – called with the new sorted array when the user clicks "Done"
 *
 * Usage:
 *   import MultiDatePicker from '../components/MultiDatePicker'
 *   const [dates, setDates] = useState([])
 *   <MultiDatePicker value={dates} onChange={setDates} />
 *
 * No external packages required — only React hooks and plain CSS.
 */

import { useState } from 'react'
import './MultiDatePicker.css'

// ── Constants ─────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const DOW_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Build a "YYYY-MM-DD" key from numeric parts (avoids timezone drift). */
const toKey = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

/** Today's key — used to highlight the current date in the calendar. */
const todayKey = (() => {
  const now = new Date()
  return toKey(now.getFullYear(), now.getMonth(), now.getDate())
})()

/**
 * Returns an array of either null (empty leading cells) or day numbers (1-based)
 * for a given year/month so the first day falls on the correct column.
 */
const buildCalendarGrid = (year, month) => {
  const firstDow = new Date(year, month, 1).getDay()         // 0=Sun … 6=Sat
  const daysInMonth = new Date(year, month + 1, 0).getDate() // last day of month
  const grid = Array(firstDow).fill(null)                    // leading empty cells
  for (let d = 1; d <= daysInMonth; d++) grid.push(d)
  return grid
}

/** Format a YYYY-MM-DD key for the tag display (e.g. "Mon, Apr 22, 2026"). */
const formatTag = (key) =>
  new Date(key + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })

// ── Calendar modal ────────────────────────────────────────────────────────────

/**
 * The popup calendar. Manages its own local selection state so the user
 * can cancel out (close without clicking Done) without committing changes.
 */
const CalendarModal = ({ initialSelected, onDone, onClose }) => {
  const now = new Date()

  // Which month/year the calendar is showing
  const [viewYear, setViewYear]  = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())

  // Local copy of selections — only committed to the parent on "Done"
  const [local, setLocal] = useState(new Set(initialSelected))

  const grid = buildCalendarGrid(viewYear, viewMonth)

  // Navigate to the previous calendar month
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  // Navigate to the next calendar month
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  // Toggle a day on/off in the local selection set
  const toggleDay = (day) => {
    if (!day) return
    const key = toKey(viewYear, viewMonth, day)
    setLocal(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  // Commit selections and close
  const handleDone = () => {
    onDone([...local].sort()) // ascending order
    onClose()
  }

  return (
    // Clicking the overlay backdrop closes without saving
    <div className="mdp-overlay" role="dialog" aria-modal="true" aria-label="Date picker" onClick={onClose}>
      <div className="mdp-modal" onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="mdp-header">
          <h2 className="mdp-title">Select Dates</h2>
          <button className="mdp-close" onClick={onClose} aria-label="Close date picker">✕</button>
        </div>

        <p className="mdp-subtitle">
          {local.size > 0
            ? `${local.size} date${local.size !== 1 ? 's' : ''} selected`
            : 'Click a date to select it'}
        </p>

        {/* ── Month navigation ── */}
        <div className="mdp-nav">
          <button className="mdp-nav-btn" onClick={prevMonth} aria-label="Previous month">‹</button>
          <span className="mdp-month-label">{MONTH_NAMES[viewMonth]} {viewYear}</span>
          <button className="mdp-nav-btn" onClick={nextMonth} aria-label="Next month">›</button>
        </div>

        {/* ── Day-of-week header row ── */}
        <div className="mdp-grid" role="grid">
          {DOW_LABELS.map(d => (
            <div key={d} className="mdp-dow" role="columnheader" aria-label={d}>{d}</div>
          ))}

          {/* ── Calendar day cells ── */}
          {grid.map((day, i) => {
            // Empty leading cells keep alignment correct
            if (!day) return <div key={`blank-${i}`} aria-hidden="true" />

            const key = toKey(viewYear, viewMonth, day)
            const isSelected = local.has(key)
            const isToday    = key === todayKey

            return (
              <button
                key={key}
                role="gridcell"
                className={[
                  'mdp-day',
                  isSelected ? 'mdp-day--selected' : '',
                  isToday    ? 'mdp-day--today'    : '',
                ].join(' ')}
                onClick={() => toggleDay(day)}
                aria-label={`${MONTH_NAMES[viewMonth]} ${day}, ${viewYear}${isSelected ? ' — selected' : ''}`}
                aria-pressed={isSelected}
              >
                {day}
                {/* Checkmark visible only on selected dates */}
                {isSelected && <span className="mdp-check" aria-hidden="true">✓</span>}
              </button>
            )
          })}
        </div>

        {/* ── Footer ── */}
        <div className="mdp-footer">
          <button
            className="mdp-clear-btn"
            onClick={() => setLocal(new Set())}
            disabled={local.size === 0}
          >
            Clear All
          </button>
          <button className="mdp-done-btn" onClick={handleDone}>
            Done{local.size > 0 ? ` (${local.size})` : ''}
          </button>
        </div>

      </div>
    </div>
  )
}

// ── Public component ──────────────────────────────────────────────────────────

/**
 * Renders a "Select Dates" trigger button plus the resulting date tags.
 * Controlled via `value` / `onChange` — the parent owns the selection array.
 */
const MultiDatePicker = ({ value = [], onChange }) => {
  const [open, setOpen] = useState(false)

  // Remove a single tag without opening the modal
  const removeDate = (key) => onChange(value.filter(d => d !== key))

  return (
    <div>
      {/* ── Trigger row ── */}
      <div className="mdp-trigger-row">
        <button className="mdp-trigger-btn" onClick={() => setOpen(true)}>
          <span className="mdp-trigger-icon">📅</span>
          Select Dates
          {value.length > 0 && ` (${value.length})`}
        </button>
        {value.length > 0 && (
          <button className="mdp-clear-all-btn" onClick={() => onChange([])}>
            Clear All
          </button>
        )}
      </div>

      {/* ── Selected date tags ── */}
      {value.length > 0 && (
        <div className="mdp-tags" role="list" aria-label="Selected dates">
          {value.map(key => (
            <span key={key} className="mdp-tag" role="listitem">
              {formatTag(key)}
              <button
                className="mdp-tag-remove"
                onClick={() => removeDate(key)}
                aria-label={`Remove ${formatTag(key)}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* ── Calendar modal (mounted only when open) ── */}
      {open && (
        <CalendarModal
          initialSelected={value}
          onDone={onChange}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}

export default MultiDatePicker
