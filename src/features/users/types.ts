export interface Role {
  id: number
  name: string
}

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  roleId: number
  role: Role
}

export interface UpdateUserRequest {
  email?: string
  password?: string
  firstName?: string
  lastName?: string
}
