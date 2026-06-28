import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import { fetchUsers } from '../api'

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.lists(),
    queryFn: fetchUsers,
  })
}
