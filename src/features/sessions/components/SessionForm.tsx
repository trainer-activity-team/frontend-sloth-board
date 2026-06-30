import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { ErrorMessage } from '../../../components/ui/ErrorMessage'
import { Input } from '../../../components/ui/Input'
import { Loader } from '../../../components/ui/Loader'
import { ROUTES } from '../../../lib/routes'
import { useClasses } from '../../classes/hooks/useClasses'
import { useContracts } from '../../contracts/hooks/useContracts'
import { useUsers } from '../../users/hooks/useUsers'
import { createSessionFormSchema, type SessionFormValues } from '../schemas'
import { useCreateSession } from '../hooks/useCreateSession'
import { useDeleteSession } from '../hooks/useDeleteSession'
import { useSessionTypes } from '../hooks/useSessionTypes'
import { useTimescales } from '../hooks/useTimescales'
import { useUpdateSession } from '../hooks/useUpdateSession'
import type { CreateSessionRequest, Session } from '../types'

const selectClassName =
  'w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60'

interface SelectOption {
  id: number
  label: string
}

interface SessionFormProps {
  mode: 'create' | 'edit'
  session?: Session
}

function toDateInputValue(value: string | null | undefined): string {
  if (!value) {
    return ''
  }

  return value.slice(0, 10)
}

function toTimeInputValue(value: string | null | undefined): string {
  if (!value) {
    return ''
  }

  if (/^\d{2}:\d{2}/.test(value)) {
    return value.slice(0, 5)
  }

  return value.slice(11, 16)
}

function parseOptionalId(value: string): number | undefined {
  if (!value) {
    return undefined
  }

  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? undefined : parsed
}

function addOptionalText(
  payload: CreateSessionRequest,
  key: 'subject' | 'declarationReference' | 'declarationDate',
  value: string,
): void {
  const trimmed = value.trim()
  if (trimmed.length > 0) {
    payload[key] = trimmed
  }
}

function buildSessionPayload(values: SessionFormValues): CreateSessionRequest {
  const payload: CreateSessionRequest = {
    title: values.title.trim(),
    date: values.date,
    start: values.start,
    end: values.end,
  }

  addOptionalText(payload, 'subject', values.subject)
  addOptionalText(payload, 'declarationReference', values.declarationReference)
  addOptionalText(payload, 'declarationDate', values.declarationDate)

  if (values.classId) {
    payload.classId = values.classId
  }
  if (values.contractId) {
    payload.contractId = values.contractId
  }
  if (values.userId) {
    payload.userId = values.userId
  }
  if (values.sessionTypeId) {
    payload.sessionTypeId = values.sessionTypeId
  }
  if (values.timescaleId) {
    payload.timescaleId = values.timescaleId
  }

  return payload
}

function getUserLabel(user: { firstName: string; lastName: string; email: string }) {
  return `${user.firstName} ${user.lastName} (${user.email})`
}

function getContractLabel(contract: { contractNumber: string }) {
  return contract.contractNumber
}

interface FormSelectProps {
  id: keyof SessionFormValues
  label: string
  placeholder: string
  options: SelectOption[]
  value: number | undefined
  error?: string
  disabled?: boolean
  onChange: (value: number | undefined) => void
}

