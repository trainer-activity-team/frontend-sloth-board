import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import { fetchPricingModes } from '../api'

export function usePricingModes() {
  return useQuery({
    queryKey: queryKeys.pricingModes.lists(),
    queryFn: fetchPricingModes,
  })
}
