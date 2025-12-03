import axios from 'axios'

const provinceAPI = {
  getProvinceOptions: async ({ token }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/province/options`, {
        headers: {
          access_token: `Bearer ${token}`,
        },
      })

      const newData = response.data.data.map((item) => ({
        label: item.name,
        value: item.name,
      }))

      return [{ label: '=== Pilih Provinsi ===', value: '' }, ...newData]
    } catch (error) {
      console.log(error)
      throw error
    }
  },
}

export default provinceAPI
