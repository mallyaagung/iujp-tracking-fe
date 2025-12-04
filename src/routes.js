import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Report = React.lazy(() => import('./views/report/Report'))
const User = React.lazy(() => import('./views/user/User'))

const routes = [
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, allowedUsers: ['ADMIN'] },
  { path: '/report', name: 'Report', element: Report, allowedUsers: ['ADMIN', 'USER'] },
  { path: '/user', name: 'User', element: User, allowedUsers: ['ADMIN'] },
]

export default routes
