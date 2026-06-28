import { apiClient } from '../../lib/api'
import type {
  CreateInstitutionRequest,
  Institution,
  UpdateInstitutionRequest,
} from './types'

export function fetchInstitutions(): Promise<Institution[]> {
  return apiClient<Institution[]>('/institutions')
}

export function fetchInstitution(id: number): Promise<Institution> {
  return apiClient<Institution>(`/institutions/${id}`)
}

export function createInstitution(
  data: CreateInstitutionRequest,
): Promise<Institution> {
  return apiClient<Institution>('/institutions', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateInstitution(
  id: number,
  data: UpdateInstitutionRequest,
): Promise<Institution> {
  return apiClient<Institution>(`/institutions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deleteInstitution(id: number): Promise<void> {
  return apiClient<void>(`/institutions/${id}`, {
    method: 'DELETE',
  })
}
