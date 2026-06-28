import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import { fetchClasses } from '../api'

export function useClasses() {
  return useQuery({
    queryKey: queryKeys.classes.lists(),
    queryFn: fetchClasses,
  })
}
