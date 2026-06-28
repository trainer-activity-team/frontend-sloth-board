import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { ApiError } from '../../../lib/api'
import { queryKeys } from '../../../lib/queryKeys'
import { useAuth } from '../../auth/useAuth'
import { updateUser } from '../api'
import type { ProfileFormValues } from '../schemas'
import type { UpdateUserRequest } from '../types'

interface UpdateUserVariables {
  id: number
  data: ProfileFormValues
}

function toUpdateRequest(data: ProfileFormValues): UpdateUserRequest {
  const request: UpdateUserRequest = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
  }

  if (data.password.trim() !== '') {
    request.password = data.password
  }

  return request
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  const { user: authUser, login } = useAuth()
  const { t } = useTranslation('profile')

  return useMutation({
    mutationFn: ({ id, data }: UpdateUserVariables) =>
      updateUser(id, toUpdateRequest(data)),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(updated.id),
      })

      if (authUser) {
        login({
          userId: updated.id,
          fullName: `${updated.firstName} ${updated.lastName}`,
          token: authUser.token,
        })
      }

      toast.success(t('toast.updateSuccess'))
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : t('errors.generic')
      toast.error(message)
    },
  })
}
