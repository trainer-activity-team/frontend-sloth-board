import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import { fetchSession } from '../api'

export function useSession(id: number) {
  return useQuery({
    queryKey: queryKeys.sessions.detail(id),
    queryFn: () => fetchSession(id),
    enabled: id > 0,
  })
}
