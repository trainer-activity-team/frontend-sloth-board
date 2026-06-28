import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import { fetchClass } from '../api'

export function useClass(id: number) {
  return useQuery({
    queryKey: queryKeys.classes.detail(id),
    queryFn: () => fetchClass(id),
    enabled: id > 0,
  })
}
