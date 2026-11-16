import { createContext, useContext } from 'react'

export const ToastContext = createContext(null)

export function useToast() {
  const toast = useContext(ToastContext)
  if (!toast) throw new Error('useToast must be used within ToastProvider')
  return toast
}
