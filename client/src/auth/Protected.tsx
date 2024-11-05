import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

const Protected = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  if (!isAuthenticated) {
    // if not authenticated, redirect to the /auth page for login/signup
    return <Navigate to="/auth" replace />
  }

  // if authenticated, render the nested routes
  return <Outlet />
}

export default Protected