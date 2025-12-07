import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormLabel } from '@coreui/react'
import { cilAccountLogout, cilLockLocked, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AppHeaderDropdown = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const company_name = useSelector((state) => state.user.company_name)

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
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CIcon style={{ color: 'white' }} icon={cilUser} />{' '}
        <CFormLabel style={{ color: 'white' }}>{company_name}</CFormLabel>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem href="#">
          <CIcon icon={cilLockLocked} className="me-2" />
          Ganti Password
        </CDropdownItem>
        <CDropdownItem href="#" onClick={handleLogOut}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Log out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
