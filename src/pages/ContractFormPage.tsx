import { Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { Loader } from '../components/ui/Loader'
import { ContractForm } from '../features/contracts/components/ContractForm'
import { useContract } from '../features/contracts/hooks/useContract'
import { ROUTES } from '../lib/routes'

function parseContractId(rawId: string | undefined): number | null {
  if (!rawId) {
    return null
  }

  const id = Number.parseInt(rawId, 10)
  if (Number.isNaN(id) || id <= 0) {
    return null
  }

  return id
}

export function ContractFormPage() {
  const { id: rawId } = useParams<{ id: string }>()

  if (rawId === undefined) {
    return <ContractForm mode="create" />
  }

  const id = parseContractId(rawId)

  if (id === null) {
    return <Navigate to={ROUTES.CONTRACTS} replace />
  }

  return <ContractEditContent id={id} />
}

interface ContractEditContentProps {
  id: number
}

function ContractEditContent({ id }: ContractEditContentProps) {
  const { t } = useTranslation('contracts')
  const { data, isPending, isError, error, refetch } = useContract(id)

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
    return <Navigate to={ROUTES.CONTRACTS} replace />
  }

  return <ContractForm mode="edit" contract={data} />
}
