import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ApiError } from '../../../lib/api'
import { queryKeys } from '../../../lib/queryKeys'
import { ROUTES } from '../../../lib/routes'
import { updateSession } from '../api'
import type { UpdateSessionRequest } from '../types'

interface UpdateSessionVariables {
  id: number
  data: UpdateSessionRequest
}

export function useUpdateSession() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation('sessions')

  return useMutation({
    mutationFn: ({ id, data }: UpdateSessionVariables) => updateSession(id, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.sessions.detail(variables.id),
      })
      toast.success(t('toast.updateSuccess'))
      void navigate(ROUTES.SESSIONS)
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : t('errors.generic')
      toast.error(message)
    },
  })
}
