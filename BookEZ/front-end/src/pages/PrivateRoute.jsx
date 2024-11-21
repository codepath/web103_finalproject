import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if user is logged in
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login and save the current location in state
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
}

export default PrivateRoute;
