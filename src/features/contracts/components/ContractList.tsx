import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiSearch,
} from 'react-icons/fi'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ErrorMessage } from '../../../components/ui/ErrorMessage'
import { Loader } from '../../../components/ui/Loader'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from '../../../components/ui/Table'
import { ROUTES } from '../../../lib/routes'
import { useInstitutions } from '../../institutions/hooks/useInstitutions'
import { useContracts } from '../hooks/useContracts'
import { usePricingModes } from '../hooks/usePricingModes'
import type { Contract } from '../types'

type SortKey =
  | 'contractNumber'
  | 'institution'
  | 'pricingMode'
  | 'startDate'
  | 'hourlyVolumePlanned'
  | 'unitPrice'
type SortDirection = 'asc' | 'desc'

function getInstitutionName(contract: Contract): string {
  return contract.institution?.name ?? ''
}

function getPricingModeName(contract: Contract): string {
  return contract.pricingMode?.name ?? ''
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined).format(new Date(value))
}

function formatDecimal(value: string): string {
  return Number.parseFloat(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function compareContracts(
  a: Contract,
  b: Contract,
  key: SortKey,
  direction: SortDirection,
): number {
  let result: number

  if (key === 'hourlyVolumePlanned' || key === 'unitPrice') {
    result = Number.parseFloat(a[key]) - Number.parseFloat(b[key])
  } else if (key === 'institution') {
    result = getInstitutionName(a).localeCompare(getInstitutionName(b), undefined, {
      sensitivity: 'base',
    })
  } else if (key === 'pricingMode') {
    result = getPricingModeName(a).localeCompare(getPricingModeName(b), undefined, {
      sensitivity: 'base',
    })
  } else {
    result = a[key].localeCompare(b[key], undefined, { sensitivity: 'base' })
  }

  return direction === 'asc' ? result : -result
}

interface SortableHeaderProps {
  label: string
  sortKey: SortKey
  activeKey: SortKey
  direction: SortDirection
  onSort: (key: SortKey) => void
}

function SortableHeader({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
}: SortableHeaderProps) {
  const isActive = activeKey === sortKey
  const Icon = isActive && direction === 'desc' ? FiChevronDown : FiChevronUp

  return (
    <TableHeadCell>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-1 hover:text-foreground"
      >
        {label}
        <Icon
          className={`text-sm ${isActive ? 'text-foreground' : 'text-disabled'}`}
          aria-hidden
        />
      </button>
    </TableHeadCell>
  )
}

export function ContractList() {
  const { t } = useTranslation('contracts')
  const navigate = useNavigate()
  const { data, isPending, isError, error, refetch } = useContracts()
  const { data: institutions } = useInstitutions()
  const { data: pricingModes } = usePricingModes()

  const [search, setSearch] = useState('')
  const [institutionFilter, setInstitutionFilter] = useState('all')
  const [pricingModeFilter, setPricingModeFilter] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey>('contractNumber')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortKey(key)
    setSortDirection('asc')
  }

  const filteredContracts = useMemo(() => {
    if (!data) {
      return []
    }

    const normalizedSearch = search.trim().toLowerCase()

    return data
      .filter((contract) => {
        const institutionName = getInstitutionName(contract).toLowerCase()
        const pricingModeName = getPricingModeName(contract).toLowerCase()

        const matchesSearch =
          normalizedSearch.length === 0 ||
          contract.contractNumber.toLowerCase().includes(normalizedSearch) ||
          institutionName.includes(normalizedSearch) ||
          pricingModeName.includes(normalizedSearch)

        const matchesInstitution =
          institutionFilter === 'all' ||
          contract.institutionId === Number.parseInt(institutionFilter, 10)

        const matchesPricingMode =
          pricingModeFilter === 'all' ||
          contract.pricingModeId === Number.parseInt(pricingModeFilter, 10)

        return matchesSearch && matchesInstitution && matchesPricingMode
      })
      .sort((a, b) => compareContracts(a, b, sortKey, sortDirection))
  }, [data, search, institutionFilter, pricingModeFilter, sortKey, sortDirection])

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

  if (!data.length) {
    return (
      <EmptyState
        title={t('list.emptyTitle')}
        description={t('list.emptyDescription')}
        actionLabel={t('list.emptyAction')}
        actionLink={ROUTES.CONTRACT_NEW}
      />
    )
  }

  return (
    <Card className="p-0">
      <div className="flex flex-col gap-4 border-b border-border p-4 md:p-6">
        <div className="relative">
          <FiSearch
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('list.searchPlaceholder')}
            className="w-full rounded-xl border border-border bg-background py-2.5 pr-4 pl-10 text-sm text-foreground placeholder:text-disabled focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-3 sm:grid-cols-2 lg:max-w-2xl lg:flex-1">
            <select
              value={institutionFilter}
              onChange={(event) => setInstitutionFilter(event.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">{t('list.filterAllInstitutions')}</option>
              {institutions?.map((institution) => (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              ))}
            </select>

            <select
              value={pricingModeFilter}
              onChange={(event) => setPricingModeFilter(event.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">{t('list.filterAllPricingModes')}</option>
              {pricingModes?.map((pricingMode) => (
                <option key={pricingMode.id} value={pricingMode.id}>
                  {pricingMode.name}
                </option>
              ))}
            </select>
          </div>

          <Link to={ROUTES.CONTRACT_NEW}>
            <Button type="button" className="w-full lg:w-auto">
              <FiPlus aria-hidden />
              {t('list.addButton')}
            </Button>
          </Link>
        </div>
      </div>

      {filteredContracts.length === 0 ? (
        <EmptyState
          title={t('list.noResultsTitle')}
          description={t('list.noResultsDescription')}
        />
      ) : (
        <Table>
          <TableHead>
            <TableRow className="hover:bg-transparent">
              <SortableHeader
                label={t('list.columns.contractNumber')}
                sortKey="contractNumber"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label={t('list.columns.institution')}
                sortKey="institution"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label={t('list.columns.pricingMode')}
                sortKey="pricingMode"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label={t('list.columns.period')}
                sortKey="startDate"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label={t('list.columns.hourlyVolumePlanned')}
                sortKey="hourlyVolumePlanned"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label={t('list.columns.unitPrice')}
                sortKey="unitPrice"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContracts.map((contract) => (
              <TableRow
                key={contract.id}
                className="cursor-pointer hover:bg-surface-hover"
                onClick={() => void navigate(`${ROUTES.CONTRACTS}/${contract.id}`)}
              >
                <TableCell className="font-semibold">
                  {contract.contractNumber}
                </TableCell>
                <TableCell className="max-w-xs truncate text-muted">
                  {getInstitutionName(contract)}
                </TableCell>
                <TableCell className="max-w-xs truncate text-muted">
                  {getPricingModeName(contract)}
                </TableCell>
                <TableCell className="text-muted">
                  {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                </TableCell>
                <TableCell>{formatDecimal(contract.hourlyVolumePlanned)}</TableCell>
                <TableCell>{formatDecimal(contract.unitPrice)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  )
}
