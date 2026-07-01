import { apiClient } from '../../lib/api'
import type { Session } from '../sessions/types'

export function fetchAgendaSessions(): Promise<Session[]> {
  return apiClient<Session[]>('/agenda/sessions')
}

export function fetchAgendaSessionsByDate(date: string): Promise<Session[]> {
  return apiClient<Session[]>(
    `/agenda/sessions/date?date=${encodeURIComponent(date)}`,
  )
}
