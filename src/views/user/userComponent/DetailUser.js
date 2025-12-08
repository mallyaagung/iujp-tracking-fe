import { CCol, CFormInput, CFormLabel, CModal, CModalBody, CModalHeader, CRow } from '@coreui/react'
import userAPI from '../../../api/userAPI'
import { useQuery } from '@tanstack/react-query'

const DetailUser = ({ id, visible, closeModal, token }) => {
  const { data: dataUser, isLoading: isLoadingDataUser } = useQuery({
    queryKey: ['user-by-id'],
    queryFn: async () => {
      try {
        return await userAPI.getUserById({ token, id })
      } catch (error) {
        ResponseError(error, dispatch, navigate)
      }
    },
    enabled: !!id,
  })

  return (
    <CModal visible={visible} onClose={closeModal} size="xl">
      <CModalHeader>Detail User</CModalHeader>
      <CModalBody>
        <CRow>
          <CCol>
            <CFormLabel>Nama User</CFormLabel>
            <CFormInput disabled value={dataUser?.username} />
          </CCol>
          <CCol>
            <CFormLabel>Nama Perusahaan</CFormLabel>
            <CFormInput disabled value={dataUser?.company_name} />
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={12} sm={6}>
            <CFormLabel>Role</CFormLabel>
            <CFormInput disabled value={dataUser?.role} />
          </CCol>
        </CRow>
      </CModalBody>
    </CModal>
  )
}

export default DetailUser
