import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const PrivateRoute = ({ element: Component, allowedUsers }) => {
  const role = useSelector((state) => state.user.role)
  const isAuth = useSelector((state) => state.user.isAuth)

  if (isAuth) {
    if (!allowedUsers.includes(role)) {
      return <Navigate to={'/report'} replace />
    }
  } else {
    return <Navigate to={'/login'} replace />
  }

  return <Component />
}

export default PrivateRoute
