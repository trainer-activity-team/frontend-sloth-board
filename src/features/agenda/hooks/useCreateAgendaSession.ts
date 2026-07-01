import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { ApiError } from '../../../lib/api'
import { queryKeys } from '../../../lib/queryKeys'
import { createSession } from '../../sessions/api'
import type { CreateSessionRequest } from '../../sessions/types'

export function useCreateAgendaSession(onCreated?: () => void) {
  const queryClient = useQueryClient()
  const { t } = useTranslation('agenda')

  return useMutation({
    mutationFn: (data: CreateSessionRequest) => createSession(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.agenda.all })
      void queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all })
      toast.success(t('toast.createSuccess'))
      onCreated?.()
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : t('errors.generic')
      toast.error(message)
    },
  })
}
