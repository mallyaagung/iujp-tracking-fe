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
import { useSelector } from 'react-redux'
import { useState } from 'react'
import Pagination from '../../components/Pagination'
import { encode } from 'base-64'
import ResponseError from '../../components/ResponseError'
import Swal from 'sweetalert2'
import reportAPI from '../../api/reportAPI'
import AddReport from './reportComponent/AddReport'
import DetailReport from './reportComponent/DetailReport'
import EditReport from './reportComponent/EditReport'

const Report = () => {
  const token = useSelector((state) => state.user.token)
  const user_id = useSelector((state) => state.user.users_id)
  const role = useSelector((state) => state.user.role)

  const [pagination, setPagination] = useState({
    pageSize: 10,
    currentPage: 1,
  })
  const [sorting, setSorting] = useState({
    sort: 'createdAt',
    sortType: 'asc',
  })

  const [visible, setVisible] = useState({
    detail: false,
    add: false,
    edit: false,
  })
  const [reportId, setReportId] = useState('')

  const {
    data: dataReport,
    refetch: refetchAllReport,
    isLoading: isLoadingAllReport,
  } = useQuery({
    queryKey: ['all-report', sorting, pagination],
    queryFn: () =>
      reportAPI.getAllReport({ token, ...sorting, ...pagination, id: encode(user_id) }),
  })

  const { mutate: deleteReport } = useMutation({
    mutationFn: reportAPI.deleteReport,
    onSuccess: () => {
      Swal.fire({
        title: 'Berhasil menghapus laporan',
        icon: 'success',
      })
      refetchAllReport()
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
    setReportId(encode(id))
    setVisible((prev) => ({ ...prev, detail: true }))
  }

  const handleCloseDetail = () => {
    setReportId('')
    setVisible((prev) => ({ ...prev, detail: false }))
  }

  const handleShowEdit = (id) => {
    setReportId(encode(id))
    setVisible((prev) => ({ ...prev, edit: true }))
  }

  const handleCloseEdit = () => {
    setReportId('')
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
        deleteReport({ token, id: encode(id) })
      }
    })
  }

  return (
    <>
      <DetailReport
        visible={visible?.detail}
        id={reportId}
        closeModal={handleCloseDetail}
        token={token}
      />

      <EditReport
        visible={visible?.edit}
        id={reportId}
        closeModal={handleCloseEdit}
        token={token}
        refetch={refetchAllReport}
      />
      <AddReport
        visible={visible?.add}
        closeModal={handleCloseAdd}
        token={token}
        refetch={refetchAllReport}
      />

      <CCard className="my-3">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>Daftar Laporan</div>
          <div>
            <CButton color="success" className="text-white" onClick={handleShowAdd}>
              <CIcon icon={cibAddthis} /> Tambah Laporan
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              {isLoadingAllReport ? (
                <div className="d-flex align-items-center gap-2 my-3">
                  <CSpinner /> <span>Loading...</span>
                </div>
              ) : (
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>No.</CTableHeaderCell>
                      {role === 'ADMIN' && (
                        <>
                          <CTableHeaderCell>Nama User</CTableHeaderCell>
                        </>
                      )}
                      <CTableHeaderCell>Nama Site / IUP</CTableHeaderCell>
                      <CTableHeaderCell>Jenis Izin</CTableHeaderCell>
                      <CTableHeaderCell>Provinsi</CTableHeaderCell>
                      <CTableHeaderCell>Triwulan</CTableHeaderCell>
                      <CTableHeaderCell>Tahun</CTableHeaderCell>
                      <CTableHeaderCell>Aksi</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {dataReport?.data && dataReport.data.length > 0 ? (
                      dataReport.data.map((item, index) => (
                        <CTableRow key={item.report_id || index}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          {role === 'ADMIN' && (
                            <>
                              <CTableDataCell>{item.username}</CTableDataCell>
                            </>
                          )}
                          <CTableDataCell>{item.site_name}</CTableDataCell>
                          <CTableDataCell>{item.permission}</CTableDataCell>
                          <CTableDataCell>{item.province}</CTableDataCell>
                          <CTableDataCell>{item.quarter}</CTableDataCell>
                          <CTableDataCell>{item.year}</CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex gap-1">
                              <CButton
                                color="info"
                                className="text-white"
                                size="sm"
                                onClick={() => handleShowDetail(item.reports_id)}
                              >
                                <CIcon icon={cilMagnifyingGlass} />
                              </CButton>
                              {/* <CButton
                                color="warning"
                                className="text-white"
                                size="sm"
                                onClick={() => handleShowEdit(item.report_id)}
                              >
                                <CIcon icon={cilPencil} />
                              </CButton> */}
                              <CButton
                                color="danger"
                                className="text-white"
                                size="sm"
                                onClick={() => handleDelete(item.report_id)}
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={5} className="text-center">
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
              {dataReport?.meta && (
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
                      pageCount={dataReport?.meta.pageCount}
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

export default Report
