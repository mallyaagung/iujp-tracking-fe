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
import { useMutation } from '@tanstack/react-query'
import CIcon from '@coreui/icons-react'
import { cilSave } from '@coreui/icons'
import { useFieldArray, useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import ResponseError from '../../../components/ResponseError'
import reportAPI from '../../../api/reportAPI'
import { useSelector } from 'react-redux'

const AddReport = ({ visible, closeModal, token, refetch }) => {
  const users_id = useSelector((state) => state.user.users_id)

  const currentYear = new Date().getFullYear()
  const startYear = 2000

  const years = []
  for (let y = currentYear; y >= startYear; y--) {
    years.push({ label: y, value: y })
  }

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      users_id: users_id,
      year: '',
      quarter: '',
      site_name: '',
      permission: '',
      province: '',
      activity: '',
      contract_time: '',
      contract_value: '',
      contract_realization: '',
      investation: '',
      receive_nation: '',
      receive_country: '',
      expend_local: '',
      expend_national: '',
      expend_import: '',
      workforce_local: '',
      workforce_national: '',
      workforce_foreign_role: '',
      workforce_foreign_qty: '',
      pic: '',
      pic_letter_no: '',
      pic_letter_date: '',
    },
  })

  const { mutate: createReport } = useMutation({
    mutationFn: reportAPI.createReport,
    onSuccess: () => {
      Swal.fire({
        title: 'Berhasil membuat laporan',
        icon: 'success',
      })
      refetch()
      closeModal()
      reset()
    },
    onError: (error) => {
      ResponseError(error, dispatch, navigate)
    },
  })

  const onSubmit = () => {
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
        const data = getValues()

        const formData = new FormData()

        Object.keys(data).forEach((key) => {
          formData.append(key, data[key])
        })

        // 🚀 Append multiple files
        for (let i = 0; i < data.files.length; i++) {
          formData.append('files', data.files[i]) // same key name "files"
        }

        createReport({ token, payload: formData })
      }
    })
  }

  return (
    <CModal
      className="custom-modal"
      visible={visible}
      onClose={closeModal}
      backdrop={'static'}
      fullscreen
    >
      <CModalHeader>Buat Laporan</CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          <CRow className="mb-3">
            <CCol md={4}>
              <CFormLabel>Tahun</CFormLabel>
              <CFormSelect options={years} {...register('year', { required: true })} />
              {errors.year && <span className="text-danger">Isi tahun terlebih dahulu</span>}
            </CCol>
            <CCol md={4}>
              <CFormLabel>Triwulan</CFormLabel>
              <CFormSelect
                options={[
                  { label: 'I', value: 'I' },
                  { label: 'II', value: 'II' },
                  { label: 'III', value: 'III' },
                  { label: 'IV', value: 'IV' },
                ]}
                {...register('quarter')}
              />
            </CCol>
            <CCol md={4} className="mb-3">
              <CFormLabel>Lampiran (Pdf / Excel)</CFormLabel>
              <CFormInput type="file" multiple accept=".pdf, .xls, .xlsx" {...register('files')} />
            </CCol>
          </CRow>
          {/* ------ REPORT DETAILS ------ */}
          <div className="detail-section">
            <div className="section-title text-center">Report Detail</div>
            <hr />
            <CRow>
              {/* Row 1 */}
              <CCol md={3} className="mb-3">
                <CFormLabel>Nama Site / Nama IUP</CFormLabel>
                <CFormInput {...register(`site_name`)} required />
              </CCol>
              <CCol md={3} className="mb-3">
                <CFormLabel>Jenis Izin</CFormLabel>
                <CFormSelect
                  options={[
                    { label: 'IUP', value: 'IUP' },
                    { label: 'IUPK', value: 'IUPK' },
                    { label: 'PKP2B', value: 'PKP2B' },
                    { label: 'KK', value: 'KK' },
                  ]}
                  {...register(`permission`)}
                />
              </CCol>
              <CCol md={3} className="mb-3">
                <CFormLabel>Provinsi</CFormLabel>
                <CFormInput {...register(`province`)} />
              </CCol>
              <CCol md={3} className="mb-3">
                <CFormLabel>Kegiatan</CFormLabel>
                <CFormInput {...register(`activity`)} />
              </CCol>
              <CRow className="d-flex align-items-center my-3">
                <CCol xs={5}>
                  <hr />
                </CCol>
                <CCol xs={2} className="text-center fw-bold">
                  Kontrak
                </CCol>
                <CCol xs={5}>
                  <hr />
                </CCol>
              </CRow>
              {/* Row 2 */}
              <CCol md={3} className="mb-3">
                <CFormLabel>Masa Kontrak</CFormLabel>
                <CFormInput {...register(`contract_time`)} />
              </CCol>
              <CCol md={3} className="mb-3">
                <CFormLabel>Nilai Kontrak (Rp/USD)</CFormLabel>
                <CFormInput type="number" {...register(`contract_value`)} />
              </CCol>
              <CCol md={3} className="mb-3">
                <CFormLabel>Realisasi (Rp/USD)</CFormLabel>
                <CFormInput type="number" {...register(`contract_realization`)} />
              </CCol>
              <CCol md={3} className="mb-3">
                <CFormLabel>Investasi (Rp/USD)</CFormLabel>
                <CFormInput type="number" {...register(`investation`)} />
              </CCol>
              <CRow className="d-flex align-items-center my-3">
                <CCol xs={5}>
                  <hr />
                </CCol>
                <CCol xs={2} className="text-center fw-bold">
                  Penerimaan
                </CCol>
                <CCol xs={5}>
                  <hr />
                </CCol>
              </CRow>
              {/* Row 3 */}
              <CCol md={6} className="mb-3">
                <CFormLabel>Penerimaan Negara (Rp/USD)</CFormLabel>
                <CFormInput type="number" {...register(`receive_nation`)} />
              </CCol>
              <CCol md={6} className="mb-3">
                <CFormLabel>Penerimaan Daerah (Rp/USD)</CFormLabel>
                <CFormInput type="number" {...register(`receive_country`)} />
              </CCol>
              <CRow className="d-flex align-items-center my-3">
                <CCol xs={5}>
                  <hr />
                </CCol>
                <CCol xs={2} className="text-center fw-bold">
                  Pembelanjaan
                </CCol>
                <CCol xs={5}>
                  <hr />
                </CCol>
              </CRow>
              {/* Row 4 */}
              <CCol md={4} className="mb-3">
                <CFormLabel>Pembelanjaan Lokal (Rp/USD)</CFormLabel>
                <CFormInput type="number" {...register(`expend_local`)} />
              </CCol>
              <CCol md={4} className="mb-3">
                <CFormLabel>Pembelanjaan Nasional (Rp/USD)</CFormLabel>
                <CFormInput type="number" {...register(`expend_national`)} />
              </CCol>
              <CCol md={4} className="mb-3">
                <CFormLabel>Pembelanjaan Impor (Rp/USD)</CFormLabel>
                <CFormInput type="number" {...register(`expend_import`)} />
              </CCol>
              <CRow className="d-flex align-items-center my-3">
                <CCol xs={5}>
                  <hr />
                </CCol>
                <CCol xs={2} className="text-center fw-bold">
                  Tenaga Kerja
                </CCol>
                <CCol xs={5}>
                  <hr />
                </CCol>
              </CRow>
              {/* Row 5 */}
              <CCol md={3} className="mb-3">
                <CFormLabel>Tenaga Kerja Lokal</CFormLabel>
                <CFormInput type="number" {...register(`workforce_local`)} />
              </CCol>
              <CCol md={3} className="mb-3">
                <CFormLabel>Tenaga Kerja Nasional</CFormLabel>
                <CFormInput type="number" {...register(`workforce_national`)} />
              </CCol>
              <CCol md={3} className="mb-3">
                <CFormLabel>Jabatan Tenaga Kerja Asing</CFormLabel>
                <CFormInput {...register(`workforce_foreign_role`)} />
              </CCol>
              <CCol md={3} className="mb-3">
                <CFormLabel>Jumlah Tenaga Kerja Asing</CFormLabel>
                <CFormInput type="number" {...register(`workforce_foreign_qty`)} />
              </CCol>
              <CRow className="d-flex align-items-center my-3">
                <CCol xs={5}>
                  <hr />
                </CCol>
                <CCol xs={2} className="text-center fw-bold">
                  Penanggung Jawab Operasional
                </CCol>
                <CCol xs={5}>
                  <hr />
                </CCol>
              </CRow>
              {/* Row 6 */}
              <CCol md={4} className="mb-3">
                <CFormLabel>Nama</CFormLabel>
                <CFormInput {...register(`pic`)} />
              </CCol>
              <CCol md={4} className="mb-3">
                <CFormLabel>Nomor Surat Pengesahan</CFormLabel>
                <CFormInput {...register(`pic_letter_no`)} />
              </CCol>
              <CCol md={4} className="mb-3">
                <CFormLabel>Tanggal Surat Pengesahan</CFormLabel>
                <CFormInput type="date" {...register(`pic_letter_date`)} />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol>
                <CButton color="success" className="text-white float-end" type="submit">
                  <CIcon icon={cilSave} /> Simpan
                </CButton>
              </CCol>
            </CRow>
          </div>
        </CForm>
      </CModalBody>
    </CModal>
  )
}

export default AddReport
