import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiSearch,
} from 'react-icons/fi'
import { Badge } from '../../../components/ui/Badge'
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
import { useInstitutions } from '../hooks/useInstitutions'
import type { Institution } from '../types'

type SortKey = 'name' | 'address' | 'requiresDeclaration'
type SortDirection = 'asc' | 'desc'
type DeclarationFilter = 'all' | 'required' | 'notRequired'

function compareInstitutions(
  a: Institution,
  b: Institution,
  key: SortKey,
  direction: SortDirection,
): number {
  let result = 0

  if (key === 'requiresDeclaration') {
    result = Number(a.requiresDeclaration) - Number(b.requiresDeclaration)
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

export function InstitutionList() {
  const { t } = useTranslation('institutions')
  const navigate = useNavigate()
  const { data, isPending, isError, error, refetch } = useInstitutions()

  const [search, setSearch] = useState('')
  const [declarationFilter, setDeclarationFilter] =
    useState<DeclarationFilter>('all')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortKey(key)
    setSortDirection('asc')
  }

  const filteredInstitutions = useMemo(() => {
    if (!data) {
      return []
    }

    const normalizedSearch = search.trim().toLowerCase()

    return data
      .filter((institution) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          institution.name.toLowerCase().includes(normalizedSearch) ||
          institution.address.toLowerCase().includes(normalizedSearch)

        const matchesDeclaration =
          declarationFilter === 'all' ||
          (declarationFilter === 'required' &&
            institution.requiresDeclaration) ||
          (declarationFilter === 'notRequired' &&
            !institution.requiresDeclaration)

        return matchesSearch && matchesDeclaration
      })
      .sort((a, b) => compareInstitutions(a, b, sortKey, sortDirection))
  }, [data, search, declarationFilter, sortKey, sortDirection])

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
        actionLink={ROUTES.INSTITUTION_NEW}
      />
    )
  }

  return (
    <Card className="p-0">
      <div className="flex flex-col gap-4 border-b border-border p-4 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="relative flex-1 md:max-w-md">
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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={declarationFilter}
            onChange={(event) =>
              setDeclarationFilter(event.target.value as DeclarationFilter)
            }
            className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">{t('list.filterAll')}</option>
            <option value="required">{t('list.filterRequired')}</option>
            <option value="notRequired">{t('list.filterNotRequired')}</option>
          </select>

          <Link to={ROUTES.INSTITUTION_NEW}>
            <Button type="button" className="w-full sm:w-auto">
              <FiPlus aria-hidden />
              {t('list.addButton')}
            </Button>
          </Link>
        </div>
      </div>

      {filteredInstitutions.length === 0 ? (
        <EmptyState
          title={t('list.noResultsTitle')}
          description={t('list.noResultsDescription')}
        />
      ) : (
        <Table>
          <TableHead>
            <TableRow className="hover:bg-transparent">
              <SortableHeader
                label={t('list.columns.name')}
                sortKey="name"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label={t('list.columns.address')}
                sortKey="address"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <TableHeadCell>{t('list.columns.color')}</TableHeadCell>
              <SortableHeader
                label={t('list.columns.requiresDeclaration')}
                sortKey="requiresDeclaration"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInstitutions.map((institution) => (
              <TableRow
                key={institution.id}
                className="cursor-pointer hover:bg-surface-hover"
                onClick={() =>
                  void navigate(`${ROUTES.INSTITUTIONS}/${institution.id}`)
                }
              >
                <TableCell className="font-semibold">
                  {institution.name}
                </TableCell>
                <TableCell className="max-w-xs truncate text-muted">
                  {institution.address}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className="size-5 shrink-0 rounded-md border border-border"
                      style={{ backgroundColor: institution.color }}
                      aria-hidden
                    />
                    <span className="font-mono text-xs text-muted">
                      {institution.color}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      institution.requiresDeclaration ? 'success' : 'muted'
                    }
                  >
                    {institution.requiresDeclaration
                      ? t('list.declarationYes')
                      : t('list.declarationNo')}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  )
}
