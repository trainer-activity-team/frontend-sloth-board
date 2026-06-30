import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ApiError } from '../../../lib/api'
import { queryKeys } from '../../../lib/queryKeys'
import { ROUTES } from '../../../lib/routes'
import { deleteSession } from '../api'

export function useDeleteSession() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation('sessions')

  return useMutation({
    mutationFn: (id: number) => deleteSession(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all })
      toast.success(t('toast.deleteSuccess'))
      void navigate(ROUTES.SESSIONS)
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : t('errors.generic')
      toast.error(message)
    },
  })
}
