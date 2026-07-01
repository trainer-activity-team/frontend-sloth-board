import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import { fetchAgendaSessions, fetchAgendaSessionsByDate } from '../api'

export function useAgendaSessions(date?: string) {
  const normalizedDate = date?.trim()

  return useQuery({
    queryKey: normalizedDate
      ? queryKeys.agenda.byDate(normalizedDate)
      : queryKeys.agenda.lists(),
    queryFn: () =>
      normalizedDate
        ? fetchAgendaSessionsByDate(normalizedDate)
        : fetchAgendaSessions(),
  })
}
