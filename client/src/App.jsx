import { useEffect, useState } from 'react'

export default function App() {
  const [health, setHealth] = useState('checking...')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setHealth(`${data.status} (db: ${data.db})`))
      .catch(() => setHealth('unreachable'))
  }, [])

  return (
    <main>
      <h1>StudySync</h1>
      <p>API status: {health}</p>
    </main>
  )
}
