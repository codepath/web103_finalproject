import { useEffect, useId, useRef, useState } from 'react'

// A styled replacement for <select>, following the ARIA "select-only combobox/listbox" pattern:
// Enter/Space/ArrowDown opens, arrows/Home/End move, Enter/Space picks, Escape/Tab closes.
function Dropdown({ label, value, options, onChange }) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const listRef = useRef(null)

  const selectedIndex = Math.max(
    0,
    options.findIndex(([v]) => v === value),
  )
  const selectedText = options[selectedIndex]?.[1] ?? ''

  // Close when clicking anywhere outside
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      if (!rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  useEffect(() => {
    if (open) listRef.current?.focus()
  }, [open])

  const openList = () => {
    setActive(selectedIndex)
    setOpen(true)
  }
  const close = (refocus = true) => {
    setOpen(false)
    if (refocus) buttonRef.current?.focus()
  }
  const pick = (index) => {
    onChange(options[index][0])
    close()
  }

  const onButtonKeyDown = (e) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault()
      openList()
    }
  }

  const onListKeyDown = (e) => {
    const last = options.length - 1
    const moves = {
      ArrowDown: Math.min(active + 1, last),
      ArrowUp: Math.max(active - 1, 0),
      Home: 0,
      End: last,
    }
    if (e.key in moves) {
      e.preventDefault()
      setActive(moves[e.key])
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      pick(active)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (e.key === 'Tab') close(false)
  }

  return (
    <div className={`filter${open ? ' open' : ''}`} ref={rootRef}>
      <span id={`${id}-label`} onClick={() => (open ? close() : openList())}>
        {label}
      </span>
      <button
        type="button"
        ref={buttonRef}
        id={`${id}-button`}
        className="filter-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-button`}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onButtonKeyDown}
      >
        {selectedText}
        <svg
          className="chevron"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul
          ref={listRef}
          className="filter-menu"
          role="listbox"
          tabIndex={-1}
          aria-labelledby={`${id}-label`}
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={onListKeyDown}
        >
          {options.map(([optValue, text], i) => (
            <li
              key={optValue}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === selectedIndex}
              className={i === active ? 'active' : undefined}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(i)}
            >
              {text}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dropdown
