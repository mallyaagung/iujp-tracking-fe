import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const isAuth = useSelector((state) => state.user.isAuth)

  if (!isAuth) return <Navigate to="/login" replace />

  return children
}

export default PrivateRoute
