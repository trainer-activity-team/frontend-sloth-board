import { Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { Loader } from '../components/ui/Loader'
import { ClassForm } from '../features/classes/components/ClassForm'
import { useClass } from '../features/classes/hooks/useClass'
import { ROUTES } from '../lib/routes'

function parseClassId(rawId: string | undefined): number | null {
  if (!rawId) {
    return null
  }

  const id = Number.parseInt(rawId, 10)
  if (Number.isNaN(id) || id <= 0) {
    return null
  }

  return id
}

export function ClassFormPage() {
  const { id: rawId } = useParams<{ id: string }>()

  if (rawId === undefined) {
    return <ClassForm mode="create" />
  }

  const id = parseClassId(rawId)

  if (id === null) {
    return <Navigate to={ROUTES.CLASSES} replace />
  }

  return <ClassEditContent id={id} />
}

interface ClassEditContentProps {
  id: number
}

function ClassEditContent({ id }: ClassEditContentProps) {
  const { t } = useTranslation('classes')
  const { data, isPending, isError, error, refetch } = useClass(id)

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
    return <Navigate to={ROUTES.CLASSES} replace />
  }

  return <ClassForm mode="edit" schoolClass={data} />
}
