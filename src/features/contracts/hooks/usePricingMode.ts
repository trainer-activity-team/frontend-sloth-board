import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import { fetchPricingMode } from '../api'

export function usePricingMode(id: number) {
  return useQuery({
    queryKey: queryKeys.pricingModes.detail(id),
    queryFn: () => fetchPricingMode(id),
    enabled: id > 0,
  })
}
