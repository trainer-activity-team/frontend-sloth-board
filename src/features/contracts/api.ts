import { apiClient } from '../../lib/api'
import type {
  Contract,
  CreateContractRequest,
  PricingMode,
  UpdateContractRequest,
} from './types'

export function fetchContracts(): Promise<Contract[]> {
  return apiClient<Contract[]>('/contracts')
}

export function fetchContract(id: number): Promise<Contract> {
  return apiClient<Contract>(`/contracts/${id}`)
}

export function createContract(data: CreateContractRequest): Promise<Contract> {
  return apiClient<Contract>('/contracts', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateContract(
  id: number,
  data: UpdateContractRequest,
): Promise<Contract> {
  return apiClient<Contract>(`/contracts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deleteContract(id: number): Promise<void> {
  return apiClient<void>(`/contracts/${id}`, {
    method: 'DELETE',
  })
}

export function fetchPricingModes(): Promise<PricingMode[]> {
  return apiClient<PricingMode[]>('/pricing-mode')
}

export function fetchPricingMode(id: number): Promise<PricingMode> {
  return apiClient<PricingMode>(`/pricing-mode/${id}`)
}
