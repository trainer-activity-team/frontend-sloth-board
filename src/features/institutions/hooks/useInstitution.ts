import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import { fetchInstitution } from '../api'

export function useInstitution(id: number) {
  return useQuery({
    queryKey: queryKeys.institutions.detail(id),
    queryFn: () => fetchInstitution(id),
    enabled: id > 0,
  })
}
