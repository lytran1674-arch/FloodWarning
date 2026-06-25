import axios from "axios"

export const axiosClient = axios.create({
  baseURL: "https://api-lulut.io.vn",
  headers: {
    "Content-Type": "application/json",
  },
})
axiosClient.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token")

  if (token) {
  const cleanToken = token.replace("Bearer ", "")

  config.headers.set(
    "Authorization",
    `Bearer ${cleanToken}`
  )
}

  return config
})