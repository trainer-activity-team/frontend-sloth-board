import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { ApiError } from '../../../lib/api'
import { queryKeys } from '../../../lib/queryKeys'
import { ROUTES } from '../../../lib/routes'
import { updateInstitution } from '../api'
import type { InstitutionFormValues } from '../schemas'

interface UpdateInstitutionVariables {
  id: number
  data: InstitutionFormValues
}

export function useUpdateInstitution() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation('institutions')

  return useMutation({
    mutationFn: ({ id, data }: UpdateInstitutionVariables) =>
      updateInstitution(id, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.institutions.all })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.institutions.detail(variables.id),
      })
      toast.success(t('toast.updateSuccess'))
      void navigate(ROUTES.INSTITUTIONS)
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : t('errors.generic')
      toast.error(message)
    },
  })
}
