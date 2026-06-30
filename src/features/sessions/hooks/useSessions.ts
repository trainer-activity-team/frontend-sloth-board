import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import { fetchSessions } from '../api'

export function useSessions() {
  return useQuery({
    queryKey: queryKeys.sessions.lists(),
    queryFn: fetchSessions,
  })
}
