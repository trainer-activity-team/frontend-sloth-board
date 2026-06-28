import { Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { Loader } from '../components/ui/Loader'
import { InstitutionForm } from '../features/institutions/components/InstitutionForm'
import { useInstitution } from '../features/institutions/hooks/useInstitution'
import { ROUTES } from '../lib/routes'

function parseInstitutionId(rawId: string | undefined): number | null {
  if (!rawId) {
    return null
  }

  const id = Number.parseInt(rawId, 10)
  if (Number.isNaN(id) || id <= 0) {
    return null
  }

  return id
}

export function InstitutionFormPage() {
  const { id: rawId } = useParams<{ id: string }>()

  if (rawId === undefined) {
    return <InstitutionForm mode="create" />
  }

  const id = parseInstitutionId(rawId)

  if (id === null) {
    return <Navigate to={ROUTES.INSTITUTIONS} replace />
  }

  return <InstitutionEditContent id={id} />
}

interface InstitutionEditContentProps {
  id: number
}

function InstitutionEditContent({ id }: InstitutionEditContentProps) {
  const { t } = useTranslation('institutions')
  const { data, isPending, isError, error, refetch } = useInstitution(id)

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
    return <Navigate to={ROUTES.INSTITUTIONS} replace />
  }

  return <InstitutionForm mode="edit" institution={data} />
}
