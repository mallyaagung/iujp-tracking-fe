import { cibAddthis, cilMagnifyingGlass, cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import userAPI from '../../api/userAPI'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import Pagination from '../../components/Pagination'
import DetailUser from './userComponent/DetailUser'
import { encode } from 'base-64'
import EditUser from './userComponent/EditUser'
import AddUser from './userComponent/AddUser'
import ResponseError from '../../components/ResponseError'
import Swal from 'sweetalert2'

const User = () => {
  const token = useSelector((state) => state.user.token)
  const user_id = useSelector((state) => state.user.users_id)

  const [pagination, setPagination] = useState({
    pageSize: 10,
    currentPage: 1,
  })
  const [sorting, setSorting] = useState({
    sort: 'company',
    sortType: 'asc',
  })

  const [visible, setVisible] = useState({
    detail: false,
    add: false,
    edit: false,
  })
  const [userId, setUserId] = useState('')

  const {
    data: dataUser,
    refetch: refetchAllUser,
    isLoading: isLoadingAllUser,
  } = useQuery({
    queryKey: ['all-user', sorting, pagination], // add dependencies!
    queryFn: () => userAPI.getAllUser({ token, ...sorting, ...pagination }),
  })

  const { mutate: deleteUser } = useMutation({
    mutationFn: userAPI.deleteUser,
    onSuccess: () => {
      Swal.fire({
        title: 'Berhasil menghapus data user',
        icon: 'success',
      })
      refetchAllUser()
    },
    onError: (error) => {
      ResponseError(error, dispatch, navigate)
    },
  })

  const handlePrev = () => {
    setPagination((prev) => ({
      ...prev,
      currentPage: prev.currentPage - 1,
    }))
  }

  const handleNext = () => {
    setPagination((prev) => ({
      ...prev,
      currentPage: prev.currentPage + 1,
    }))
  }

  const handlePageJump = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }))
  }

  const onChangeLimit = (e) => {
    setPagination(() => ({
      pageSize: e.target.value,
      currentPage: 1,
    }))
  }

  const handleShowDetail = (id) => {
    setUserId(encode(id))
    setVisible((prev) => ({ ...prev, detail: true }))
  }

  const handleCloseDetail = () => {
    setUserId('')
    setVisible((prev) => ({ ...prev, detail: false }))
  }

  const handleShowEdit = (id) => {
    setUserId(encode(id))
    setVisible((prev) => ({ ...prev, edit: true }))
  }

  const handleCloseEdit = () => {
    setUserId('')
    setVisible((prev) => ({ ...prev, edit: false }))
  }

  const handleShowAdd = (id) => {
    setVisible((prev) => ({ ...prev, add: true }))
  }

  const handleCloseAdd = () => {
    setVisible((prev) => ({ ...prev, add: false }))
  }

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Yakin ingin hapus data?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Tidak',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser({ token, id: encode(id) })
      }
    })
  }

  var numbering = pagination.currentPage * pagination.pageSize - (pagination.pageSize - 1)

  return (
    <>
      <DetailUser
        visible={visible?.detail}
        id={userId}
        closeModal={handleCloseDetail}
        token={token}
      />

      <EditUser
        visible={visible?.edit}
        id={userId}
        closeModal={handleCloseEdit}
        token={token}
        refetch={refetchAllUser}
      />
      <AddUser
        visible={visible?.add}
        closeModal={handleCloseAdd}
        token={token}
        refetch={refetchAllUser}
      />

      <CCard className="my-3">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>Daftar User</div>
          <div>
            <CButton color="success" className="text-white" onClick={handleShowAdd}>
              <CIcon icon={cibAddthis} /> Tambah User
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              {isLoadingAllUser ? (
                <div className="d-flex align-items-center gap-2 my-3">
                  <CSpinner /> <span>Loading...</span>
                </div>
              ) : (
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>No.</CTableHeaderCell>
                      <CTableHeaderCell>Username</CTableHeaderCell>
                      <CTableHeaderCell>Perusahaan</CTableHeaderCell>
                      <CTableHeaderCell>Role</CTableHeaderCell>
                      <CTableHeaderCell>Aksi</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {dataUser?.data && dataUser.data.length > 0 ? (
                      dataUser.data.map((item, index) => (
                        <CTableRow key={item.user_id || index}>
                          <CTableDataCell>{numbering++}</CTableDataCell>
                          <CTableDataCell>{item.username}</CTableDataCell>
                          <CTableDataCell>{item.company_name}</CTableDataCell>
                          <CTableDataCell>{item.role}</CTableDataCell>
                          <CTableDataCell>
                            {user_id !== item.users_id && (
                              <div className="d-flex gap-1">
                                <CButton
                                  color="info"
                                  className="text-white"
                                  size="sm"
                                  onClick={() => handleShowDetail(item.user_id)}
                                >
                                  <CIcon icon={cilMagnifyingGlass} />
                                </CButton>
                                <CButton
                                  color="warning"
                                  className="text-white"
                                  size="sm"
                                  onClick={() => handleShowEdit(item.user_id)}
                                >
                                  <CIcon icon={cilPencil} />
                                </CButton>
                                <CButton
                                  color="danger"
                                  className="text-white"
                                  size="sm"
                                  onClick={() => handleDelete(item.user_id)}
                                >
                                  <CIcon icon={cilTrash} />
                                </CButton>
                              </div>
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={4} className="text-center">
                          Data Kosong
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              )}
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              {dataUser?.meta && (
                <nav className="d-flex justify-content-between mt-5">
                  <div>
                    <label style={{ fontSize: 15 }}>
                      Show{' '}
                      <select
                        name="example_length"
                        aria-controls="example"
                        className=""
                        value={pagination.pageSize}
                        onChange={onChangeLimit}
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>{' '}
                      entries
                    </label>
                  </div>

                  <div className="col-btn float-lg-end">
                    <Pagination
                      currentPage={pagination.currentPage}
                      pageCount={dataUser?.meta.pageCount}
                      handleNext={handleNext}
                      handlePrev={handlePrev}
                      handlePageJump={handlePageJump}
                    />
                  </div>
                </nav>
              )}
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default User
