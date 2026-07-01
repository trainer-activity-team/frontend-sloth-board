import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ErrorMessage } from '../../../components/ui/ErrorMessage'
import { Input } from '../../../components/ui/Input'
import { Loader } from '../../../components/ui/Loader'
import { ROUTES } from '../../../lib/routes'
import type { Session } from '../../sessions/types'
import { useAgendaSessions } from '../hooks/useAgendaSessions'
import { QuickSessionCreateModal } from './QuickSessionCreateModal'

type AgendaMode = 'day' | 'week' | 'month'

const HOURS = Array.from({ length: 15 }, (_, index) => index + 7)
const HOUR_HEIGHT_PX = 80
const MIN_SESSION_HEIGHT_PX = 28
const DAY_START_MINUTES = HOURS[0] * 60
const DAY_END_MINUTES = (HOURS[HOURS.length - 1] + 1) * 60

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1)
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function parseDateKey(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function getWeekStart(date: Date): Date {
  const day = date.getDay()
  const offset = day === 0 ? -6 : 1 - day
  return addDays(startOfDay(date), offset)
}

function getWeekDates(date: Date): Date[] {
  const start = getWeekStart(date)
  return Array.from({ length: 7 }, (_, index) => addDays(start, index))
}

function getMonthDates(date: Date): Date[] {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  const start = getWeekStart(firstDay)

  return Array.from({ length: 42 }, (_, index) => addDays(start, index))
}

function getSessionDateKey(session: Session): string {
  return session.date.slice(0, 10)
}

function formatSessionTime(value: string): string {
  if (/^\d{2}:\d{2}/.test(value)) {
    return value.slice(0, 5)
  }

  return value.slice(11, 16)
}

function getTimeInMinutes(value: string): number | null {
  const time = formatSessionTime(value)

  if (!/^\d{2}:\d{2}$/.test(time)) {
    return null
  }

  const [hours, minutes] = time.split(':').map(Number)

  return hours * 60 + minutes
}

function getSessionLayout(session: Session): { top: number; height: number } | null {
  const startMinutes = getTimeInMinutes(session.start)
  const endMinutes = getTimeInMinutes(session.end)

  if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
    return null
  }

  const visibleStart = Math.max(startMinutes, DAY_START_MINUTES)
  const visibleEnd = Math.min(endMinutes, DAY_END_MINUTES)

  if (visibleEnd <= visibleStart) {
    return null
  }

  return {
    top: ((visibleStart - DAY_START_MINUTES) / 60) * HOUR_HEIGHT_PX,
    height: Math.max(
      ((visibleEnd - visibleStart) / 60) * HOUR_HEIGHT_PX,
      MIN_SESSION_HEIGHT_PX,
    ),
  }
}

function getSessionColorClass(session: Session): string {
  const status = session.statusRelation?.name.toLowerCase() ?? ''

  if (status.includes('cancel') || status.includes('annul')) {
    return 'bg-danger text-on-primary'
  }

  if (
    status.includes('done') ||
    status.includes('complete') ||
    status.includes('termin')
  ) {
    return 'bg-success text-on-primary'
  }

  if (status.includes('pending') || status.includes('wait')) {
    return 'bg-warning text-on-primary'
  }

  if (session.sessionTypeId && session.sessionTypeId % 3 === 0) {
    return 'bg-chart-3 text-on-primary'
  }

  if (session.sessionTypeId && session.sessionTypeId % 2 === 0) {
    return 'bg-chart-2 text-on-primary'
  }

  return 'bg-primary text-on-primary'
}

function getSessionMeta(session: Session): string {
  const pieces = [
    session.sessionType?.name,
    session.class ? `${session.class.name} ${session.class.classLevel}` : null,
    session.user ? `${session.user.firstName} ${session.user.lastName}` : null,
  ].filter(Boolean)

  return pieces.join(' • ')
}

function getSessionsByDate(sessions: Session[]): Map<string, Session[]> {
  const byDate = new Map<string, Session[]>()

  sessions.forEach((session) => {
    const dateKey = getSessionDateKey(session)
    const daySessions = byDate.get(dateKey) ?? []
    daySessions.push(session)
    byDate.set(dateKey, daySessions)
  })

  byDate.forEach((daySessions) => {
    daySessions.sort((a, b) => a.start.localeCompare(b.start))
  })

  return byDate
}

function filterSessionsInRange(
  sessions: Session[],
  startDate: Date,
  endDate: Date,
): Session[] {
  const startKey = formatDateKey(startDate)
  const endKey = formatDateKey(endDate)

  return sessions.filter((session) => {
    const dateKey = getSessionDateKey(session)
    return dateKey >= startKey && dateKey <= endKey
  })
}

