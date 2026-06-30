import { z } from 'zod'
import type { TFunction } from 'i18next'

function isValidDateValue(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  return !Number.isNaN(new Date(`${value}T00:00:00.000Z`).getTime())
}

function isValidTimeValue(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
}

export function createSessionFormSchema(t: TFunction<'sessions'>) {
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
      subject: z.string(),
      classId: z.number().int().positive().optional(),
      contractId: z.number().int().positive().optional(),
      userId: z.number().int().positive().optional(),
      sessionTypeId: z.number().int().positive().optional(),
      timescaleId: z.number().int().positive().optional(),
      declarationReference: z.string(),
      declarationDate: z
        .string()
        .refine(
          (value) => value.length === 0 || isValidDateValue(value),
          t('validation.declarationDateInvalid'),
        ),
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

export type SessionFormValues = z.infer<ReturnType<typeof createSessionFormSchema>>
