import { z } from 'zod'
import type { TFunction } from 'i18next'

function isValidDateValue(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  return !Number.isNaN(new Date(`${value}T00:00:00.000Z`).getTime())
}

export function createContractFormSchema(t: TFunction<'contracts'>) {
  return z
    .object({
      institutionId: z
        .number()
        .int()
        .positive(t('validation.institutionRequired')),
      pricingModeId: z
        .number()
        .int()
        .positive(t('validation.pricingModeRequired')),
      contractNumber: z.string().min(1, t('validation.contractNumberRequired')),
      startDate: z
        .string()
        .min(1, t('validation.startDateRequired'))
        .refine(isValidDateValue, t('validation.startDateInvalid')),
      endDate: z
        .string()
        .min(1, t('validation.endDateRequired'))
        .refine(isValidDateValue, t('validation.endDateInvalid')),
      hourlyVolumePlanned: z
        .number()
        .min(0, t('validation.hourlyVolumePlannedMin')),
      unitPrice: z.number().min(0, t('validation.unitPriceMin')),
    })
    .refine(
      (values) =>
        !isValidDateValue(values.startDate) ||
        !isValidDateValue(values.endDate) ||
        values.endDate >= values.startDate,
      {
        message: t('validation.endDateAfterStart'),
        path: ['endDate'],
      },
    )
}

export type ContractFormValues = z.infer<
  ReturnType<typeof createContractFormSchema>
>
