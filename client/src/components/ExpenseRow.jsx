import { useState } from 'react'
import { api, formatDate, formatMoney } from '../api.js'
import { useActiveUser } from '../context/ActiveUserContext.jsx'
import ExpenseForm from './ExpenseForm.jsx'
import { useAsyncAction, useFeedback } from '../context/useFeedback.js'
import Spinner from './Spinner.jsx'

export default function ExpenseRow({ expense, members, onChanged }) {
  const { activeUser } = useActiveUser()
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const { busy, pending, run } = useAsyncAction()
  const { notify } = useFeedback()
  const mine = expense.created_by_id === activeUser.id

  async function save(values) {
    await api(`/expenses/${expense.id}`, { method: 'PATCH', body: values })
    notify('Expense updated.')
    setEditing(false)
    await onChanged()
  }

  async function remove() {
    if (busy) return
    if (!window.confirm(`Delete "${expense.description}"?`)) return
    return run(async () => {
      setError('')
      try {
        await api(`/expenses/${expense.id}`, { method: 'DELETE' })
        notify('Expense deleted.')
        await onChanged()
      } catch (err) {
        setError(err.message)
      }
    })
  }

  if (editing) {
    return (
      <ExpenseForm
        members={members}
        initial={{
          description: expense.description,
          amount: expense.amount,
          payer_id: expense.payer_id,
          expense_date: expense.expense_date,
        }}
        submitLabel="Save expense"
        onSubmit={save}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <article className="card expense-row">
      <div className="trip-card-head">
        <h3>{expense.description}</h3>
        <strong>{formatMoney(expense.amount)}</strong>
      </div>
      <p className="page-note">
        Paid by {expense.payer_name} · {formatDate(expense.expense_date)}
      </p>
      {error && <p className="error" role="alert">{error}</p>}
      {mine && (
        <div className="inline-row">
          <button className="btn btn-small" disabled={busy} onClick={() => setEditing(true)}>Edit</button>
          <button className="btn btn-small btn-danger" disabled={busy} onClick={remove}>
            {pending && <Spinner inline />}{pending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      )}
    </article>
  )
}
