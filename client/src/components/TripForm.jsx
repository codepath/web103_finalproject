import { useState } from 'react'

const EMPTY = { title: '', destination: '', start_date: '', end_date: '', budget: '' }

export default function TripForm({ initial, submitLabel, onSubmit }) {
  const [values, setValues] = useState(initial || EMPTY)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const change = (event) => setValues({ ...values, [event.target.name]: event.target.value })

  async function submit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onSubmit(values)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <label>
        Title
        <input name="title" value={values.title} onChange={change} required />
      </label>
      <label>
        Destination
        <input name="destination" value={values.destination} onChange={change} required />
      </label>
      <div className="form-row">
        <label>
          Start date
          <input type="date" name="start_date" value={values.start_date} onChange={change} required />
        </label>
        <label>
          End date
          <input type="date" name="end_date" value={values.end_date} onChange={change} required />
        </label>
      </div>
      <label>
        Budget (USD)
        <input type="number" name="budget" min="0" step="0.01" value={values.budget} onChange={change} required />
      </label>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : submitLabel}</button>
    </form>
  )
}
