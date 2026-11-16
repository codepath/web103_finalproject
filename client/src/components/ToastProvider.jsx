import { useCallback, useEffect, useMemo, useState } from 'react'
import { ToastContext } from '../context/ToastContext.jsx'
import Toast from './Toast.jsx'

export default function ToastProvider({ children }) {
  const [notice, setNotice] = useState(null)
  const dismiss = useCallback(() => setNotice(null), [])
  const show = useCallback((type, message) => {
    setNotice({ id: Date.now(), type, message: String(message) })
  }, [])
  const api = useMemo(() => ({
    success: (message) => show('success', message),
    error: (message) => show('error', message),
    dismiss,
  }), [show, dismiss])
  useEffect(() => {
    if (!notice) return undefined
    const timeout = window.setTimeout(dismiss, 5000)
    return () => window.clearTimeout(timeout)
  }, [notice, dismiss])
  return (
    <ToastContext.Provider value={api}>
      {children}
      {notice && <div className="lb-toast-region"><Toast key={notice.id} message={notice.message} type={notice.type} onDismiss={dismiss} /></div>}
    </ToastContext.Provider>
  )
}
