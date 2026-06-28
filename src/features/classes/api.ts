import { apiClient } from '../../lib/api'
import type {
  CreateClassRequest,
  SchoolClass,
  UpdateClassRequest,
} from './types'

export function fetchClasses(): Promise<SchoolClass[]> {
  return apiClient<SchoolClass[]>('/classes')
}

export function fetchClass(id: number): Promise<SchoolClass> {
  return apiClient<SchoolClass>(`/classes/${id}`)
}

export function createClass(data: CreateClassRequest): Promise<SchoolClass> {
  return apiClient<SchoolClass>('/classes', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateClass(
  id: number,
  data: UpdateClassRequest,
): Promise<SchoolClass> {
  return apiClient<SchoolClass>(`/classes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deleteClass(id: number): Promise<void> {
  return apiClient<void>(`/classes/${id}`, {
    method: 'DELETE',
  })
}