function FormSelect({
  id,
  label,
  placeholder,
  options,
  value,
  error,
  disabled,
  onChange,
}: FormSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm uppercase tracking-wide text-muted">
        {label}
      </label>
      <select
        id={id}
        value={value ?? ''}
        onChange={(event) => onChange(parseOptionalId(event.target.value))}
        disabled={disabled}
        className={`${selectClassName} ${error ? 'border-danger focus:border-danger focus:ring-danger' : ''}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  )
}

export function SessionForm({ mode, session }: SessionFormProps) {
  const { t } = useTranslation('sessions')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const classesQuery = useClasses()
  const contractsQuery = useContracts()
  const usersQuery = useUsers()
  const sessionTypesQuery = useSessionTypes()
  const timescalesQuery = useTimescales()

  const schema = useMemo(() => createSessionFormSchema(t), [t])

  const defaultValues: SessionFormValues = {
    title: session?.title ?? '',
    date: toDateInputValue(session?.date),
    start: toTimeInputValue(session?.start),
    end: toTimeInputValue(session?.end),
    subject: session?.subject ?? '',
    classId: session?.classId ?? undefined,
    contractId: session?.contractId ?? undefined,
    userId: session?.userId ?? undefined,
    sessionTypeId: session?.sessionTypeId ?? undefined,
    timescaleId: session?.timescaleId ?? undefined,
    declarationReference: session?.declarationReference ?? '',
    declarationDate: toDateInputValue(session?.declarationDate),
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SessionFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const { mutate: createMutate, isPending: isCreating } = useCreateSession()
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateSession()
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteSession()

  const optionQueries = [
    classesQuery,
    contractsQuery,
    usersQuery,
    sessionTypesQuery,
    timescalesQuery,
  ]
  const selectsLoading = optionQueries.some((query) => query.isPending)
  const selectsError = optionQueries.some((query) => query.isError)
  const optionError = optionQueries.find((query) => query.isError)?.error
  const isPending = isCreating || isUpdating

  const classOptions =
    classesQuery.data?.map((schoolClass) => ({
      id: schoolClass.id,
      label: `${schoolClass.name} (${schoolClass.classLevel})`,
    })) ?? []
  const contractOptions =
    contractsQuery.data?.map((contract) => ({
      id: contract.id,
      label: getContractLabel(contract),
    })) ?? []
  const userOptions =
    usersQuery.data?.map((user) => ({
      id: user.id,
      label: getUserLabel(user),
    })) ?? []
  const sessionTypeOptions =
    sessionTypesQuery.data?.map((sessionType) => ({
      id: sessionType.id,
      label: sessionType.name,
    })) ?? []
  const timescaleOptions =
    timescalesQuery.data?.map((timescale) => ({
      id: timescale.id,
      label: timescale.name,
    })) ?? []

  const onSubmit = (values: SessionFormValues) => {
    const payload = buildSessionPayload(values)

    if (mode === 'create') {
      createMutate(payload)
      return
    }

    if (session) {
      updateMutate({ id: session.id, data: payload })
    }
  }

  const handleDelete = () => {
    if (session) {
      deleteMutate(session.id)
    }
  }

  if (selectsLoading) {
    return <Loader />
  }

  if (selectsError) {
    return (
      <ErrorMessage
        error={optionError}
        fallbackMessage={t('errors.loadOptionsFailed')}
        onRetry={() => {
          optionQueries.forEach((query) => {
            void query.refetch()
          })
        }}
      />
    )
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <Card>
        <form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Input
            label={t('form.titleLabel')}
            error={errors.title?.message}
            {...register('title')}
          />

          <Input
            label={t('form.subjectLabel')}
            error={errors.subject?.message}
            {...register('subject')}
          />

          <div className="grid gap-5 md:grid-cols-3">
            <Input
              label={t('form.dateLabel')}
              type="date"
              error={errors.date?.message}
              {...register('date')}
            />
            <Input
              label={t('form.startLabel')}
              type="time"
              error={errors.start?.message}
              {...register('start')}
            />
            <Input
              label={t('form.endLabel')}
              type="time"
              error={errors.end?.message}
              {...register('end')}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Controller
              name="classId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  id="classId"
                  label={t('form.classLabel')}
                  placeholder={t('form.classPlaceholder')}
                  options={classOptions}
                  value={field.value}
                  error={errors.classId?.message}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              name="contractId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  id="contractId"
                  label={t('form.contractLabel')}
                  placeholder={t('form.contractPlaceholder')}
                  options={contractOptions}
                  value={field.value}
                  error={errors.contractId?.message}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              name="userId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  id="userId"
                  label={t('form.userLabel')}
                  placeholder={t('form.userPlaceholder')}
                  options={userOptions}
                  value={field.value}
                  error={errors.userId?.message}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              name="sessionTypeId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  id="sessionTypeId"
                  label={t('form.sessionTypeLabel')}
                  placeholder={t('form.sessionTypePlaceholder')}
                  options={sessionTypeOptions}
                  value={field.value}
                  error={errors.sessionTypeId?.message}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              name="timescaleId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  id="timescaleId"
                  label={t('form.timescaleLabel')}
                  placeholder={t('form.timescalePlaceholder')}
                  options={timescaleOptions}
                  value={field.value}
                  error={errors.timescaleId?.message}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label={t('form.declarationReferenceLabel')}
              error={errors.declarationReference?.message}
              {...register('declarationReference')}
            />
            <Input
              label={t('form.declarationDateLabel')}
              type="date"
              error={errors.declarationDate?.message}
              {...register('declarationDate')}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link to={ROUTES.SESSIONS}>
              <Button type="button" variant="ghost" className="w-full sm:w-auto">
                {t('form.cancel')}
              </Button>
            </Link>
            <Button type="submit" isLoading={isPending} className="w-full sm:w-auto">
              {mode === 'create'
                ? t('form.submitCreate')
                : t('form.submitUpdate')}
            </Button>
          </div>
        </form>
      </Card>

      {mode === 'edit' && session ? (
        <Card className="border-danger/40">
          <h2 className="text-lg font-semibold text-danger">
            {t('form.dangerZoneTitle')}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {t('form.dangerZoneDescription')}
          </p>

          {confirmDelete ? (
            <div className="mt-4 space-y-4">
              <p className="text-sm font-semibold text-foreground">
                {t('form.deleteConfirm')}
              </p>
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setConfirmDelete(false)}
                  disabled={isDeleting}
                >
                  {t('form.deleteCancelButton')}
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  isLoading={isDeleting}
                  onClick={handleDelete}
                >
                  {t('form.deleteConfirmButton')}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="danger"
              className="mt-4"
              onClick={() => setConfirmDelete(true)}
            >
              {t('form.deleteButton')}
            </Button>
          )}
        </Card>
      ) : null}
    </div>
  )
}
