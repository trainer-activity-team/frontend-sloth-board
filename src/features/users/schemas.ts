import type { TFunction } from 'i18next'
import { z } from 'zod'

export function createProfileFormSchema(t: TFunction<'profile'>) {
  return z
    .object({
      firstName: z.string().min(1, t('validation.firstNameRequired')),
      lastName: z.string().min(1, t('validation.lastNameRequired')),
      email: z
        .string()
        .min(1, t('validation.emailRequired'))
        .email(t('validation.emailInvalid')),
      password: z
        .string()
        .refine(
          (value) => value === '' || value.length >= 8,
          t('validation.passwordMin'),
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordMismatch'),
      path: ['confirmPassword'],
    })
}

export type ProfileFormValues = z.infer<
  ReturnType<typeof createProfileFormSchema>
>
