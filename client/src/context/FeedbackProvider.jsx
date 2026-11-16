import { useCallback, useEffect, useRef, useState } from 'react'
import { FeedbackContext } from './useFeedback.js'

function Toast({ toast, onDismiss }) {
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    const timer = window.setTimeout(() => onDismiss(toast.id), toast.type === 'error' ? 10000 : 6000)
    return () => window.clearTimeout(timer)
  }, [paused, toast.id, toast.type, onDismiss])

  return (
    <div className={`toast toast-${toast.type}`}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false) }}>
      <span className="toast-mark" aria-hidden="true">{toast.type === 'error' ? '!' : '✓'}</span>
      <p role={toast.type === 'error' ? 'alert' : 'status'}>{toast.message}</p>
      <button type="button" className="toast-dismiss" onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification">×</button>
    </div>
  )
}

export default function FeedbackProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [busy, setBusy] = useState(false)
  const locked = useRef(false)
  const nextId = useRef(0)
  const notify = useCallback((message, type = 'success') => {
    const toast = { id: ++nextId.current, message, type }
    setToasts((previous) => [...previous.filter((item) => item.message !== message), toast].slice(-4))
  }, [])
  const dismiss = useCallback((id) => setToasts((previous) => previous.filter((item) => item.id !== id)), [])
  const runMutation = useCallback(async (action) => {
    if (locked.current) return
    locked.current = true
    setBusy(true)
    try { return await action() }
    finally {
      locked.current = false
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    const onError = (event) => notify(event.detail, 'error')
    window.addEventListener('api-error', onError)
    return () => window.removeEventListener('api-error', onError)
  }, [notify])

  return (
    <FeedbackContext.Provider value={{ busy, notify, runMutation }}>
      {children}
      <div className="toast-stack" role="region" aria-label="Notifications">
        {toasts.map((toast) => <Toast key={toast.id} toast={toast} onDismiss={dismiss} />)}
      </div>
    </FeedbackContext.Provider>
  )
}
