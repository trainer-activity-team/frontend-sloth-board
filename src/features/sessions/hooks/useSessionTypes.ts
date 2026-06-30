import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import { fetchSessionTypes } from '../api'

export function useSessionTypes() {
  return useQuery({
    queryKey: queryKeys.sessionTypes.lists(),
    queryFn: fetchSessionTypes,
  })
}
