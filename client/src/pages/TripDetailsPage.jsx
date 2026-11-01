import { useParams } from 'react-router-dom'

export default function TripDetailsPage() {
  const { tripId } = useParams()
  return (
    <section>
      <h1>Itinerary</h1>
      <p>Activities for trip {tripId} will show here.</p>
    </section>
  )
}
