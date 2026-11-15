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
    <section>
      <h1>New trip</h1>
      <p className="page-note">You will be the organizer and get an invite code to share.</p>
      <TripForm submitLabel="Create trip" onSubmit={createTrip} />
    </section>
  )
}
