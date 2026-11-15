import { createContext, useContext, useState } from 'react'

export const FeedbackContext = createContext(null)

export function useFeedback() {
  const context = useContext(FeedbackContext)
  if (!context) throw new Error('FeedbackProvider is required.')
  return context
}

// The provider locks synchronously, before React renders a disabled button.
// This also prevents a second mutation (such as logout) during an active save.
export function useAsyncAction() {
  const { busy, runMutation } = useFeedback()
  const [pending, setPending] = useState(false)
  const run = (action) => runMutation(async () => {
    setPending(true)
    try { return await action() }
    finally { setPending(false) }
  })
  return { busy, pending, run }
}
