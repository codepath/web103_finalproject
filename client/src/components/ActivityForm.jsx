import { useState } from 'react'
import { useAsyncAction } from '../context/useFeedback.js'
import Spinner from './Spinner.jsx'

const EMPTY = { title: '', location: '', scheduled_date: '', description: '', estimated_cost: '' }

export default function ActivityForm({ trip, initial, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(initial || EMPTY)
  const [error, setError] = useState('')
  const { busy, pending: saving, run } = useAsyncAction()

  const change = (event) => setValues({ ...values, [event.target.name]: event.target.value })

  async function submit(event) {
    event.preventDefault()
    return run(async () => {
      setError('')
      try {
        await onSubmit({ ...values, scheduled_date: values.scheduled_date || null })
        if (!initial) setValues(EMPTY)
      } catch (err) {
        setError(err.message)
      }
    })
  }

  return (
    <form className="form card" onSubmit={submit} aria-busy={saving}>
      <fieldset className="form-fields" disabled={busy}>
        <label>
          Title
          <input name="title" value={values.title} onChange={change} required />
        </label>
        <div className="form-row">
          <label>
            Location
            <input name="location" value={values.location || ''} onChange={change} />
          </label>
          <label>
            Date
            <input
              type="date"
              name="scheduled_date"
              min={trip.start_date}
              max={trip.end_date}
              value={values.scheduled_date || ''}
              onChange={change}
            />
          </label>
        </div>
        <label>
          Description
          <textarea name="description" rows="2" value={values.description || ''} onChange={change} />
        </label>
        <label>
          Estimated cost (USD)
          <input type="number" name="estimated_cost" min="0" step="0.01" value={values.estimated_cost} onChange={change} />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="inline-row">
          <button className="btn btn-primary" disabled={busy}>{saving && <Spinner inline />}{saving ? 'Saving…' : submitLabel}</button>
          {onCancel && <button type="button" className="btn" disabled={busy} onClick={onCancel}>Cancel</button>}
        </div>
      </fieldset>
    </form>
  )
}
