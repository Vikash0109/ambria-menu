import axios from 'axios'
import { STAFF_TOKEN_KEY } from './utils.js'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 10000,
})

// Attach stored staff token to every request automatically
api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(STAFF_TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
