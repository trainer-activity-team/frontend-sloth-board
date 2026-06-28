import { z } from 'zod'
import type { TFunction } from 'i18next'

export function createClassFormSchema(t: TFunction<'classes'>) {
  return z.object({
    institutionId: z
      .number()
      .int()
      .positive(t('validation.institutionRequired')),
    classLevel: z.string().min(1, t('validation.classLevelRequired')),
    studentCount: z
      .number()
      .int()
      .min(0, t('validation.studentCountMin')),
    name: z.string().min(1, t('validation.nameRequired')),
    teacherId: z.number().int().positive(t('validation.teacherRequired')),
  })
}

export type ClassFormValues = z.infer<ReturnType<typeof createClassFormSchema>>
