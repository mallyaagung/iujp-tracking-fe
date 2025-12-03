import { CPagination, CPaginationItem } from '@coreui/react'

const Pagination = ({ currentPage, pageCount, handleNext, handlePrev, handlePageJump }) => {
  return (
    <CPagination aria-label="Page navigation example" className="pagination onHover">
      {currentPage === 1 ? (
        <>
          {currentPage === 1 && pageCount === 1 ? (
            <>
              <CPaginationItem disabled={true}>{'First'}</CPaginationItem>
              <CPaginationItem disabled={true}>{'<'}</CPaginationItem>
              <CPaginationItem active={true}>{currentPage}</CPaginationItem>
              <CPaginationItem disabled={true}>{'>'}</CPaginationItem>
              <CPaginationItem disabled={true}>{'Last'}</CPaginationItem>
            </>
          ) : (
            <>
              <CPaginationItem disabled={true}>{'First'}</CPaginationItem>
              <CPaginationItem disabled={true}>{'<'}</CPaginationItem>
              <CPaginationItem active={true}>{currentPage}</CPaginationItem>
              {pageCount === currentPage + 1 ? (
                <>
                  <CPaginationItem onClick={handleNext}>{currentPage + 1}</CPaginationItem>
                  <CPaginationItem onClick={handleNext}>{'>'}</CPaginationItem>
                  <CPaginationItem onClick={() => handlePageJump(pageCount, type)}>
                    {'Last'}
                  </CPaginationItem>
                </>
              ) : (
                <>
                  <CPaginationItem onClick={handleNext}>{currentPage + 1}</CPaginationItem>
                  <CPaginationItem onClick={() => handleNext(currentPage + 1, type)}>
                    {currentPage + 2}
                  </CPaginationItem>
                  <CPaginationItem onClick={handleNext}>{'>'}</CPaginationItem>
                  <CPaginationItem onClick={() => handlePageJump(pageCount, type)}>
                    {'Last'}
                  </CPaginationItem>
                </>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <CPaginationItem onClick={() => handlePageJump(1, type)}>{'First'}</CPaginationItem>
          <CPaginationItem onClick={handlePrev}>{'<'}</CPaginationItem>
          <CPaginationItem onClick={handlePrev}>{currentPage - 1}</CPaginationItem>
          <CPaginationItem active={true}>{currentPage}</CPaginationItem>
          {currentPage !== pageCount ? (
            <>
              <CPaginationItem onClick={handleNext}>{currentPage + 1}</CPaginationItem>
              <CPaginationItem onClick={handleNext}>{'>'}</CPaginationItem>
              <CPaginationItem onClick={() => handlePageJump(pageCount, type)}>
                {'Last'}
              </CPaginationItem>
            </>
          ) : (
            <>
              <CPaginationItem disabled={true}>{'>'}</CPaginationItem>
              <CPaginationItem disabled={true}>{'Last'}</CPaginationItem>
            </>
          )}
        </>
      )}
    </CPagination>
  )
}

export default Pagination
