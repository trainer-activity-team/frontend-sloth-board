import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import { fetchInstitutions } from '../api'

export function useInstitutions() {
  return useQuery({
    queryKey: queryKeys.institutions.lists(),
    queryFn: fetchInstitutions,
  })
}
