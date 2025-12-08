import axios from 'axios'

const reportAPI = {
  getAllReport: async ({ token, sort, sortType, pageSize, currentPage, id }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/report/all?id=${id}&sort=${sort}&sortType=${sortType}&pageSize=${pageSize}&currentPage=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      return { data: response.data.data, meta: response.data.meta }
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  getReportById: async ({ token, id }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/report/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      for (const item of response.data.data.files) {
        const uint8 = new Uint8Array(item.file_buffer.data)

        // Convert to Blob
        const blob = new Blob([uint8], { type: item.mime_type })

        // Create URL
        const blobUrl = URL.createObjectURL(blob)

        item.url = blobUrl
      }

      return response.data.data
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  getReportSubmission: async ({ token, year, quarter }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/report/dashboard?year=${year}&quarter=${quarter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      return response.data.data
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  updateReport: async ({ token, id, payload }) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_APP_API_URL}/report/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      return response.data.data
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  createReport: async ({ token, payload }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/report/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      return response.data.data
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  exportReport: async ({ token, payload, years, quarter }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/report/export`,
        payload,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      console.log(response)

      const outputFilename = `Export Data Tahun ${years} Triwulan ${quarter}.xlsx`

      // If you want to download file automatically using link attribute.
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      })

      const downloadUrl = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', outputFilename)
      document.body.appendChild(link)
      link.click()
      link.remove()

      return true
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  deleteReport: async ({ token, id }) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_APP_API_URL}/report/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data.data
    } catch (error) {
      console.log(error)
      throw error
    }
  },
}

export default reportAPI
