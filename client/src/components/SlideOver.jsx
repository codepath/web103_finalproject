import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import '../styles/slideover.css'
import { useFeedback } from '../context/useFeedback.js'

const FOCUSABLE = 'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled)'

// A pane that slides in over the page. It closes with Escape, the backdrop, or the close button,
// keeps keyboard focus inside while open, and returns focus to whatever opened it.
export default function SlideOver({ title, onClose, children }) {
  const { busy } = useFeedback()
  const titleId = useId()
  const panelRef = useRef(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = () => { if (!busy) onClose() }
  }, [busy, onClose])

  useEffect(() => {
    if (busy) panelRef.current?.focus()
    else if (document.activeElement === panelRef.current) panelRef.current?.querySelector(FOCUSABLE)?.focus()
  }, [busy])

  useEffect(() => {
    const opener = document.activeElement
    const panel = panelRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Focus the first form field (not the close button) so people can start typing.
    const fields = panel.querySelectorAll('input, select, textarea')
    ;(fields[0] || panel.querySelector(FOCUSABLE)).focus()

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return
      const items = [...panel.querySelectorAll(FOCUSABLE)]
      if (items.length === 0) {
        event.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      if (opener && document.contains(opener)) opener.focus()
    }
  }, [])

  return createPortal(
    <div className="slideover-root">
      <div className="slideover-backdrop" onClick={() => onCloseRef.current()} />
      <aside ref={panelRef} className="slideover" role="dialog" tabIndex={-1} aria-modal="true" aria-labelledby={titleId}>
        <header className="slideover-head">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="btn btn-small" disabled={busy} onClick={onClose} aria-label="Close panel">
            Close
          </button>
        </header>
        <div className="slideover-body">{children}</div>
      </aside>
    </div>,
    document.body,
  )
}
