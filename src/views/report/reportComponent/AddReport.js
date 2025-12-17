import React, { useState, useMemo, useRef } from 'react'
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CModal,
  CModalBody,
  CModalHeader,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import CIcon from '@coreui/icons-react'
import {
  cibAddthis,
  cilPencil,
  cilReportSlash,
  cilSave,
  cilTrash,
  cilWarning,
  cilXCircle,
} from '@coreui/icons'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import ResponseError from '../../../components/ResponseError'
import reportAPI from '../../../api/reportAPI'
import { useDispatch, useSelector } from 'react-redux'
import provinceAPI from '../../../api/provinceAPI'
import companyAPI from '../../../api/companyAPI'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

const AddReport = ({ visible, closeModal, token, refetch }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const users_id = useSelector((state) => state.user.users_id)
  const fileInputRef = useRef(null)

  // Local state
  const [dataPayload, setDataPayload] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)
  const [isCooperation, setIsCooperation] = useState(false)

  // years options memoized
  const currentYear = new Date().getFullYear()
  const startYear = 2000
  const years = useMemo(() => {
    const out = []
    for (let y = currentYear; y >= startYear; y--) out.push({ label: y, value: y })
    return out
  }, [currentYear])

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    resetField,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      users_id: users_id,
      year: '',
      quarter: '',
      // keep files default blank — we manage files via selectedFiles
      files: '',
      site_name: '',
      permission: '',
      province: '',
      activity: '',
      contract_time: '',
      contract_value: '',
      contract_value_currency: 'Rp',
      contract_realization: '',
      contract_realization_currency: 'Rp',
      investation: '',
      investation_currency: 'Rp',
      receive_nation: '',
      receive_nation_currency: 'Rp',
      receive_country: '',
      receive_country_currency: 'Rp',
      expend_local: '',
      expend_local_currency: 'Rp',
      expend_national: '',
      expend_national_currency: 'Rp',
      expend_import: '',
      expend_import_currency: 'Rp',
      workforce_local: '',
      workforce_national: '',
      workforce_foreign_role: '',
      workforce_foreign_qty: '',
      pic: '',
      pic_letter_no: '',
      pic_letter_date: '',
    },
  })

  const watchYear = watch('year')
  const watchQuarter = watch('quarter')
  const watchFile = watch('files')

  // load options
  const { data: provinceOptions = [] } = useQuery({
    queryKey: ['province-options'],
    queryFn: async () => {
      try {
        return await provinceAPI.getProvinceOptions({ token })
      } catch (error) {
        ResponseError(error, dispatch, navigate)
      }
    },
    enabled: !!visible,
  })

  const { data: companyOptions = [] } = useQuery({
    queryKey: ['company-options'],
    queryFn: async () => {
      try {
        return await companyAPI.getCompanyOptions({ token })
      } catch (error) {
        ResponseError(error, dispatch, navigate)
      }
    },
    enabled: !!visible,
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
      resetAll()
    },
    onError: (err) => {
      ResponseError(err, dispatch, navigate)
    },
  })

  // ----------- Helpers -----------
  const resetAll = () => {
    reset({
      users_id: users_id,
      year: watchYear,
      quarter: watchQuarter,
      files: watchFile,
      site_name: '',
      permission: '',
      province: '',
      activity: '',
      contract_time: '',
      contract_value: '',
      contract_value_currency: 'Rp',
      contract_realization: '',
      contract_realization_currency: 'Rp',
      investation: '',
      investation_currency: 'Rp',
      receive_nation: '',
      receive_nation_currency: 'Rp',
      receive_country: '',
      receive_country_currency: 'Rp',
      expend_local: '',
      expend_local_currency: 'Rp',
      expend_national: '',
      expend_national_currency: 'Rp',
      expend_import: '',
      expend_import_currency: 'Rp',
      workforce_local: '',
      workforce_national: '',
      workforce_foreign_role: '',
      workforce_foreign_qty: '',
      pic: '',
      pic_letter_no: '',
      pic_letter_date: '',
    })
    // setSelectedFiles([])
    setEditingIndex(null)

    // if (fileInputRef.current) fileInputRef.current.value = null
  }

  // Build payload item from current form values + selectedFiles (clone files)
  const buildPayloadItemFromForm = () => {
    const values = getValues()
    // Use selectedFiles if present; otherwise values.files can be used (but we prefer selectedFiles)
    const files = selectedFiles && selectedFiles.length > 0 ? [...selectedFiles] : []
    return {
      ...values,
      files,
    }
  }

  const handleNoCooperation = () => {
    setIsCooperation((prev) => {
      const next = !prev

      const current = getValues()

      reset(
        {
          users_id: current.users_id,
          year: current.year,
          quarter: current.quarter,

          files: null,
          site_name: next ? 'Tidak ada kerja sama' : null,
          permission: null,
          province: null,
          activity: null,
          contract_time: null,

          contract_value: 0,
          contract_value_currency: 'Rp',
          contract_realization: 0,
          contract_realization_currency: 'Rp',

          investation: 0,
          investation_currency: 'Rp',

          receive_nation: 0,
          receive_nation_currency: 'Rp',

          receive_country: 0,
          receive_country_currency: 'Rp',

          expend_local: 0,
          expend_local_currency: 'Rp',

          expend_national: 0,
          expend_national_currency: 'Rp',

          expend_import: 0,
          expend_import_currency: 'Rp',

          workforce_local: 0,
          workforce_national: 0,
          workforce_foreign_role: null,
          workforce_foreign_qty: 0,

          pic: null,
          pic_letter_no: null,
          pic_letter_date: null,
        },
        {
          keepErrors: true,
        },
      )

      return next
    })
  }

  // Add or update entry in payload
  const handleAddOrUpdatePayload = () => {
    const item = buildPayloadItemFromForm()

    if (editingIndex === null) {
      // add
      setDataPayload((prev) => [...prev, item])
    } else {
      // update existing index
      setDataPayload((prev) => {
        const next = [...prev]
        // preserve old files if user didn't choose new ones
        const oldFiles = next[editingIndex]?.files || []
        next[editingIndex] = {
          ...item,
          files: item.files.length > 0 ? item.files : oldFiles,
        }
        return next
      })
    }
    setIsCooperation(false)
    // clear form
    resetAll()
  }

  const handleEdit = (index) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const detail = dataPayload[index]

    Object.entries(detail).forEach(([key, value]) => {
      if (key === 'files') return
      setValue(key, value)
    })

    setSelectedFiles(detail.files ? [...detail.files] : [])
    setEditingIndex(index)
  }

  // Delete item
  const handleDelete = (index) => {
    Swal.fire({
      title: 'Hapus data ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Tidak',
    }).then((res) => {
      if (res.isConfirmed) {
        setDataPayload((prev) => prev.filter((_, i) => i !== index))
      }
    })
  }

  const onFileChange = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    setSelectedFiles(files)
    // keep RHF value too so getValues() has something (not required but harmless)
    setValue('files', e.target.files)
  }

  const onSubmit = () => {
    if (!dataPayload || dataPayload.length === 0) {
      Swal.fire({ title: 'Tambahkan minimal 1 data site', icon: 'warning' })
      return
    }

    Swal.fire({
      title: 'Yakin data sudah benar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Tidak',
    }).then((result) => {
      if (!result.isConfirmed) return

      const formData = new FormData()
      const payloadWithoutFiles = dataPayload.map((item) => {
        const tempId = uuidv4()
        const copy = { ...item }
        copy.temp_id = tempId
        copy.files = (copy.files || []).map((f) => ({ name: f.name, size: f.size, type: f.type }))
        return copy
      })
      formData.append('payload', JSON.stringify(payloadWithoutFiles))

      dataPayload.forEach((item, idx) => {
        const tempId = payloadWithoutFiles[idx].temp_id

        ;(item.files || []).forEach((file) => {
          formData.append(`files[${tempId}]`, file)
        })
      })

      // Finally call mutation
      createReport({ token, payload: formData, dispatch, navigate })
    })
  }

  // small helper to show file names for a payload item
  const renderFileNames = (files) => {
    if (!files || files.length === 0) return null
    return (
      <div style={{ fontSize: 12 }}>
        {files.map((f, i) => (
          <div key={i}>{f.name}</div>
        ))}
      </div>
    )
  }

  const handleClose = () => {
    closeModal()
    reset()
  }

  // ----------- JSX ----------
  return (
    <CModal
      className="custom-modal"
      visible={visible}
      onClose={handleClose}
      backdrop={'static'}
      fullscreen
    >
      <CModalHeader>Buat Laporan</CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          <CRow className="mb-3">
            <CCol md={4}>
              <CFormLabel>Tahun</CFormLabel>
              <CFormSelect
                options={years}
                {...register('year')}
                disabled={dataPayload?.length > 0}
              />
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
                disabled={dataPayload?.length > 0}
              />
            </CCol>
            <CCol md={4} className="mb-3">
              <CFormLabel>Lampiran (Hanya Pdf)</CFormLabel>
              <CFormInput
                type="file"
                ref={fileInputRef}
                accept=".pdf, .xls, .xlsx"
                onChange={onFileChange}
                multiple
                disabled={isCooperation || dataPayload?.length > 0}
              />
              {/* Show selected file(s) name(s) */}
              {editingIndex !== null && editingIndex !== undefined && selectedFiles.length > 0 && (
                <div style={{ fontSize: 12, marginTop: 6 }}>
                  {selectedFiles.map((f, i) => (
                    <div key={i}>File yang sudah terupload : {f.name}</div>
                  ))}
                </div>
              )}
            </CCol>
          </CRow>

          {/* ------ REPORT DETAILS ------ */}
          <div className="detail-section">
            <div className="section-title text-center">
              {editingIndex === null ? 'Tambah' : 'Edit'} Form Report
            </div>
            <hr />
            <CRow>
              {/* Row 1 */}
              <CCol className="mb-3">
                <CFormLabel>Nama Site / Nama IUP</CFormLabel>
                <CFormSelect
                  options={[{ value: '', label: '-' }, ...companyOptions]}
                  {...register('site_name')}
                  disabled={isCooperation}
                />
                <div className="d-flex align-items-center" style={{ fontSize: '10px' }}>
                  <CIcon
                    icon={cilWarning}
                    className="me-1 text-danger"
                    style={{ width: '10px', height: '10px' }}
                  />
                  <p className="text-danger m-0">
                    Apabila nama site/IUP tidak ada dalam sistem, silakan menghubungi +62
                    815-4236-1978
                  </p>
                </div>
              </CCol>

              <CCol className="mb-3">
                <CFormLabel>Jenis Izin</CFormLabel>
                <CFormSelect
                  options={[
                    { label: 'IUP', value: 'IUP' },
                    { label: 'IUPK', value: 'IUPK' },
                    { label: 'PKP2B', value: 'PKP2B' },
                    { label: 'KK', value: 'KK' },
                  ]}
                  {...register('permission')}
                  disabled={isCooperation}
                />
              </CCol>
            </CRow>

            <CRow>
              <CCol className="mb-3">
                <CFormLabel>Provinsi</CFormLabel>
                <CFormSelect
                  options={[{ value: '', label: '-' }, ...provinceOptions]}
                  {...register('province')}
                  disabled={isCooperation}
                />
              </CCol>

              <CCol className="mb-3">
                <CFormLabel>Kegiatan</CFormLabel>
                <CFormInput {...register('activity')} disabled={isCooperation} />
              </CCol>

              {/* Contract header */}
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
                <CFormLabel>Tanggal Berakhir Kontrak</CFormLabel>
                <CFormInput type="date" {...register('contract_time')} disabled={isCooperation} />
              </CCol>

              <CCol md={3} className="mb-3">
                <CFormLabel>Nilai Kontrak (Rp/USD)</CFormLabel>
                <CInputGroup>
                  <CFormSelect
                    options={[
                      { value: 'Rp', label: 'Rp' },
                      { value: 'USD', label: 'USD' },
                    ]}
                    {...register('contract_value_currency')}
                    disabled={isCooperation}
                    style={{
                      maxWidth: '90px',
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                  />
                  <CFormInput
                    type="number"
                    placeholder="Masukkan nilai"
                    {...register('contract_value')}
                    disabled={isCooperation}
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  />
                </CInputGroup>
              </CCol>

              <CCol md={3} className="mb-3">
                <CFormLabel>Realisasi (Rp/USD)</CFormLabel>
                <CInputGroup>
                  <CFormSelect
                    options={[
                      { value: 'Rp', label: 'Rp' },
                      { value: 'USD', label: 'USD' },
                    ]}
                    {...register('contract_realization_currency')}
                    disabled={isCooperation}
                    style={{
                      maxWidth: '90px',
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                  />
                  <CFormInput
                    type="number"
                    placeholder="Masukkan nilai"
                    {...register('contract_realization')}
                    disabled={isCooperation}
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  />
                </CInputGroup>
              </CCol>

              <CCol md={3} className="mb-3">
                <CFormLabel>Investasi (Rp/USD)</CFormLabel>
                <CInputGroup>
                  <CFormSelect
                    options={[
                      { value: 'Rp', label: 'Rp' },
                      { value: 'USD', label: 'USD' },
                    ]}
                    {...register('investation_currency')}
                    disabled={isCooperation}
                    style={{
                      maxWidth: '90px',
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                  />
                  <CFormInput
                    type="number"
                    placeholder="Masukkan nilai"
                    {...register('investation')}
                    disabled={isCooperation}
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  />
                </CInputGroup>
              </CCol>

              {/* Penerimaan header */}
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
                <CInputGroup>
                  <CFormSelect
                    options={[
                      { value: 'Rp', label: 'Rp' },
                      { value: 'USD', label: 'USD' },
                    ]}
                    {...register('receive_nation_currency')}
                    disabled={isCooperation}
                    style={{
                      maxWidth: '90px',
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                  />
                  <CFormInput
                    type="number"
                    placeholder="Masukkan nilai"
                    {...register('receive_nation')}
                    disabled={isCooperation}
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  />
                </CInputGroup>
              </CCol>

              <CCol md={6} className="mb-3">
                <CFormLabel>Penerimaan Daerah (Rp/USD)</CFormLabel>
                <CInputGroup>
                  <CFormSelect
                    options={[
                      { value: 'Rp', label: 'Rp' },
                      { value: 'USD', label: 'USD' },
                    ]}
                    {...register('receive_country_currency')}
                    disabled={isCooperation}
                    style={{
                      maxWidth: '90px',
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                  />
                  <CFormInput
                    type="number"
                    placeholder="Masukkan nilai"
                    {...register('receive_country')}
                    disabled={isCooperation}
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  />
                </CInputGroup>
              </CCol>

              {/* Pembelanjaan header */}
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
                <CInputGroup>
                  <CFormSelect
                    options={[
                      { value: 'Rp', label: 'Rp' },
                      { value: 'USD', label: 'USD' },
                    ]}
                    {...register('expend_local_currency')}
                    disabled={isCooperation}
                    style={{
                      maxWidth: '90px',
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                  />
                  <CFormInput
                    type="number"
                    placeholder="Masukkan nilai"
                    {...register('expend_local')}
                    disabled={isCooperation}
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  />
                </CInputGroup>
              </CCol>

              <CCol md={4} className="mb-3">
                <CFormLabel>Pembelanjaan Nasional (Rp/USD)</CFormLabel>
                <CInputGroup>
                  <CFormSelect
                    options={[
                      { value: 'Rp', label: 'Rp' },
                      { value: 'USD', label: 'USD' },
                    ]}
                    {...register('expend_national_currency')}
                    disabled={isCooperation}
                    style={{
                      maxWidth: '90px',
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                  />
                  <CFormInput
                    type="number"
                    placeholder="Masukkan nilai"
                    {...register('expend_national')}
                    disabled={isCooperation}
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  />
                </CInputGroup>
              </CCol>

              <CCol md={4} className="mb-3">
                <CFormLabel>Pembelanjaan Impor (Rp/USD)</CFormLabel>
                <CInputGroup>
                  <CFormSelect
                    options={[
                      { value: 'Rp', label: 'Rp' },
                      { value: 'USD', label: 'USD' },
                    ]}
                    {...register('expend_import_currency')}
                    disabled={isCooperation}
                    style={{
                      maxWidth: '90px',
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                  />
                  <CFormInput
                    type="number"
                    placeholder="Masukkan nilai"
                    {...register('expend_import')}
                    disabled={isCooperation}
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  />
                </CInputGroup>
              </CCol>

              {/* Tenaga Kerja header */}
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
                <CFormInput
                  type="number"
                  {...register('workforce_local')}
                  disabled={isCooperation}
                />
              </CCol>
              <CCol md={3} className="mb-3">
                <CFormLabel>Tenaga Kerja Nasional</CFormLabel>
                <CFormInput
                  type="number"
                  {...register('workforce_national')}
                  disabled={isCooperation}
                />
              </CCol>
              <CCol md={3} className="mb-3">
                <CFormLabel>Jabatan Tenaga Kerja Asing</CFormLabel>
                <CFormInput {...register('workforce_foreign_role')} disabled={isCooperation} />
              </CCol>
              <CCol md={3} className="mb-3">
                <CFormLabel>Jumlah Tenaga Kerja Asing</CFormLabel>
                <CFormInput
                  type="number"
                  {...register('workforce_foreign_qty')}
                  disabled={isCooperation}
                />
              </CCol>

              {/* Penanggung Jawab */}
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
                <CFormInput {...register('pic')} disabled={isCooperation} />
              </CCol>
              <CCol md={4} className="mb-3">
                <CFormLabel>Nomor Surat Pengesahan</CFormLabel>
                <CFormInput {...register('pic_letter_no')} disabled={isCooperation} />
              </CCol>
              <CCol md={4} className="mb-3">
                <CFormLabel>Tanggal Surat Pengesahan</CFormLabel>
                <CFormInput type="date" {...register('pic_letter_date')} disabled={isCooperation} />
              </CCol>
            </CRow>

            <CRow className="mt-3">
              <CCol>
                <CButton
                  color="danger"
                  className="text-white float-end w-100"
                  onClick={handleNoCooperation}
                >
                  <CIcon icon={isCooperation ? cilXCircle : cilReportSlash} />{' '}
                  {isCooperation ? 'Batal' : 'Tidak ada kerja sama'}
                </CButton>
              </CCol>
              <CCol>
                <CButton
                  color="info"
                  className="text-white float-end w-100"
                  onClick={handleAddOrUpdatePayload}
                >
                  <CIcon icon={cibAddthis} />{' '}
                  {editingIndex === null ? 'Tambah data' : 'Update data'}
                </CButton>
              </CCol>
            </CRow>
          </div>

          {/* Payload table */}
          <CRow className="d-flex align-items-center my-3">
            <CCol xs={5}>
              <hr />
            </CCol>
            <CCol xs={2} className="text-center fw-bold">
              Data Site
            </CCol>
            <CCol xs={5}>
              <hr />
            </CCol>
          </CRow>

          <CRow>
            <CCol>
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>No.</CTableHeaderCell>
                    <CTableHeaderCell>Tahun</CTableHeaderCell>
                    <CTableHeaderCell>Triwulan</CTableHeaderCell>
                    <CTableHeaderCell>Nama Site / IUP</CTableHeaderCell>
                    <CTableHeaderCell>Jenis Izin</CTableHeaderCell>
                    <CTableHeaderCell>Provinsi</CTableHeaderCell>
                    <CTableHeaderCell>Kegiatan</CTableHeaderCell>
                    <CTableHeaderCell>Tanggal Berakhir Kontrak</CTableHeaderCell>
                    <CTableHeaderCell>Aksi</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {dataPayload && dataPayload.length > 0 ? (
                    dataPayload.map((item, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{item.year}</CTableDataCell>
                        <CTableDataCell>{item.quarter}</CTableDataCell>
                        <CTableDataCell>{item.site_name}</CTableDataCell>
                        <CTableDataCell>{item.permission || '-'}</CTableDataCell>
                        <CTableDataCell>{item.province || '-'}</CTableDataCell>
                        <CTableDataCell>{item.activity || '-'}</CTableDataCell>
                        <CTableDataCell>{item.contract_time || '-'}</CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-1 align-items-center">
                            {item.permission && (
                              <CButton
                                color="warning"
                                className="text-white"
                                size="sm"
                                onClick={() => handleEdit(index)}
                              >
                                <CIcon icon={cilPencil} />
                              </CButton>
                            )}
                            <CButton
                              color="danger"
                              className="text-white"
                              size="sm"
                              onClick={() => handleDelete(index)}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={7} className="text-center">
                        Data Kosong
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCol>
          </CRow>

          <CRow className="mt-3">
            <CCol>
              <CButton color="success" className="text-white float-end" type="submit">
                <CIcon icon={cilSave} /> Simpan
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
    </CModal>
  )
}

export default AddReport
