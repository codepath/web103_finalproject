import Spinner from '../components/Spinner.jsx'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api, formatMoney } from '../api.js'
import { useActiveUser } from '../context/ActiveUserContext.jsx'
import ExpenseForm from '../components/ExpenseForm.jsx'
import ExpenseRow from '../components/ExpenseRow.jsx'
import { useFeedback } from '../context/useFeedback.js'
import Icon from '../components/Icon.jsx'

export default function ExpensesPage() {
  const { tripId } = useParams()
  const { activeUser } = useActiveUser()
  const { busy, notify } = useFeedback()
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
    notify('Expense added.')
    setAdding(false)
    await load()
  }

  if (error && !data) return <p className="error" role="alert">{error}</p>
  if (!data) return <Spinner label="Loading expenses…" />

  const over = data.total > data.budget
  const percent = data.budget > 0 ? Math.min(100, (data.total / data.budget) * 100) : data.total > 0 ? 100 : 0

  return (
    <section className="expenses-page">
      <div className="page-head">
        <div><span className="eyebrow">LESS MATH. MORE MEMORIES.</span><h1>Shared expenses</h1><p className="page-note">Keep the good times on budget.</p></div>
        {!adding && <button className="btn btn-primary" disabled={busy} onClick={() => setAdding(true)}><Icon name="plus" />Add expense</button>}
      </div>

      {error && <p className="error" role="alert">{error}</p>}

      <div className="expense-summary-grid">
        <div className="expense-summary summary-dark"><Icon name="wallet" /><span>Total spent</span><strong>{formatMoney(data.total)}</strong><small>{data.expenses.length} {data.expenses.length === 1 ? 'expense recorded' : 'expenses recorded'}</small></div>
        <div className={`expense-summary${over ? ' summary-over' : ''}`}><Icon name="compass" /><span>{over ? 'Over budget' : 'Still to enjoy'}</span><strong>{formatMoney(Math.abs(data.budget - data.total))}</strong><small>{over ? 'Time to review the plan' : 'Room for the next adventure'}</small></div>
        <div className="expense-summary summary-paper"><Icon name="map" /><span>Trip budget</span><strong>{formatMoney(data.budget)}</strong><small>Your shared spending plan</small></div>
      </div>
      <div className="card budget-card">
        <div className="budget-line"><strong>Budget overview</strong><span>{formatMoney(data.total)} of {formatMoney(data.budget)}</span></div>
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

      <div className="page-head expense-list-heading"><div><span className="eyebrow">THE LITTLE DETAILS</span><h2>Expense journal</h2></div><span className="collection-count">{data.expenses.length} {data.expenses.length === 1 ? 'entry' : 'entries'}</span></div>
      {data.expenses.length === 0 && <div className="empty-state"><Icon name="wallet" /><h3>A fresh start.</h3><p>No expenses yet. Record your first shared expense when you’re ready.</p></div>}
      <div className="stack expense-list">
        {data.expenses.map((expense) => (
          <ExpenseRow key={expense.id} expense={expense} members={members} onChanged={load} />
        ))}
      </div>
    </section>
  )
}
