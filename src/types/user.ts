export interface User {
  id: string
  username: string
  email: string
  full_name: string
  phone?: string
  avatar_url?: string
  roles: string[]
  brand_id?: string
  store_id?: string
  status: 'active' | 'inactive' | 'pending'
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: User
}

export interface RegisterRequest {
  username: string
  password: string
  email: string
  full_name: string
  phone?: string
}
