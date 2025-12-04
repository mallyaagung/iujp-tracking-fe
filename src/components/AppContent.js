import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import PrivateRoute from '../config/routes/PrivateRoute'

// routes config
import routes from '../routes'
import { useSelector } from 'react-redux'

const AppContent = () => {
  const role = useSelector((state) => state.user.role)
  return (
    <CContainer className="m-0 px-4" style={{ maxWidth: '100%' }}>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            const Component = route.element // ✅ take the component function

            return (
              <Route
                key={idx}
                path={route.path}
                element={
                  route.allowedUsers ? (
                    <PrivateRoute
                      element={Component} // 🔥 Pass as Component, not <Component />
                      allowedUsers={route.allowedUsers}
                    />
                  ) : (
                    <Component /> // 🔥 Correct way
                  )
                }
              />
            )
          })}

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
