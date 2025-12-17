import { cibAddthis, cilMagnifyingGlass, cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
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
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import Pagination from '../../components/Pagination'
import { encode } from 'base-64'
import ResponseError from '../../components/ResponseError'
import Swal from 'sweetalert2'
import reportAPI from '../../api/reportAPI'
import AddReport from './reportComponent/AddReport'
import DetailReport from './reportComponent/DetailReport'
import EditReport from './reportComponent/EditReport'
import { useNavigate } from 'react-router-dom'
import moment from 'moment/moment'
import { useSearch } from '../../hooks/useSearch'

const Report = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
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

  const currentYear = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  const startYear = 2000

  const years = []
  for (let y = currentYear; y >= startYear; y--) {
    years.push({ label: y, value: y })
  }

  const quarter = Math.ceil(month / 3)
  let romanQuarter = ''
  if (quarter === 1) {
    romanQuarter = 'I'
  } else if (quarter === 2) {
    romanQuarter = 'II'
  } else if (quarter === 3) {
    romanQuarter = 'III'
  } else if (quarter === 4) {
    romanQuarter = 'IV'
  }

  const [filter, setFilter] = useState({
    year: currentYear,
    quarter: romanQuarter,
  })

  const [visible, setVisible] = useState({
    detail: false,
    add: false,
    edit: false,
  })
  const [reportId, setReportId] = useState('')
  const [search, setSearch] = useState('')
  const DebounceSearch = useSearch(search, 500)

  const {
    data: dataReport,
    refetch: refetchAllReport,
    isLoading: isLoadingAllReport,
  } = useQuery({
    queryKey: ['all-report', sorting, pagination, filter, DebounceSearch],
    queryFn: async () => {
      try {
        return await reportAPI.getAllReport({
          token,
          ...sorting,
          ...pagination,
          ...filter,
          id: encode(user_id),
          search: DebounceSearch,
        })
      } catch (error) {
        ResponseError(error, dispatch, navigate)
      }
    },
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
    onError: (err) => {
      ResponseError(err, dispatch, navigate)
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

  const handleFilter = (e) => {
    const { name, value } = e.target

    setFilter({
      ...filter,
      [name]: value,
    })
  }

  const handleSearch = (e) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }))
    setSearch(e.target.value)
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
        deleteReport({ token, id: encode(id), dispatch, navigate })
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
          <CRow className="mb-3">
            <CCol>
              <CFormLabel>Tahun</CFormLabel>
              <CFormSelect
                name="year"
                options={years}
                value={filter.year}
                onChange={(e) => handleFilter(e)}
              />
            </CCol>
            <CCol>
              <CFormLabel>Triwulan</CFormLabel>
              <CFormSelect
                name="quarter"
                options={[
                  { label: 'I', value: 'I' },
                  { label: 'II', value: 'II' },
                  { label: 'III', value: 'III' },
                  { label: 'IV', value: 'IV' },
                ]}
                value={filter.quarter}
                onChange={(e) => handleFilter(e)}
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Pencarian</CFormLabel>
              <CFormInput
                placeholder="Cari nama perusahaan"
                type="text"
                value={search}
                onChange={(e) => handleSearch(e)}
              />
            </CCol>
          </CRow>
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
                      <CTableHeaderCell>Nama Perusahaan</CTableHeaderCell>
                      <CTableHeaderCell>Jumlah Site</CTableHeaderCell>
                      <CTableHeaderCell>Aksi</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {dataReport?.data && dataReport.data.length > 0 ? (
                      dataReport.data.map((item, index) => (
                        <CTableRow key={item.report_id || index}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>{item.company_name}</CTableDataCell>
                          <CTableDataCell>{item.report_count} Site</CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex gap-1">
                              <CButton
                                color="info"
                                className="text-white"
                                size="sm"
                                onClick={() => handleShowDetail(item.users_id)}
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
                                onClick={() => handleDelete(item.reports_id)}
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
              {dataReport?.meta.pageCount > 0 && (
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
