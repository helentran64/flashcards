import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_PATH}/api`,
})

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default api