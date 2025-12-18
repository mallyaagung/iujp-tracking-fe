import {
  CCol,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
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
import { useQuery } from '@tanstack/react-query'
import reportAPI from '../../../api/reportAPI'
import CurrencyDisplay from '../../../components/CurrencyDisplay'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { addCommas } from '../../../components/FormatRp'

const DetailReport = ({ id, visible, closeModal, token, year, quarter }) => {
  const columnWidths = [
    '100px', // No
    '260px', // Nama Site / Nama IUP
    '150px', // Jenis Izin
    '120px', // Provinsi
    '180px', // Kegiatan

    // Kontrak (3)
    '140px',
    '130px',
    '130px',

    // Investasi
    '140px',

    // Penerimaan (2)
    '120px',
    '120px',

    // Pembelanjaan (3)
    '120px',
    '120px',
    '120px',

    // Tenaga Kerja (4)
    '100px',
    '100px',
    '100px',
    '100px',

    // Penanggung Jawab Operasional (3)
    '200px',
    '140px',
    '140px',
  ]

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data: dataReport, isLoading: isLoadingReport } = useQuery({
    queryKey: ['report-by-id'],
    queryFn: async () => {
      try {
        return await reportAPI.getReportById({ token, id, dispatch, navigate, year, quarter })
      } catch (error) {
        ResponseError(error, dispatch, navigate)
      }
    },
    enabled: Boolean(id && year && quarter),
  })

  return (
    <CModal visible={visible} onClose={closeModal} fullscreen>
      <CModalHeader>Detail Report</CModalHeader>
      <CModalBody>
        <CRow className="mb-3">
          <CCol>
            <CFormLabel>Nama Perusahaan</CFormLabel>
            <CFormInput disabled value={dataReport?.[0]?.company_name ?? ''} />
          </CCol>
          <CCol md={3}>
            <CFormLabel>Triwulan</CFormLabel>
            <CFormInput disabled value={dataReport?.[0]?.quarter ?? ''} />
          </CCol>
          <CCol md={3}>
            <CFormLabel>Tahun</CFormLabel>
            <CFormInput disabled value={dataReport?.[0]?.year ?? ''} />
          </CCol>
        </CRow>

        <CRow>
          <CCol>
            <div className="table-wrapper">
              <CTable bordered striped className="report-table">
                <colgroup>
                  {columnWidths.map((width, index) => (
                    <col key={index} style={{ width }} />
                  ))}
                </colgroup>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell rowSpan={3}>No.</CTableHeaderCell>
                    <CTableHeaderCell rowSpan={3}>Nama Site/Nama IUP</CTableHeaderCell>
                    <CTableHeaderCell rowSpan={3}>Jenis Izin</CTableHeaderCell>
                    <CTableHeaderCell rowSpan={3}>Provinsi</CTableHeaderCell>
                    <CTableHeaderCell rowSpan={3}>Kegiatan</CTableHeaderCell>
                    <CTableHeaderCell colSpan={3}>Kontrak</CTableHeaderCell>
                    <CTableHeaderCell rowSpan={3}>Investasi</CTableHeaderCell>
                    <CTableHeaderCell colSpan={2}>Penerimaan</CTableHeaderCell>
                    <CTableHeaderCell colSpan={3}>Pembelanjaan</CTableHeaderCell>
                    <CTableHeaderCell colSpan={4}>Tenaga Kerja</CTableHeaderCell>
                    <CTableHeaderCell colSpan={3}>Penanggung Jawab Operasional</CTableHeaderCell>
                  </CTableRow>
                  <CTableRow>
                    {/* KONTRAK */}
                    <CTableHeaderCell rowSpan={2}>Tanggal Berakhir Kontrak</CTableHeaderCell>
                    <CTableHeaderCell rowSpan={2}>Nilai</CTableHeaderCell>
                    <CTableHeaderCell rowSpan={2}>Realisasi</CTableHeaderCell>
                    {/* PENERIMAAN */}
                    <CTableHeaderCell rowSpan={2}>Negara</CTableHeaderCell>
                    <CTableHeaderCell rowSpan={2}>Daerah</CTableHeaderCell>
                    {/* PEMBELANJAAN */}
                    <CTableHeaderCell rowSpan={2}>Lokal</CTableHeaderCell>
                    <CTableHeaderCell rowSpan={2}>Nasional</CTableHeaderCell>
                    <CTableHeaderCell rowSpan={2}>Impor</CTableHeaderCell>
                    {/* TENAGA KERJA */}
                    <CTableHeaderCell rowSpan={2}>Lokal</CTableHeaderCell>
                    <CTableHeaderCell rowSpan={2}>Nasional</CTableHeaderCell>
                    <CTableHeaderCell colSpan={2}>Asing</CTableHeaderCell>
                    {/* PENANGGUNG JAWAB OPERASIONAL */}
                    <CTableHeaderCell rowSpan={2}>Nama</CTableHeaderCell>
                    <CTableHeaderCell colSpan={2}>Surat Pengesahan</CTableHeaderCell>
                  </CTableRow>
                  <CTableRow>
                    {/* TENAGA KERJA */}
                    <CTableHeaderCell>Jabatan</CTableHeaderCell>
                    <CTableHeaderCell>Jumlah</CTableHeaderCell>
                    {/* PENANGGUNG JAWAB OPERASIONAL */}
                    <CTableHeaderCell>Nomor</CTableHeaderCell>
                    <CTableHeaderCell>Tanggal</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {dataReport?.length > 0 ? (
                    dataReport.map((item, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{item.site_name}</CTableDataCell>
                        <CTableDataCell>{item.permission || '-'}</CTableDataCell>
                        <CTableDataCell>{item.province || '-'}</CTableDataCell>
                        <CTableDataCell>{item.activity || '-'}</CTableDataCell>
                        <CTableDataCell>
                          {item.contract_time
                            ? moment(item.contract_time).format('DD-MM-YYYY')
                            : '-'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.contract_value > 0
                            ? `${item.contract_value_currency} ${addCommas(parseInt(item.contract_value))}`
                            : '-'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.contract_realization > 0
                            ? `${item.contract_realization_currency} ${addCommas(parseInt(item.contract_realization))}`
                            : '-'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.investation > 0
                            ? `${item.investation_currency} ${addCommas(parseInt(item.investation))}`
                            : '-'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.receive_nation > 0
                            ? `${item.receive_nation_currency} ${addCommas(parseInt(item.receive_nation))}`
                            : '-'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.receive_country > 0
                            ? `${item.receive_country_currency} ${addCommas(parseInt(item.receive_country))}`
                            : '-'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.expend_local > 0
                            ? `${item.expend_local_currency} ${addCommas(parseInt(item.expend_local))}`
                            : '-'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.expend_national > 0
                            ? `${item.expend_national_currency} ${addCommas(parseInt(item.expend_national))}`
                            : '-'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.expend_import > 0
                            ? `${item.expend_import_currency} ${addCommas(parseInt(item.expend_import))}`
                            : '-'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.workforce_local > 0 ? item.workforce_local : '-'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.workforce_national > 0 ? item.workforce_national : '-'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.workforce_foreign_role ? item.workforce_foreign_role : '-'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.workforce_foreign_qty > 0 ? item.workforce_foreign_qty : '-'}
                        </CTableDataCell>
                        <CTableDataCell>{item.pic ? item.pic : '-'}</CTableDataCell>
                        <CTableDataCell>
                          {item.pic_letter_no ? item.pic_letter_no : '-'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.pic_letter_date
                            ? moment(item.pic_letter_date).format('DD-MM-YYYY')
                            : '-'}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <></>
                  )}
                </CTableBody>
              </CTable>
            </div>
          </CCol>
        </CRow>

        <CRow className="d-flex align-items-center my-3">
          <CCol xs={5}>
            <hr />
          </CCol>
          <CCol xs={2} className="text-center fw-bold">
            Lampiran
          </CCol>
          <CCol xs={5}>
            <hr />
          </CCol>
        </CRow>

        <CRow>
          <CCol>
            <iframe
              src={dataReport?.[0]?.files[0].url}
              width="100%"
              height="800px"
              style={{ border: 'none' }}
            />
          </CCol>
        </CRow>
      </CModalBody>
    </CModal>
  )
}

export default DetailReport
