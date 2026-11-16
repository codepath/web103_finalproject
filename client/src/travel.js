export function tripLength(trip) {
  return Math.max(1, Math.round((Date.parse(trip.end_date) - Date.parse(trip.start_date)) / 86400000) + 1)
}

export function tripStatus(trip) {
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  if (trip.end_date < today) return 'Past trip'
  if (trip.start_date > today) return 'Upcoming'
  return 'In progress'
}
