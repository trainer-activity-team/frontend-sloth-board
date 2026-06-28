export interface Institution {
  id: number
  name: string
  address: string
  color: string
  requiresDeclaration: boolean
}

export interface CreateInstitutionRequest {
  name: string
  address: string
  color?: string
  requiresDeclaration?: boolean
}

export interface UpdateInstitutionRequest {
  name?: string
  address?: string
  color?: string
  requiresDeclaration?: boolean
}

export const DEFAULT_INSTITUTION_COLOR = '#3B82F6'
