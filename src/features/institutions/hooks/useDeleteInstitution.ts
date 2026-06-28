import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { ApiError } from '../../../lib/api'
import { queryKeys } from '../../../lib/queryKeys'
import { ROUTES } from '../../../lib/routes'
import { deleteInstitution } from '../api'

export function useDeleteInstitution() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation('institutions')

  return useMutation({
    mutationFn: (id: number) => deleteInstitution(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.institutions.all })
      toast.success(t('toast.deleteSuccess'))
      void navigate(ROUTES.INSTITUTIONS)
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : t('errors.generic')
      toast.error(message)
    },
  })
}
