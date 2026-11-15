import { useState } from 'react'

// Calls POST /api/reset, then reloads so every page refetches the seeded data
function ResetButton() {
  const [resetting, setResetting] = useState(false)

  async function handleReset() {
    if (
      !window.confirm(
        'Reset demo data? All events and venues go back to the original sample data, and any you posted are deleted.',
      )
    )
      return
    setResetting(true)
    try {
      const res = await fetch('/api/reset', { method: 'POST' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Reset failed (${res.status})`)
      }
      window.location.assign('/')
    } catch (err) {
      window.alert(err.message)
      setResetting(false)
    }
  }

  return (
    <button
      type="button"
      className="secondary-button danger"
      onClick={handleReset}
      disabled={resetting}
    >
      {resetting ? 'Resetting…' : 'Reset demo data'}
    </button>
  )
}

export default ResetButton
