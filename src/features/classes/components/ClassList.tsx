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
import { useInstitutions } from '../../institutions/hooks/useInstitutions'
import { ROUTES } from '../../../lib/routes'
import { useClasses } from '../hooks/useClasses'
import type { SchoolClass } from '../types'

type SortKey = 'name' | 'classLevel' | 'studentCount' | 'institution' | 'teacher'
type SortDirection = 'asc' | 'desc'

function getTeacherName(schoolClass: SchoolClass): string {
  if (!schoolClass.teacher) {
    return ''
  }

  return `${schoolClass.teacher.firstName} ${schoolClass.teacher.lastName}`
}

function getInstitutionName(schoolClass: SchoolClass): string {
  return schoolClass.institution?.name ?? ''
}

function compareClasses(
  a: SchoolClass,
  b: SchoolClass,
  key: SortKey,
  direction: SortDirection,
): number {
  let result = 0

  if (key === 'studentCount') {
    result = a.studentCount - b.studentCount
  } else if (key === 'institution') {
    result = getInstitutionName(a).localeCompare(getInstitutionName(b), undefined, {
      sensitivity: 'base',
    })
  } else if (key === 'teacher') {
    result = getTeacherName(a).localeCompare(getTeacherName(b), undefined, {
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

export function ClassList() {
  const { t } = useTranslation('classes')
  const navigate = useNavigate()
  const { data, isPending, isError, error, refetch } = useClasses()
  const { data: institutions } = useInstitutions()

  const [search, setSearch] = useState('')
  const [institutionFilter, setInstitutionFilter] = useState('all')
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

  const filteredClasses = useMemo(() => {
    if (!data) {
      return []
    }

    const normalizedSearch = search.trim().toLowerCase()

    return data
      .filter((schoolClass) => {
        const teacherName = getTeacherName(schoolClass).toLowerCase()
        const institutionName = getInstitutionName(schoolClass).toLowerCase()

        const matchesSearch =
          normalizedSearch.length === 0 ||
          schoolClass.name.toLowerCase().includes(normalizedSearch) ||
          schoolClass.classLevel.toLowerCase().includes(normalizedSearch) ||
          institutionName.includes(normalizedSearch) ||
          teacherName.includes(normalizedSearch)

        const matchesInstitution =
          institutionFilter === 'all' ||
          schoolClass.institutionId === Number.parseInt(institutionFilter, 10)

        return matchesSearch && matchesInstitution
      })
      .sort((a, b) => compareClasses(a, b, sortKey, sortDirection))
  }, [data, search, institutionFilter, sortKey, sortDirection])

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
        actionLink={ROUTES.CLASS_NEW}
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
            value={institutionFilter}
            onChange={(event) => setInstitutionFilter(event.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">{t('list.filterAll')}</option>
            {institutions?.map((institution) => (
              <option key={institution.id} value={institution.id}>
                {institution.name}
              </option>
            ))}
          </select>

          <Link to={ROUTES.CLASS_NEW}>
            <Button type="button" className="w-full sm:w-auto">
              <FiPlus aria-hidden />
              {t('list.addButton')}
            </Button>
          </Link>
        </div>
      </div>

      {filteredClasses.length === 0 ? (
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
                label={t('list.columns.classLevel')}
                sortKey="classLevel"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label={t('list.columns.studentCount')}
                sortKey="studentCount"
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
                label={t('list.columns.teacher')}
                sortKey="teacher"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClasses.map((schoolClass) => (
              <TableRow
                key={schoolClass.id}
                className="cursor-pointer hover:bg-surface-hover"
                onClick={() =>
                  void navigate(`${ROUTES.CLASSES}/${schoolClass.id}`)
                }
              >
                <TableCell className="font-semibold">{schoolClass.name}</TableCell>
                <TableCell className="text-muted">{schoolClass.classLevel}</TableCell>
                <TableCell>{schoolClass.studentCount}</TableCell>
                <TableCell className="max-w-xs truncate text-muted">
                  {getInstitutionName(schoolClass)}
                </TableCell>
                <TableCell className="max-w-xs truncate text-muted">
                  {getTeacherName(schoolClass)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  )
}
