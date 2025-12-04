import axios from 'axios'

const companyAPI = {
  getCompanyOptions: async ({ token }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/company/options`, {
        headers: {
          access_token: `Bearer ${token}`,
        },
      })

      const newData = response.data.data.map((item) => ({
        label: item.name,
        value: item.name,
      }))

      return newData
    } catch (error) {
      console.log(error)
      throw error
    }
  },
}

export default companyAPI