function getRangeLabel(mode: AgendaMode, date: Date): string {
  if (mode === 'day') {
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  if (mode === 'week') {
    const weekDates = getWeekDates(date)
    const first = weekDates[0]
    const last = weekDates[6]

    return `${new Intl.DateTimeFormat(undefined, {
      day: 'numeric',
      month: 'short',
    }).format(first)} - ${new Intl.DateTimeFormat(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(last)}`
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

interface SessionPillProps {
  session: Session
  compact?: boolean
  className?: string
  onClick: (session: Session) => void
}

function SessionPill({
  session,
  compact = false,
  className = '',
  onClick,
}: SessionPillProps) {
  const timeLabel = `${formatSessionTime(session.start)}-${formatSessionTime(
    session.end,
  )}`
  const meta = getSessionMeta(session)

  return (
    <button
      type="button"
      onClick={() => onClick(session)}
      className={`w-full rounded-lg px-2 py-1 text-left text-xs font-semibold shadow-sm transition-opacity hover:opacity-90 ${getSessionColorClass(
        session,
      )} ${className}`}
    >
      <span className="block truncate">{session.title}</span>
      <span className="block truncate font-normal opacity-90">{timeLabel}</span>
      {!compact && meta ? (
        <span className="block truncate font-normal opacity-90">{meta}</span>
      ) : null}
    </button>
  )
}

interface TimeGridProps {
  dates: Date[]
  sessionsByDate: Map<string, Session[]>
  onSessionClick: (session: Session) => void
}

function TimeGrid({ dates, sessionsByDate, onSessionClick }: TimeGridProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px]">
        <div
          className={`grid border-b border-border text-sm text-muted ${
            dates.length === 1 ? 'grid-cols-[72px_1fr]' : 'grid-cols-[72px_repeat(7,1fr)]'
          }`}
        >
          <div />
          {dates.map((date) => (
            <div key={formatDateKey(date)} className="px-3 py-3 text-center">
              <span className="block text-xs uppercase tracking-wide">
                {new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(
                  date,
                )}
              </span>
              <span className="text-lg font-semibold text-foreground">
                {date.getDate()}
              </span>
            </div>
          ))}
        </div>

        <div
          className={`grid ${
            dates.length === 1 ? 'grid-cols-[72px_1fr]' : 'grid-cols-[72px_repeat(7,1fr)]'
          }`}
        >
          <div>
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-20 border-r border-b border-border px-2 py-2 text-right text-xs text-muted last:border-b-0"
              >
                {String(hour).padStart(2, '0')}:00
              </div>
            ))}
          </div>
          {dates.map((date) => {
            const dateKey = formatDateKey(date)
            const daySessions = sessionsByDate.get(dateKey) ?? []

            return (
              <div
                key={dateKey}
                className="relative border-r border-border last:border-r-0"
              >
                {HOURS.map((hour) => (
                  <div
                    key={`${dateKey}-${hour}`}
                    className="h-20 border-b border-border last:border-b-0"
                  />
                ))}
                <div className="absolute inset-0">
                  {daySessions.map((session) => {
                    const layout = getSessionLayout(session)

                    if (!layout) {
                      return null
                    }

                    return (
                      <div
                        key={session.id}
                        className="absolute left-1 right-1"
                        style={{
                          top: `${layout.top}px`,
                          height: `${layout.height}px`,
                        }}
                      >
                        <SessionPill
                          session={session}
                          className="h-full overflow-hidden"
                          onClick={onSessionClick}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface MonthGridProps {
  currentDate: Date
  sessionsByDate: Map<string, Session[]>
  onDateClick: (date: Date) => void
  onSessionClick: (session: Session) => void
}

function MonthGrid({
  currentDate,
  sessionsByDate,
  onDateClick,
  onSessionClick,
}: MonthGridProps) {
  const monthDates = getMonthDates(currentDate)

  return (
    <div className="grid grid-cols-7 overflow-hidden rounded-xl border border-border">
      {getWeekDates(currentDate).map((date) => (
        <div
          key={date.getDay()}
          className="border-r border-b border-border bg-background px-2 py-2 text-center text-xs uppercase tracking-wide text-muted last:border-r-0"
        >
          {new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(date)}
        </div>
      ))}
      {monthDates.map((date) => {
        const dateKey = formatDateKey(date)
        const daySessions = sessionsByDate.get(dateKey) ?? []
        const isCurrentMonth = date.getMonth() === currentDate.getMonth()

        return (
          <div
            key={dateKey}
            className={`min-h-32 border-r border-b border-border p-2 last:border-r-0 ${
              isCurrentMonth ? 'bg-surface' : 'bg-background text-disabled'
            }`}
          >
            <button
              type="button"
              onClick={() => onDateClick(date)}
              className="mb-2 rounded-full px-2 py-1 text-sm font-semibold text-foreground hover:bg-surface-hover"
            >
              {date.getDate()}
            </button>
            <div className="space-y-1">
              {daySessions.slice(0, 3).map((session) => (
                <SessionPill
                  key={session.id}
                  session={session}
                  compact
                  onClick={onSessionClick}
                />
              ))}
              {daySessions.length > 3 ? (
                <p className="text-xs text-muted">
                  +{daySessions.length - 3} more
                </p>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function AgendaView() {
  const { t } = useTranslation('agenda')
  const navigate = useNavigate()
  const [mode, setMode] = useState<AgendaMode>('week')
  const [currentDate, setCurrentDate] = useState(() => startOfDay(new Date()))
  const [dateFilter, setDateFilter] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const { data, isPending, isError, error, refetch } = useAgendaSessions(
    dateFilter || undefined,
  )

  const visibleSessions = useMemo(() => {
    if (!data) {
      return []
    }

    if (mode === 'day') {
      return filterSessionsInRange(data, currentDate, currentDate)
    }

    if (mode === 'week') {
      const weekDates = getWeekDates(currentDate)
      return filterSessionsInRange(data, weekDates[0], weekDates[6])
    }

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    return filterSessionsInRange(data, firstDay, lastDay)
  }, [currentDate, data, mode])

  const sessionsByDate = useMemo(
    () => getSessionsByDate(visibleSessions),
    [visibleSessions],
  )

  const handlePrevious = () => {
    if (mode === 'day') {
      setCurrentDate((date) => addDays(date, -1))
    } else if (mode === 'week') {
      setCurrentDate((date) => addDays(date, -7))
    } else {
      setCurrentDate((date) => addMonths(date, -1))
    }
  }

  const handleNext = () => {
    if (mode === 'day') {
      setCurrentDate((date) => addDays(date, 1))
    } else if (mode === 'week') {
      setCurrentDate((date) => addDays(date, 7))
    } else {
      setCurrentDate((date) => addMonths(date, 1))
    }
  }

  const handleToday = () => {
    const today = startOfDay(new Date())
    setCurrentDate(today)
    setDateFilter('')
  }

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value)

    if (value) {
      setCurrentDate(parseDateKey(value))
    }
  }

  const handleSessionClick = (session: Session) => {
    void navigate(`${ROUTES.SESSIONS}/${session.id}`)
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted">
              {t('header.eyebrow')}
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-foreground">
              {getRangeLabel(mode, currentDate)}
            </h1>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <div className="flex rounded-xl border border-border bg-background p-1">
              {(['day', 'week', 'month'] as const).map((viewMode) => (
                <button
                  key={viewMode}
                  type="button"
                  onClick={() => setMode(viewMode)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    mode === viewMode
                      ? 'bg-primary text-on-primary'
                      : 'text-muted hover:bg-surface-hover hover:text-foreground'
                  }`}
                >
                  {t(`views.${viewMode}`)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" onClick={handlePrevious}>
                <FiChevronLeft aria-hidden />
              </Button>
              <Button type="button" variant="ghost" onClick={handleToday}>
                {t('header.today')}
              </Button>
              <Button type="button" variant="ghost" onClick={handleNext}>
                <FiChevronRight aria-hidden />
              </Button>
            </div>

            <Button type="button" onClick={() => setIsCreateOpen(true)}>
              <FiPlus aria-hidden />
              {t('header.create')}
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,240px)_auto] md:items-end">
          <Input
            label={t('filters.dateLabel')}
            type="date"
            value={dateFilter}
            onChange={(event) => handleDateFilterChange(event.target.value)}
          />
          {dateFilter ? (
            <Button
              type="button"
              variant="ghost"
              className="md:w-fit"
              onClick={() => setDateFilter('')}
            >
              {t('filters.clear')}
            </Button>
          ) : null}
        </div>
      </Card>

      <Card className="p-0">
        {isPending ? (
          <Loader />
        ) : isError ? (
          <ErrorMessage
            error={error}
            fallbackMessage={t('errors.loadFailed')}
            onRetry={() => void refetch()}
          />
        ) : visibleSessions.length === 0 ? (
          <EmptyState
            title={t('empty.title')}
            description={t('empty.description')}
          />
        ) : mode === 'month' ? (
          <div className="p-4">
            <MonthGrid
              currentDate={currentDate}
              sessionsByDate={sessionsByDate}
              onDateClick={(date) => {
                setCurrentDate(date)
                setMode('day')
              }}
              onSessionClick={handleSessionClick}
            />
          </div>
        ) : (
          <TimeGrid
            dates={mode === 'day' ? [currentDate] : getWeekDates(currentDate)}
            sessionsByDate={sessionsByDate}
            onSessionClick={handleSessionClick}
          />
        )}
      </Card>

      <QuickSessionCreateModal
        isOpen={isCreateOpen}
        initialDate={formatDateKey(currentDate)}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  )
}
