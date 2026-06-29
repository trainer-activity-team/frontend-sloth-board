import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { ApiError } from '../../../lib/api'
import { queryKeys } from '../../../lib/queryKeys'
import { ROUTES } from '../../../lib/routes'
import { deleteContract } from '../api'

export function useDeleteContract() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation('contracts')

  return useMutation({
    mutationFn: (id: number) => deleteContract(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.contracts.all })
      toast.success(t('toast.deleteSuccess'))
      void navigate(ROUTES.CONTRACTS)
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : t('errors.generic')
      toast.error(message)
    },
  })
}
