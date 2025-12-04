import { CFormInput, CInputGroup, CInputGroupText } from '@coreui/react'

const CurrencyDisplay = ({ value, currency }) => {
  return (
    <CInputGroup>
      {currency === 'Rp' && <CInputGroupText>Rp</CInputGroupText>}

      <CFormInput type="number" disabled value={value} />

      {currency === 'USD' && <CInputGroupText>USD</CInputGroupText>}
    </CInputGroup>
  )
}

export default CurrencyDisplay
