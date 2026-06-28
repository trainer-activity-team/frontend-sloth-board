export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface RegisterResponse {
  status: 'created'
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  userId: number
  fullName: string
  token: string
}

export interface AuthUser {
  userId: number
  fullName: string
  token: string
}
