import { useState } from 'react'
import { useAsyncAction } from '../context/useFeedback.js'
import Spinner from './Spinner.jsx'
import { useActiveUser } from '../context/ActiveUserContext.jsx'

export default function ExpenseForm({ members, initial, submitLabel, onSubmit, onCancel }) {
  const { activeUser } = useActiveUser()
  const [values, setValues] = useState(
    initial || { description: '', amount: '', payer_id: activeUser.id, expense_date: '' },
  )
  const [error, setError] = useState('')
  const { busy, pending: saving, run } = useAsyncAction()

  const change = (event) => setValues({ ...values, [event.target.name]: event.target.value })

  async function submit(event) {
    event.preventDefault()
    return run(async () => {
      setError('')
      try {
        await onSubmit({ ...values, payer_id: Number(values.payer_id) })
        if (!initial) setValues({ description: '', amount: '', payer_id: activeUser.id, expense_date: '' })
      } catch (err) {
        setError(err.message)
      }
    })
  }

  return (
    <form className="form card" onSubmit={submit} aria-busy={saving}>
      <fieldset className="form-fields" disabled={busy}>
        <label>
          Description
          <input name="description" value={values.description} onChange={change} required />
        </label>
        <div className="form-row">
          <label>
            Amount (USD)
            <input type="number" name="amount" min="0.01" step="0.01" value={values.amount} onChange={change} required />
          </label>
          <label>
            Paid by
            <select name="payer_id" value={values.payer_id} onChange={change}>
              {members.map((member) => (
                <option key={member.user_id} value={member.user_id}>{member.name}</option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input type="date" name="expense_date" value={values.expense_date || ''} onChange={change} />
          </label>
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="inline-row">
          <button className="btn btn-primary" disabled={busy}>{saving && <Spinner inline />}{saving ? 'Saving…' : submitLabel}</button>
          {onCancel && <button type="button" className="btn" disabled={busy} onClick={onCancel}>Cancel</button>}
        </div>
      </fieldset>
    </form>
  )
}
