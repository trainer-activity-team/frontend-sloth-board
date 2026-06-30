import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
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
import { useClasses } from '../../classes/hooks/useClasses'
import { useSessionTypes } from '../hooks/useSessionTypes'
import { useSessions } from '../hooks/useSessions'
import type { Session } from '../types'

type SortKey = 'title' | 'date' | 'class' | 'sessionType' | 'status' | 'user'
type SortDirection = 'asc' | 'desc'

function getClassLabel(session: Session): string {
  if (!session.class) {
    return ''
  }

  return `${session.class.name} (${session.class.classLevel})`
}

function getUserLabel(session: Session): string {
  if (!session.user) {
    return ''
  }

  return `${session.user.firstName} ${session.user.lastName}`
}

function getContractLabel(session: Session): string {
  return session.contract?.contractNumber ?? ''
}

function getSessionTypeLabel(session: Session): string {
  return session.sessionType?.name ?? ''
}

function getStatusLabel(session: Session): string {
  return session.statusRelation?.name ?? ''
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined).format(new Date(value))
}

function formatTime(value: string): string {
  if (/^\d{2}:\d{2}/.test(value)) {
    return value.slice(0, 5)
  }

  return value.slice(11, 16)
}

function compareSessions(
  a: Session,
  b: Session,
  key: SortKey,
  direction: SortDirection,
): number {
  let result: number

  if (key === 'date') {
    result = `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`)
  } else if (key === 'class') {
    result = getClassLabel(a).localeCompare(getClassLabel(b), undefined, {
      sensitivity: 'base',
    })
  } else if (key === 'sessionType') {
    result = getSessionTypeLabel(a).localeCompare(
      getSessionTypeLabel(b),
      undefined,
      { sensitivity: 'base' },
    )
  } else if (key === 'status') {
    result = getStatusLabel(a).localeCompare(getStatusLabel(b), undefined, {
      sensitivity: 'base',
    })
  } else if (key === 'user') {
    result = getUserLabel(a).localeCompare(getUserLabel(b), undefined, {
      sensitivity: 'base',
    })
  } else {
    result = a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
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

export function SessionList() {
  const { t } = useTranslation('sessions')
  const navigate = useNavigate()
  const { data, isPending, isError, error, refetch } = useSessions()
  const { data: classes } = useClasses()
  const { data: sessionTypes } = useSessionTypes()

  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('all')
  const [sessionTypeFilter, setSessionTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const statusOptions = useMemo(() => {
    if (!data) {
      return []
    }

    const statuses = new Map<number, string>()
    data.forEach((session) => {
      if (session.statusRelation) {
        statuses.set(session.statusRelation.id, session.statusRelation.name)
      }
    })

    return Array.from(statuses, ([id, name]) => ({ id, name })).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
    )
  }, [data])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortKey(key)
    setSortDirection('asc')
  }

  const filteredSessions = useMemo(() => {
    if (!data) {
      return []
    }

    const normalizedSearch = search.trim().toLowerCase()

    return data
      .filter((session) => {
        const classLabel = getClassLabel(session).toLowerCase()
        const contractLabel = getContractLabel(session).toLowerCase()
        const sessionTypeLabel = getSessionTypeLabel(session).toLowerCase()
        const statusLabel = getStatusLabel(session).toLowerCase()
        const userLabel = getUserLabel(session).toLowerCase()
        const subject = session.subject?.toLowerCase() ?? ''

        const matchesSearch =
          normalizedSearch.length === 0 ||
          session.title.toLowerCase().includes(normalizedSearch) ||
          subject.includes(normalizedSearch) ||
          classLabel.includes(normalizedSearch) ||
          contractLabel.includes(normalizedSearch) ||
          sessionTypeLabel.includes(normalizedSearch) ||
          statusLabel.includes(normalizedSearch) ||
          userLabel.includes(normalizedSearch)

        const matchesClass =
          classFilter === 'all' ||
          session.classId === Number.parseInt(classFilter, 10)

        const matchesSessionType =
          sessionTypeFilter === 'all' ||
          session.sessionTypeId === Number.parseInt(sessionTypeFilter, 10)

        const matchesStatus =
          statusFilter === 'all' ||
          session.statusRelation?.id === Number.parseInt(statusFilter, 10)

        return matchesSearch && matchesClass && matchesSessionType && matchesStatus
      })
      .sort((a, b) => compareSessions(a, b, sortKey, sortDirection))
  }, [classFilter, data, search, sessionTypeFilter, sortDirection, sortKey, statusFilter])

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
        actionLink={ROUTES.SESSION_NEW}
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

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:max-w-4xl xl:flex-1">
            <select
              value={classFilter}
              onChange={(event) => setClassFilter(event.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">{t('list.filterAllClasses')}</option>
              {classes?.map((schoolClass) => (
                <option key={schoolClass.id} value={schoolClass.id}>
                  {schoolClass.name} ({schoolClass.classLevel})
                </option>
              ))}
            </select>

            <select
              value={sessionTypeFilter}
              onChange={(event) => setSessionTypeFilter(event.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">{t('list.filterAllSessionTypes')}</option>
              {sessionTypes?.map((sessionType) => (
                <option key={sessionType.id} value={sessionType.id}>
                  {sessionType.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">{t('list.filterAllStatuses')}</option>
              {statusOptions.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          <Link to={ROUTES.SESSION_NEW}>
            <Button type="button" className="w-full xl:w-auto">
              <FiPlus aria-hidden />
              {t('list.addButton')}
            </Button>
          </Link>
        </div>
      </div>

      {filteredSessions.length === 0 ? (
        <EmptyState
          title={t('list.noResultsTitle')}
          description={t('list.noResultsDescription')}
        />
      ) : (
        <Table>
          <TableHead>
            <TableRow className="hover:bg-transparent">
              <SortableHeader
                label={t('list.columns.title')}
                sortKey="title"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label={t('list.columns.date')}
                sortKey="date"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label={t('list.columns.class')}
                sortKey="class"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label={t('list.columns.sessionType')}
                sortKey="sessionType"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label={t('list.columns.status')}
                sortKey="status"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label={t('list.columns.user')}
                sortKey="user"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSessions.map((session) => (
              <TableRow
                key={session.id}
                className="cursor-pointer hover:bg-surface-hover"
                onClick={() => void navigate(`${ROUTES.SESSIONS}/${session.id}`)}
              >
                <TableCell className="font-semibold">{session.title}</TableCell>
                <TableCell className="text-muted">
                  {formatDate(session.date)} {formatTime(session.start)}-
                  {formatTime(session.end)}
                </TableCell>
                <TableCell className="max-w-xs truncate text-muted">
                  {getClassLabel(session)}
                </TableCell>
                <TableCell className="max-w-xs truncate text-muted">
                  {getSessionTypeLabel(session)}
                </TableCell>
                <TableCell className="max-w-xs truncate text-muted">
                  {getStatusLabel(session)}
                </TableCell>
                <TableCell className="max-w-xs truncate text-muted">
                  {getUserLabel(session)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  )
}
