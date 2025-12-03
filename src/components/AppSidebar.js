import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CNavGroup,
  CNavItem,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import logo from '../assets/images/logo.png'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'
import { cilAccountLogout, cilDescription, cilPuzzle, cilSpeedometer, cilUser } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const sidebarShow = useSelector((state) => state.interface.sidebarShow)
  const role = useSelector((state) => state.user.role)

  const menu = [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      // badge: {
      //   color: 'info',
      //   text: 'NEW',
      // },
    },
    {
      component: CNavItem,
      name: 'Report',
      to: '/report',
      icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'User',
      to: '/user',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    },
  ]

  const handleLogOut = () => {
    Swal.fire({
      title: 'Yakin ingin keluar dari sistem?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Tidak',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch({ type: 'USER_LOGOUT' })
        navigate('/login')
        Swal.fire({
          title: 'Berhasil Keluar',
          icon: 'success',
        })
      }
    })
  }

  return (
    <CSidebar
      position="fixed"
      unfoldable={false}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="d-flex justify-content-between">
        <CSidebarBrand to="/">
          <img className="sidebar-brand-full" src={logo} />
        </CSidebarBrand>

        {/* <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} /> */}
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav
        items={role === 'ADMIN' ? menu : menu.filter((item) => item.name === 'Report')}
      />
      <div className="logout mb-5" onClick={handleLogOut}>
        <CIcon icon={cilAccountLogout} customClassName="nav-icon-logout" /> Log Out
      </div>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
