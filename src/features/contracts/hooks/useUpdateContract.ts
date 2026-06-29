import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { ApiError } from '../../../lib/api'
import { queryKeys } from '../../../lib/queryKeys'
import { ROUTES } from '../../../lib/routes'
import { updateContract } from '../api'
import type { ContractFormValues } from '../schemas'

interface UpdateContractVariables {
  id: number
  data: ContractFormValues
}

export function useUpdateContract() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation('contracts')

  return useMutation({
    mutationFn: ({ id, data }: UpdateContractVariables) => updateContract(id, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.contracts.all })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.contracts.detail(variables.id),
      })
      toast.success(t('toast.updateSuccess'))
      void navigate(ROUTES.CONTRACTS)
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : t('errors.generic')
      toast.error(message)
    },
  })
}
