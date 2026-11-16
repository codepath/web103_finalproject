import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import TripForm from '../components/TripForm.jsx'
import { useFeedback } from '../context/useFeedback.js'

export default function CreateTripPage() {
  const navigate = useNavigate()
  const { notify } = useFeedback()

  async function createTrip(values) {
    const { id } = await api('/trips', { method: 'POST', body: values })
    notify('Trip created. Share the invite code to start planning together.')
    navigate(`/trips/${id}`)
  }

  return (
    <section className="form-page">
      <span className="eyebrow">A NEW CHAPTER</span>
      <h1>Start with a destination.</h1>
      <p className="page-note">Make a little plan. Invite your favorite people. See where it takes you.</p>
      <div className="card form-panel"><h2>The trip details</h2><p className="page-note">You’ll be the organizer, with an invite code to share.</p>
      <TripForm submitLabel="Create trip" onSubmit={createTrip} />
      </div>
    </section>
  )
}
