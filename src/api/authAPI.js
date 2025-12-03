import axios from 'axios'

const authAPI = {
  login: async (payload) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/login`, payload)

      return response
    } catch (error) {
      console.log(error)
      throw error
    }
  },
}

export default authAPI
