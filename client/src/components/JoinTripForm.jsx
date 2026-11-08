import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'

export default function JoinTripForm() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  async function join(event) {
    event.preventDefault()
    setError('')
    try {
      const { id } = await api('/trips/join', { method: 'POST', body: { invite_code: code } })
      navigate(`/trips/${id}`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="card join-form" onSubmit={join}>
      <label htmlFor="invite-code">Have an invite code?</label>
      <div className="inline-row">
        <input id="invite-code" value={code} onChange={(event) => setCode(event.target.value)} placeholder="e.g. SEATTLE26" required />
        <button className="btn">Join trip</button>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
    </form>
  )
}
