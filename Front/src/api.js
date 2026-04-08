import axios from "axios"

const getBaseUrl = () => {
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return "https://testiki-33ur.onrender.com"
  }
  return "http://localhost:8080"
}

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  timeout: 10000,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Ошибка аутентификации, требуется вход")
    }
    return Promise.reject(error)
  }
)

export default api
