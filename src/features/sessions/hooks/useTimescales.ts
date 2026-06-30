import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import { fetchTimescales } from '../api'

export function useTimescales() {
  return useQuery({
    queryKey: queryKeys.timescale.lists(),
    queryFn: fetchTimescales,
  })
}
