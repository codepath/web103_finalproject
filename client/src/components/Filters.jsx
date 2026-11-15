import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterBar from './FilterBar.jsx'

// Container for FilterBar: loads the activity types and keeps the filters in the URL,
// so Dashboard can read them. Lives in the site header on the home page.
function Filters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activityTypes, setActivityTypes] = useState([])

  useEffect(() => {
    // Filters still work by URL if the options fail to load
    fetch('/api/activity-types')
      .then((res) => (res.ok ? res.json() : []))
      .then(setActivityTypes)
      .catch(() => {})
  }, [])

  const setFilter = (name, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(name, value)
    else next.delete(name)
    setSearchParams(next)
  }

  return (
    <FilterBar
      values={Object.fromEntries(searchParams)}
      activityTypes={activityTypes}
      onChange={setFilter}
    />
  )
}

export default Filters
