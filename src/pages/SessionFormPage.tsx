import { Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { Loader } from '../components/ui/Loader'
import { SessionForm } from '../features/sessions/components/SessionForm'
import { useSession } from '../features/sessions/hooks/useSession'
import { ROUTES } from '../lib/routes'

function parseSessionId(rawId: string | undefined): number | null {
  if (!rawId) {
    return null
  }

  const id = Number.parseInt(rawId, 10)
  if (Number.isNaN(id) || id <= 0) {
    return null
  }

  return id
}

export function SessionFormPage() {
  const { id: rawId } = useParams<{ id: string }>()

  if (rawId === undefined) {
    return <SessionForm mode="create" />
  }

  const id = parseSessionId(rawId)

  if (id === null) {
    return <Navigate to={ROUTES.SESSIONS} replace />
  }

  return <SessionEditContent id={id} />
}

interface SessionEditContentProps {
  id: number
}

function SessionEditContent({ id }: SessionEditContentProps) {
  const { t } = useTranslation('sessions')
  const { data, isPending, isError, error, refetch } = useSession(id)

  if (isPending) {
    return <Loader />
  }

  if (isError) {
    return (
      <ErrorMessage
        error={error}
        fallbackMessage={t('errors.loadOneFailed')}
        onRetry={() => void refetch()}
      />
    )
  }

  if (!data) {
    return <Navigate to={ROUTES.SESSIONS} replace />
  }

  return <SessionForm mode="edit" session={data} />
}
