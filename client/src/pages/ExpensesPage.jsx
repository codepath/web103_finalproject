import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api, formatMoney } from '../api.js'
import { useActiveUser } from '../context/ActiveUserContext.jsx'
import ExpenseForm from '../components/ExpenseForm.jsx'
import ExpenseRow from '../components/ExpenseRow.jsx'

export default function ExpensesPage() {
  const { tripId } = useParams()
  const { activeUser } = useActiveUser()
  const [data, setData] = useState(null)
  const [members, setMembers] = useState([])
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(
    () => api(`/trips/${tripId}/expenses`).then(setData).catch((err) => setError(err.message)),
    [tripId],
  )

  useEffect(() => {
    setData(null)
    setError('')
    load()
    api(`/trips/${tripId}/members`).then(setMembers).catch(() => {})
  }, [tripId, activeUser.id, load])

  async function addExpense(values) {
    await api(`/trips/${tripId}/expenses`, { method: 'POST', body: values })
    setAdding(false)
    await load()
  }

  if (error) return <p className="error" role="alert">{error}</p>
  if (!data) return <p className="page-note">Loading expenses…</p>

  const over = data.total > data.budget
  const percent = data.budget > 0 ? Math.min(100, (data.total / data.budget) * 100) : data.total > 0 ? 100 : 0

  return (
    <section>
      <div className="page-head">
        <h1>Expenses</h1>
        {!adding && <button className="btn btn-primary" onClick={() => setAdding(true)}>Add expense</button>}
      </div>

      <div className="card budget-card">
        <p className="budget-line">
          <strong>{formatMoney(data.total)}</strong> spent of {formatMoney(data.budget)} budget
        </p>
        <div className="budget-track" role="img" aria-label={`${Math.round(percent)} percent of budget spent`}>
          <div className={`budget-fill${over ? ' over' : ''}`} style={{ width: `${percent}%` }} />
        </div>
        <p className={over ? 'error' : 'page-note'}>
          {over
            ? `${formatMoney(data.total - data.budget)} over budget`
            : `${formatMoney(data.budget - data.total)} left`}
        </p>
      </div>

      {adding && (
        <div className="stack section-gap">
          <ExpenseForm members={members} submitLabel="Add expense" onSubmit={addExpense} onCancel={() => setAdding(false)} />
        </div>
      )}

      {data.expenses.length === 0 && <p className="page-note">No expenses yet.</p>}
      <div className="stack section-gap">
        {data.expenses.map((expense) => (
          <ExpenseRow key={expense.id} expense={expense} members={members} onChanged={load} />
        ))}
      </div>
    </section>
  )
}
