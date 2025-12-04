import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const PrivateRoute = ({ element: Component, allowedUsers }) => {
  const role = useSelector((state) => state.user.role)

  if (!allowedUsers.includes(role)) {
    return <Navigate to={'/report'} replace />
  }

  return <Component />
}

export default PrivateRoute
