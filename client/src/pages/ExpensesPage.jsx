import { useParams } from 'react-router-dom'

export default function ExpensesPage() {
  const { tripId } = useParams()
  return (
    <section>
      <h1>Expenses</h1>
      <p>Expenses for trip {tripId} will show here.</p>
    </section>
  )
}
