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
    <CModal visible={visible} onClose={closeModal} fullscreen>
      <CModalHeader>Detail User</CModalHeader>
      <CModalBody>
        <CRow className="mb-3">
          <CCol>
            <CFormLabel>Nama User</CFormLabel>
            <CFormInput disabled value={dataReport?.username} />
          </CCol>
          <CCol md={3}>
            <CFormLabel>Triwulan</CFormLabel>
            <CFormInput disabled value={dataReport?.quarter} />
          </CCol>
          <CCol md={3}>
            <CFormLabel>Tahun</CFormLabel>
            <CFormInput disabled value={dataReport?.year} />
          </CCol>
        </CRow>
        <CRow>
          <CCol md={4}>
            <CFormLabel>Nama Site / IUP</CFormLabel>
            <CFormInput disabled value={dataReport?.site_name} />
          </CCol>
          <CCol md={2}>
            <CFormLabel>Jenis Izin</CFormLabel>
            <CFormInput disabled value={dataReport?.permission} />
          </CCol>
          <CCol>
            <CFormLabel>Provinsi</CFormLabel>
            <CFormInput disabled value={dataReport?.province} />
          </CCol>
          <CCol>
            <CFormLabel>Kegiatan</CFormLabel>
            <CFormInput disabled value={dataReport?.activity} />
          </CCol>
        </CRow>

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

        <CRow>
          <CCol md={3} className="mb-3">
            <CFormLabel>Masa Kontrak</CFormLabel>
            <CFormInput disabled value={dataReport?.contract_time} />
          </CCol>
          <CCol md={3} className="mb-3">
            <CFormLabel>Nilai Kontrak (Rp/USD)</CFormLabel>
            <CFormInput type="number" disabled value={dataReport?.contract_value} />
          </CCol>
          <CCol md={3} className="mb-3">
            <CFormLabel>Realisasi (Rp/USD)</CFormLabel>
            <CFormInput type="number" disabled value={dataReport?.contract_realization} />
          </CCol>
          <CCol md={3} className="mb-3">
            <CFormLabel>Investasi (Rp/USD)</CFormLabel>
            <CFormInput type="number" disabled value={dataReport?.investation} />
          </CCol>
        </CRow>

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

        <CRow>
          <CCol md={6} className="mb-3">
            <CFormLabel>Penerimaan Negara (Rp/USD)</CFormLabel>
            <CFormInput type="number" disabled value={dataReport?.receive_nation} />
          </CCol>
          <CCol md={6} className="mb-3">
            <CFormLabel>Penerimaan Daerah (Rp/USD)</CFormLabel>
            <CFormInput type="number" disabled value={dataReport?.receive_country} />
          </CCol>
        </CRow>

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

        <CRow>
          <CCol md={4} className="mb-3">
            <CFormLabel>Pembelanjaan Lokal (Rp/USD)</CFormLabel>
            <CFormInput type="number" disabled value={dataReport?.expend_local} />
          </CCol>
          <CCol md={4} className="mb-3">
            <CFormLabel>Pembelanjaan Nasional (Rp/USD)</CFormLabel>
            <CFormInput type="number" disabled value={dataReport?.expend_national} />
          </CCol>
          <CCol md={4} className="mb-3">
            <CFormLabel>Pembelanjaan Impor (Rp/USD)</CFormLabel>
            <CFormInput type="number" disabled value={dataReport?.expend_import} />
          </CCol>
        </CRow>

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

        <CRow>
          <CCol md={3} className="mb-3">
            <CFormLabel>Tenaga Kerja Lokal</CFormLabel>
            <CFormInput type="number" disabled value={dataReport?.workforce_local} />
          </CCol>
          <CCol md={3} className="mb-3">
            <CFormLabel>Tenaga Kerja Nasional</CFormLabel>
            <CFormInput type="number" disabled value={dataReport?.workforce_national} />
          </CCol>
          <CCol md={3} className="mb-3">
            <CFormLabel>Jabatan Tenaga Kerja Asing</CFormLabel>
            <CFormInput disabled value={dataReport?.workforce_foreign_role} />
          </CCol>
          <CCol md={3} className="mb-3">
            <CFormLabel>Jumlah Tenaga Kerja Asing</CFormLabel>
            <CFormInput type="number" disabled value={dataReport?.workforce_foreign_qty} />
          </CCol>
        </CRow>

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

        <CRow>
          <CCol md={4} className="mb-3">
            <CFormLabel>Nama</CFormLabel>
            <CFormInput disabled value={dataReport?.pic} />
          </CCol>
          <CCol md={4} className="mb-3">
            <CFormLabel>Nomor Surat Pengesahan</CFormLabel>
            <CFormInput disabled value={dataReport?.pic_letter_no} />
          </CCol>
          <CCol md={4} className="mb-3">
            <CFormLabel>Tanggal Surat Pengesahan</CFormLabel>
            <CFormInput disabled value={dataReport?.pic_letter_date} />
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

        {dataReport?.files.length > 0 &&
          dataReport?.files.map((item) => (
            <CRow>
              <CCol>
                <iframe src={item.url} width="100%" height="800px" style={{ border: 'none' }} />
              </CCol>
            </CRow>
          ))}
      </CModalBody>
    </CModal>
  )
}

export default DetailReport
