import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useMutation } from '@tanstack/react-query'
import authAPI from '../../api/authAPI'
import { useDispatch } from 'react-redux'
import ResponseError from '../../components/ResponseError'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { mutate: login } = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      const newPayload = {
        ...response.data.data.user,
        token: response.data.data.token,
        isAuth: true,
      }

      dispatch({ type: 'USER_LOGIN', payload: newPayload })
      if (newPayload.role === 'ADMIN') {
        navigate('/dashboard')
      } else {
        navigate('/report')
      }
      Swal.fire({
        title: 'Berhasil Masuk',
        icon: 'success',
      })
    },
    onError: (error) => {
      ResponseError(error, dispatch, navigate)
    },
  })

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const handleLogin = () => {
    const payload = getValues()
    login(payload)
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCard className="p-4">
              <CCardBody>
                <CForm onSubmit={handleSubmit(handleLogin)}>
                  <h1>Login</h1>
                  <p className="text-body-secondary">Sign In to your account</p>
                  <div className="mb-3">
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        {...register('username', { required: true })}
                      />
                    </CInputGroup>
                    {errors.username && <span className="text-danger">This field is required</span>}
                  </div>
                  <div className="mb-4">
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        {...register('password', { required: true })}
                      />
                    </CInputGroup>
                    {errors.password && <span className="text-danger">This field is required</span>}
                  </div>
                  <CRow>
                    <CCol>
                      <CButton color="primary" className="px-4 w-100" type="submit">
                        Login
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
