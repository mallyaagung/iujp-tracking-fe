import axios from 'axios'

const userAPI = {
  getAllUser: async ({ token, sort, sortType, pageSize, currentPage }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/user/all?sort=${sort}&sortType=${sortType}&pageSize=${pageSize}&currentPage=${currentPage}`,
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

  getUserById: async ({ token, id }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/user/${id}`, {
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

  updateUser: async ({ token, id, payload }) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_APP_API_URL}/user/${id}`,
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

  createUser: async ({ token, payload }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/user/create`,
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

  deleteUser: async ({ token, id }) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_APP_API_URL}/user/${id}`, {
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

  generateUser: async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/user/import`, {
        responseType: 'arraybuffer', // IMPORTANT for Excel files
      })

      return response
    } catch (error) {
      throw error
    }
  },
}

export default userAPI
