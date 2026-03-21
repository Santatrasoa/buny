export interface Product {
  id: number
  name: string
  price: number
  oldPrice?: number
  stock: number
  image?: string
  images?: string[]
  category: 'Baby' | 'Boys' | 'Girls' | 'Toys' | string
  description?: string
  active: boolean
  createdAt?: string
}

export interface CartItem {
  product: Product
  quantity: number
  size?: string
}

export interface User {
  id: number
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  roles: string[]
  active: boolean
  createdAt?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
