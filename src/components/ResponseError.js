import Swal from 'sweetalert2'

const ResponseError = (err, dispatch, navigate, message = 'internal server error') => {
  if (err.response) {
    if (err.response.status === 401) {
      dispatch({ type: 'LOGOUT_USER' })
      navigate('/login')
      Swal.fire({
        title: 'Session Expired',
        icon: 'warning',
      })
    } else {
      Swal.fire({
        title: err.response?.data?.message || message,
        icon: 'error',
      })
    }
  } else if (err.request) {
    // The request was made but no response was received
    Swal.fire({
      title: 'Error Occured. Please Try Again Later!',
      icon: 'error',
    })
  } else {
    // Something happened in setting up the request that triggered an Error
    Swal.fire({
      title: 'Error Occured. Please Try Again Later!',
      icon: 'error',
    })
  }
}

export default ResponseError
