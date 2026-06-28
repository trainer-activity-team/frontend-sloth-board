import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { Loader } from '../components/ui/Loader'
import { useAuth } from '../features/auth/useAuth'
import { ProfileForm } from '../features/users/components/ProfileForm'
import { useUser } from '../features/users/hooks/useUser'
import { ROUTES } from '../lib/routes'

export function ProfilePage() {
  const { user: authUser } = useAuth()
  const { t } = useTranslation('profile')
  const userId = authUser?.userId ?? 0
  const { data, isPending, isError, error, refetch } = useUser(userId)

  if (!authUser) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (isPending) {
    return <Loader />
  }

  if (isError) {
    return (
      <ErrorMessage
        error={error}
        fallbackMessage={t('errors.loadFailed')}
        onRetry={() => void refetch()}
      />
    )
  }

  if (!data) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <ProfileForm user={data} />
}
