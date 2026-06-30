import { apiClient } from '../../lib/api'
import type {
  CreateSessionRequest,
  Session,
  SessionType,
  Timescale,
  UpdateSessionRequest,
} from './types'

export function fetchSessions(): Promise<Session[]> {
  return apiClient<Session[]>('/sessions')
}

export function fetchSession(id: number): Promise<Session> {
  return apiClient<Session>(`/sessions/${id}`)
}

export function createSession(data: CreateSessionRequest): Promise<Session> {
  return apiClient<Session>('/sessions', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateSession(
  id: number,
  data: UpdateSessionRequest,
): Promise<Session> {
  return apiClient<Session>(`/sessions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deleteSession(id: number): Promise<void> {
  return apiClient<void>(`/sessions/${id}`, {
    method: 'DELETE',
  })
}

export function fetchSessionTypes(): Promise<SessionType[]> {
  return apiClient<SessionType[]>('/sessions-types')
}

export function fetchSessionType(id: number): Promise<SessionType> {
  return apiClient<SessionType>(`/sessions-types/${id}`)
}

export function fetchTimescales(): Promise<Timescale[]> {
  return apiClient<Timescale[]>('/timescale')
}

export function fetchTimescale(id: number): Promise<Timescale> {
  return apiClient<Timescale>(`/timescale/${id}`)
}
