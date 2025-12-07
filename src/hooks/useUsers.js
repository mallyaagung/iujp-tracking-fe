import { useMutation } from '@tanstack/react-query'
import userAPI from '../api/userAPI'
import ResponseError from '../components/ResponseError'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export const useGenerateUser = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: userAPI.generateUser,
    onSuccess: (response) => {
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = 'exported_passwords.xlsx' // filename
      a.click()

      window.URL.revokeObjectURL(url)
    },
    onError: (err) => {
      ResponseError(err, dispatch, navigate)
    },
  })
}
