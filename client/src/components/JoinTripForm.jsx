import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { useAsyncAction, useFeedback } from '../context/useFeedback.js'
import Spinner from './Spinner.jsx'
import Icon from './Icon.jsx'

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
      <div className="join-copy"><span className="join-icon"><Icon name="ticket" /></span><div><label htmlFor="invite-code">An adventure with your name on it?</label><p>Have an invite code? Your friends saved you a spot.</p></div></div>
      <div className="inline-row join-controls">
        <input id="invite-code" disabled={busy} value={code} onChange={(event) => setCode(event.target.value)} placeholder="e.g. SEATTLE26" required />
        <button className="btn" disabled={busy}>{pending ? <Spinner inline /> : <Icon name="arrow" />}{pending ? 'Joining…' : 'Join trip'}</button>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
    </form>
  )
}
