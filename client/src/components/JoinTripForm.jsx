import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { useAsyncAction, useFeedback } from '../context/useFeedback.js'
import Spinner from './Spinner.jsx'

export default function JoinTripForm() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const { busy, pending, run } = useAsyncAction()
  const { notify } = useFeedback()

  async function join(event) {
    event.preventDefault()
    return run(async () => {
      setError('')
      try {
        const { id } = await api('/trips/join', { method: 'POST', body: { invite_code: code } })
        notify('You joined the trip.')
        navigate(`/trips/${id}`)
      } catch (err) {
        setError(err.message)
      }
    })
  }

  return (
    <form className="card join-form" onSubmit={join} aria-busy={pending}>
      <label htmlFor="invite-code">Have an invite code?</label>
      <div className="inline-row">
        <input id="invite-code" disabled={busy} value={code} onChange={(event) => setCode(event.target.value)} placeholder="e.g. SEATTLE26" required />
        <button className="btn" disabled={busy}>{pending && <Spinner inline />}{pending ? 'Joining…' : 'Join trip'}</button>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
    </form>
  )
}
