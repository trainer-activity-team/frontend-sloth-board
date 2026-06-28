import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { ApiError } from '../../../lib/api'
import { queryKeys } from '../../../lib/queryKeys'
import { ROUTES } from '../../../lib/routes'
import { createClass } from '../api'
import type { ClassFormValues } from '../schemas'

export function useCreateClass() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation('classes')

  return useMutation({
    mutationFn: (data: ClassFormValues) => createClass(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.classes.all })
      toast.success(t('toast.createSuccess'))
      void navigate(ROUTES.CLASSES)
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : t('errors.generic')
      toast.error(message)
    },
  })
}
