import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Report = React.lazy(() => import('./views/report/Report'))
const User = React.lazy(() => import('./views/user/User'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/report', name: 'Report', element: Report },
  { path: '/user', name: 'User', element: User },
]

export default routes
