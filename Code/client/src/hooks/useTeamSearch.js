import { useState } from 'react'

// Search (#6, owned by rijulpoudel). State is real so the search input
// and group tabs are interactive, but filteredTeams is a pass-through —
// implement the real search + group filtering below without touching
// Discover.jsx's layout.
export function useTeamSearch(teams) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeGroup, setActiveGroup] = useState('All')

  // TODO(rijulpoudel): real search + group filtering
  const filteredTeams = teams

  return { searchTerm, setSearchTerm, activeGroup, setActiveGroup, filteredTeams }
}
