import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import { fetchContracts } from '../api'

export function useContracts() {
  return useQuery({
    queryKey: queryKeys.contracts.lists(),
    queryFn: fetchContracts,
  })
}
