import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalHeader,
  CRow,
} from '@coreui/react'
import userAPI from '../../../api/userAPI'
import { useMutation, useQuery } from '@tanstack/react-query'
import CIcon from '@coreui/icons-react'
import { cilSave } from '@coreui/icons'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import Swal from 'sweetalert2'
import ResponseError from '../../../components/ResponseError'
import reportAPI from '../../../api/reportAPI'

const EditReport = ({ id, visible, closeModal, token, refetch }) => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm()

  const { data: dataReport } = useQuery({
    queryKey: ['edit-report-by-id'],
    queryFn: () => reportAPI.getReportById({ token, id }),
    enabled: !!id,
  })

  const { mutate: updateReport } = useMutation({
    mutationFn: reportAPI.updateReport,
    onSuccess: () => {
      Swal.fire({
        title: 'Berhasil mengubah data laporan',
        icon: 'success',
      })
      refetch()
      closeModal()
    },
    onError: (error) => {
      ResponseError(error, dispatch, navigate)
    },
  })

  const save = () => {
    Swal.fire({
      title: 'Yakin data sudah benar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Tidak',
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = getValues()
        updateReport({ token, id, payload })
      }
    })
  }

  useEffect(() => {
    if (dataReport) {
      //   setValue('username', dataUser.username)
      //   setValue('company_name', dataUser.company_name)
      //   setValue('role', dataUser.role)
    }
  }, [dataReport])

  return (
    <CModal visible={visible} onClose={closeModal} backdrop={'static'} size="xl">
      <CModalHeader>Detail User</CModalHeader>
      <CForm onSubmit={handleSubmit(save)}>
        <CModalBody>
          <CRow>
            <CCol>
              <CFormLabel>Nama User</CFormLabel>
              <CFormInput {...register('username', { required: true })} />
              {errors.username && <span className="text-danger">Username tidak boleh kosong</span>}
            </CCol>
            <CCol>
              <CFormLabel>Nama Perusahaan</CFormLabel>
              <CFormInput {...register('company_name', { required: true })} />
              {errors.company_name && (
                <span className="text-danger">Nama perusahaan tidak boleh kosong</span>
              )}
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={12} sm={6}>
              <CFormLabel>Role</CFormLabel>
              <CFormSelect
                options={[
                  { label: 'USER', value: 'USER' },
                  { label: 'ADMIN', value: 'ADMIN' },
                ]}
                {...register('role', { required: true })}
              />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CButton color="success" className="text-white float-end" type="submit">
                <CIcon icon={cilSave} /> Simpan
              </CButton>
            </CCol>
          </CRow>
        </CModalBody>
      </CForm>
    </CModal>
  )
}

export default EditReport
