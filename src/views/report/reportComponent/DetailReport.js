import { CCol, CFormInput, CFormLabel, CModal, CModalBody, CModalHeader, CRow } from '@coreui/react'
import { useQuery } from '@tanstack/react-query'
import reportAPI from '../../../api/reportAPI'

const DetailReport = ({ id, visible, closeModal, token }) => {
  const { data: dataReport, isLoading: isLoadingReport } = useQuery({
    queryKey: ['report-by-id'],
    queryFn: () => reportAPI.getReportById({ token, id }),
    enabled: !!id,
  })

  return (
    <CModal visible={visible} onClose={closeModal} size="lg">
      <CModalHeader>Detail User</CModalHeader>
      <CModalBody>
        <CRow>
          <CCol>
            <CFormLabel>Nama User</CFormLabel>
            <CFormInput disabled value={dataReport?.username} />
          </CCol>
          <CCol>
            <CFormLabel>Nama Perusahaan</CFormLabel>
            <CFormInput disabled value={dataReport?.company_name} />
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={12} sm={6}>
            <CFormLabel>Role</CFormLabel>
            <CFormInput disabled value={dataReport?.role} />
          </CCol>
        </CRow>
      </CModalBody>
    </CModal>
  )
}

export default DetailReport
