import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { ApiError } from '../../../lib/api'
import { register as registerRequest } from '../api'
import type { RegisterFormValues } from '../schemas'

export function useRegister() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ confirmPassword: _, ...data }: RegisterFormValues) =>
      registerRequest(data),
    onSuccess: () => {
      toast.success(t('toast.registerSuccess'))
      void navigate('/login')
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : t('errors.generic')
      toast.error(message)
    },
  })
}
