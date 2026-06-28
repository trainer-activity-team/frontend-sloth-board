import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { ApiError } from '../../../lib/api'
import { queryKeys } from '../../../lib/queryKeys'
import { ROUTES } from '../../../lib/routes'
import { updateClass } from '../api'
import type { ClassFormValues } from '../schemas'

interface UpdateClassVariables {
  id: number
  data: ClassFormValues
}

export function useUpdateClass() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation('classes')

  return useMutation({
    mutationFn: ({ id, data }: UpdateClassVariables) => updateClass(id, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.classes.all })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.classes.detail(variables.id),
      })
      toast.success(t('toast.updateSuccess'))
      void navigate(ROUTES.CLASSES)
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : t('errors.generic')
      toast.error(message)
    },
  })
}
