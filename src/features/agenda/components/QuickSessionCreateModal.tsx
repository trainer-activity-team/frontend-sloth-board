import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FiX } from 'react-icons/fi'
import { z } from 'zod'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { useCreateAgendaSession } from '../hooks/useCreateAgendaSession'

function isValidDateValue(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

function isValidTimeValue(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
}

function createQuickSessionSchema(t: ReturnType<typeof useTranslation>['t']) {
  return z
    .object({
      title: z.string().min(1, t('validation.titleRequired')),
      date: z
        .string()
        .min(1, t('validation.dateRequired'))
        .refine(isValidDateValue, t('validation.dateInvalid')),
      start: z
        .string()
        .min(1, t('validation.startRequired'))
        .refine(isValidTimeValue, t('validation.startInvalid')),
      end: z
        .string()
        .min(1, t('validation.endRequired'))
        .refine(isValidTimeValue, t('validation.endInvalid')),
    })
    .refine(
      (values) =>
        !isValidTimeValue(values.start) ||
        !isValidTimeValue(values.end) ||
        values.end > values.start,
      {
        message: t('validation.endAfterStart'),
        path: ['end'],
      },
    )
}

type QuickSessionFormValues = z.infer<ReturnType<typeof createQuickSessionSchema>>

interface QuickSessionCreateModalProps {
  isOpen: boolean
  initialDate: string
  onClose: () => void
}

export function QuickSessionCreateModal({
  isOpen,
  initialDate,
  onClose,
}: QuickSessionCreateModalProps) {
  const { t } = useTranslation('agenda')
  const schema = useMemo(() => createQuickSessionSchema(t), [t])
  const createSession = useCreateAgendaSession(onClose)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuickSessionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      date: initialDate,
      start: '09:00',
      end: '10:00',
    },
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        title: '',
        date: initialDate,
        start: '09:00',
        end: '10:00',
      })
    }
  }, [initialDate, isOpen, reset])

  if (!isOpen) {
    return null
  }

  const onSubmit = (values: QuickSessionFormValues) => {
    createSession.mutate(values)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
      <Card className="w-full max-w-lg">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {t('create.title')}
            </h2>
            <p className="mt-1 text-sm text-muted">{t('create.description')}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
            aria-label={t('create.close')}
          >
            <FiX aria-hidden />
          </button>
        </div>

        <form className="space-y-4" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
          <Input
            label={t('create.titleLabel')}
            error={errors.title?.message}
            {...register('title')}
          />
          <Input
            label={t('create.dateLabel')}
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label={t('create.startLabel')}
              type="time"
              error={errors.start?.message}
              {...register('start')}
            />
            <Input
              label={t('create.endLabel')}
              type="time"
              error={errors.end?.message}
              {...register('end')}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={createSession.isPending}
            >
              {t('create.cancel')}
            </Button>
            <Button type="submit" isLoading={createSession.isPending}>
              {t('create.submit')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
