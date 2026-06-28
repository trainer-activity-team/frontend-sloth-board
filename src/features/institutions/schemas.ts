import { z } from 'zod'
import type { TFunction } from 'i18next'

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/

export function createInstitutionFormSchema(t: TFunction<'institutions'>) {
  return z.object({
    name: z.string().min(1, t('validation.nameRequired')),
    address: z.string().min(1, t('validation.addressRequired')),
    color: z.string().regex(HEX_COLOR_REGEX, t('validation.colorInvalid')),
    requiresDeclaration: z.boolean(),
  })
}

export type InstitutionFormValues = z.infer<
  ReturnType<typeof createInstitutionFormSchema>
>
