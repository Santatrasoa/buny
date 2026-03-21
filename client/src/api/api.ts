import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err.response?.data?.error || err.message)
  }
)

export const productApi = {
  list:       (params = {}) => api.get('/api/products',         { params }).then(r => r.data),
  get:        (id: number)  => api.get(`/api/products/${id}`).then(r => r.data),
  create:     (data: object)=> api.post('/api/products', data).then(r => r.data),
  update:     (id: number, data: object) => api.put(`/api/products/${id}`, data).then(r => r.data),
  delete:     (id: number)  => api.delete(`/api/products/${id}`).then(r => r.data),
  stats:      ()            => api.get('/api/products/stats').then(r => r.data),
  categories: ()            => api.get('/api/products/categories').then(r => r.data),
}

export const userApi = {
  list:   (params = {}) => api.get('/api/users',       { params }).then(r => r.data),
  get:    (id: number)  => api.get(`/api/users/${id}`).then(r => r.data),
  create: (data: object)=> api.post('/api/users', data).then(r => r.data),
  update: (id: number, data: object) => api.put(`/api/users/${id}`, data).then(r => r.data),
  delete: (id: number)  => api.delete(`/api/users/${id}`).then(r => r.data),
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }).then(r => r.data),
  register: (data: object) =>
    api.post('/api/users', data).then(r => r.data),
}

export const dashboardApi = {
  stats: () => api.get('/api/dashboard').then(r => r.data),
}

export default api
