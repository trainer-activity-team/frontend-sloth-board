import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ApiError } from '../../../lib/api'
import { queryKeys } from '../../../lib/queryKeys'
import { ROUTES } from '../../../lib/routes'
import { createSession } from '../api'
import type { CreateSessionRequest } from '../types'

export function useCreateSession() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation('sessions')

  return useMutation({
    mutationFn: (data: CreateSessionRequest) => createSession(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all })
      toast.success(t('toast.createSuccess'))
      void navigate(ROUTES.SESSIONS)
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : t('errors.generic')
      toast.error(message)
    },
  })
}
