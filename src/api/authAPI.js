import axios from 'axios'
import ResponseError from '../components/ResponseError'

const authAPI = {
  login: async (payload, dispatch, navigate) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/login`, payload)

      return response
    } catch (error) {
      ResponseError(error, dispatch, navigate)
      throw error
    }
  },
}

export default authAPI
