import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormLabel,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CProgress,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import reportAPI from '../../api/reportAPI'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilDescription } from '@coreui/icons'
import Swal from 'sweetalert2'

const Dashboard = () => {
  const token = useSelector((state) => state.user.token)

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
  const [activeTab, setActiveTab] = useState(1)

  const {
    data: dataReport,
    refetch: refetchReportSubmission,
    isLoading: isLoadingReportSubmission,
  } = useQuery({
    queryKey: ['dashboard', filter],
    queryFn: () =>
      reportAPI.getReportSubmission({ token, year: filter.year, quarter: filter.quarter }),
  })

  const { mutate: exportReport } = useMutation({
    mutationFn: reportAPI.exportReport,
    onSuccess: (res) => {
      refetchReportSubmission()
    },
    onError: (error) => {
      ResponseError(error, dispatch, navigate)
    },
  })

  const progressExample = [
    {
      title: 'Sudah Lapor',
      value: dataReport?.submittedUsers,
      percent: (dataReport?.submittedUsers / dataReport?.totalUsers) * 100,
      color: 'success',
    },
    {
      title: 'Belum Lapor',
      value: dataReport?.notSubmittedUsers,
      percent: (dataReport?.notSubmittedUsers / dataReport?.totalUsers) * 100,
      color: 'danger',
    },
  ]

  const handleFilter = (e) => {
    const { name, value } = e.target

    setFilter({
      ...filter,
      [name]: value,
    })
  }

  const handleChangeTab = (e) => {
    if (e.target.id === 'active-1') {
      setActiveTab(1)
    } else {
      setActiveTab(2)
    }
  }

  return (
    <>
      <CCard className="my-3">
        <CCardHeader>Dashboard</CCardHeader>
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
            <CCol className="d-flex align-items-end">
              <CButton
                color="secondary"
                className="text-white"
                onClick={() =>
                  exportReport({
                    token,
                    payload:
                      activeTab === 1
                        ? { data: dataReport?.dataSubmit, status: true }
                        : { data: dataReport?.dataNotSubmit, status: false },
                    years: currentYear,
                    quarter: romanQuarter,
                  })
                }
              >
                <CIcon icon={cilDescription} /> Export data
              </CButton>
            </CCol>
          </CRow>
          <CRow className="mb-3 text-center">
            {progressExample.map((item, index, items) => (
              <CCol key={index}>
                <div className="text-body-secondary">{item.title}</div>
                <div className="fw-semibold text-truncate">
                  {item.value} ({item.percent}%)
                </div>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
          <CRow>
            <CCol>
              <CNav variant="pills" layout="justified">
                <CNavItem>
                  <CNavLink
                    id="active-1"
                    active={activeTab === 1}
                    onClick={(e) => handleChangeTab(e)}
                  >
                    Sudah Lapor
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    id="active-2"
                    active={activeTab === 2}
                    onClick={(e) => handleChangeTab(e)}
                  >
                    Belum Lapor
                  </CNavLink>
                </CNavItem>
              </CNav>
              {isLoadingReportSubmission ? (
                <div className="d-flex align-items-center gap-2 my-3">
                  <CSpinner /> <span>Loading...</span>
                </div>
              ) : activeTab === 1 ? (
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>No.</CTableHeaderCell>
                      <CTableHeaderCell>Nama User</CTableHeaderCell>
                      <CTableHeaderCell>Nama Perusahaan</CTableHeaderCell>
                      <CTableHeaderCell>Triwulan</CTableHeaderCell>
                      <CTableHeaderCell>Tahun</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {dataReport?.dataSubmit && dataReport.dataSubmit.length > 0 ? (
                      dataReport.dataSubmit.map((item, index) => (
                        <CTableRow key={item.report_id || index}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>{item.username}</CTableDataCell>
                          <CTableDataCell>{item.company_name}</CTableDataCell>
                          <CTableDataCell>{item.quarter}</CTableDataCell>
                          <CTableDataCell>{item.year}</CTableDataCell>
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
              ) : (
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>No.</CTableHeaderCell>
                      <CTableHeaderCell>Nama User</CTableHeaderCell>
                      <CTableHeaderCell>Nama Perusahaan</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {dataReport?.dataNotSubmit && dataReport.dataNotSubmit.length > 0 ? (
                      dataReport.dataNotSubmit.map((item, index) => (
                        <CTableRow key={item.report_id || index}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>{item.username}</CTableDataCell>
                          <CTableDataCell>{item.company_name}</CTableDataCell>
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
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
