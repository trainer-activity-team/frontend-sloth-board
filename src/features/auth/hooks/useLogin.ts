import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { ApiError } from '../../../lib/api'
import { ROUTES } from '../../../lib/routes'
import { login as loginRequest } from '../api'
import type { LoginFormValues } from '../schemas'
import { useAuth } from '../useAuth'

export function useLogin() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { login } = useAuth()

  return useMutation({
    mutationFn: (data: LoginFormValues) => loginRequest(data),
    onSuccess: (response) => {
      login({
        userId: response.userId,
        fullName: response.fullName,
        token: response.token,
      })
      toast.success(t('toast.loginSuccess'))
      void navigate(ROUTES.DASHBOARD)
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : t('errors.generic')
      toast.error(message)
    },
  })
}
