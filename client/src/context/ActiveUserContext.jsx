import { createContext, useContext, useEffect, useState } from 'react'

// Matches server/db/seed.sql. Swap this for a GET /users call once the server has that route.
const DEMO_USERS = [
  { id: 1, name: 'Yingshu' },
  { id: 2, name: 'Yugant' },
  { id: 3, name: 'Arnold' },
]

const ActiveUserContext = createContext(null)

function readSavedUserId() {
  try {
    return Number(localStorage.getItem('activeUserId')) || DEMO_USERS[0].id
  } catch {
    return DEMO_USERS[0].id
  }
}

export function ActiveUserProvider({ children }) {
  const [activeUserId, setActiveUserId] = useState(readSavedUserId)

  useEffect(() => {
    try {
      localStorage.setItem('activeUserId', String(activeUserId))
    } catch {
      // Storage can be blocked in private windows. The selector still works for this visit.
    }
  }, [activeUserId])

  const activeUser = DEMO_USERS.find((user) => user.id === activeUserId) || DEMO_USERS[0]

  return (
    <ActiveUserContext.Provider value={{ users: DEMO_USERS, activeUser, setActiveUserId }}>
      {children}
    </ActiveUserContext.Provider>
  )
}

export function useActiveUser() {
  return useContext(ActiveUserContext)
}
