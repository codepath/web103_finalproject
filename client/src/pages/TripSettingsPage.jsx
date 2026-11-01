import { useParams } from 'react-router-dom'

export default function TripSettingsPage() {
  const { tripId } = useParams()
  return (
    <section>
      <h1>Settings</h1>
      <p>Settings for trip {tripId} will show here.</p>
    </section>
  )
}
