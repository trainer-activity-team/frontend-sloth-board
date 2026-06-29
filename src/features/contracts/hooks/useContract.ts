import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import { fetchContract } from '../api'

export function useContract(id: number) {
  return useQuery({
    queryKey: queryKeys.contracts.detail(id),
    queryFn: () => fetchContract(id),
    enabled: id > 0,
  })
}
