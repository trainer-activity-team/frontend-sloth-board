import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Loader } from '../../../components/ui/Loader'
import { ROUTES } from '../../../lib/routes'
import { useInstitutions } from '../../institutions/hooks/useInstitutions'
import { useUsers } from '../../users/hooks/useUsers'
import { useCreateClass } from '../hooks/useCreateClass'
import { useDeleteClass } from '../hooks/useDeleteClass'
import { useUpdateClass } from '../hooks/useUpdateClass'
import { createClassFormSchema, type ClassFormValues } from '../schemas'
import type { SchoolClass } from '../types'

const selectClassName =
  'w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60'

export interface ClassFormProps {
  mode: 'create' | 'edit'
  schoolClass?: SchoolClass
}

export function ClassForm({ mode, schoolClass }: ClassFormProps) {
  const { t } = useTranslation('classes')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { data: institutions, isPending: isInstitutionsPending } =
    useInstitutions()
  const { data: users, isPending: isUsersPending } = useUsers()

  const schema = useMemo(() => createClassFormSchema(t), [t])

  const defaultValues: ClassFormValues = {
    name: schoolClass?.name ?? '',
    classLevel: schoolClass?.classLevel ?? '',
    studentCount: schoolClass?.studentCount ?? 0,
    institutionId: schoolClass?.institutionId ?? 0,
    teacherId: schoolClass?.teacherId ?? 0,
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const { mutate: createMutate, isPending: isCreating } = useCreateClass()
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateClass()
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteClass()

  const isPending = isCreating || isUpdating
  const selectsLoading = isInstitutionsPending || isUsersPending

  const onSubmit = (values: ClassFormValues) => {
    if (mode === 'create') {
      createMutate(values)
      return
    }

    if (schoolClass) {
      updateMutate({ id: schoolClass.id, data: values })
    }
  }

  const handleDelete = () => {
    if (schoolClass) {
      deleteMutate(schoolClass.id)
    }
  }

  if (selectsLoading) {
    return <Loader />
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
            label={t('form.nameLabel')}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label={t('form.classLevelLabel')}
            error={errors.classLevel?.message}
            {...register('classLevel')}
          />

          <Input
            label={t('form.studentCountLabel')}
            type="number"
            min={0}
            error={errors.studentCount?.message}
            {...register('studentCount', { valueAsNumber: true })}
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="institutionId"
              className="text-sm uppercase tracking-wide text-muted"
            >
              {t('form.institutionLabel')}
            </label>
            <Controller
              name="institutionId"
              control={control}
              render={({ field }) => (
                <select
                  id="institutionId"
                  value={field.value || ''}
                  onChange={(event) =>
                    field.onChange(Number.parseInt(event.target.value, 10))
                  }
                  disabled={selectsLoading}
                  className={`${selectClassName} ${errors.institutionId ? 'border-danger focus:border-danger focus:ring-danger' : ''}`}
                >
                  <option value="">{t('form.institutionPlaceholder')}</option>
                  {institutions?.map((institution) => (
                    <option key={institution.id} value={institution.id}>
                      {institution.name}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.institutionId ? (
              <p className="text-sm text-danger">{errors.institutionId.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="teacherId"
              className="text-sm uppercase tracking-wide text-muted"
            >
              {t('form.teacherLabel')}
            </label>
            <Controller
              name="teacherId"
              control={control}
              render={({ field }) => (
                <select
                  id="teacherId"
                  value={field.value || ''}
                  onChange={(event) =>
                    field.onChange(Number.parseInt(event.target.value, 10))
                  }
                  disabled={selectsLoading}
                  className={`${selectClassName} ${errors.teacherId ? 'border-danger focus:border-danger focus:ring-danger' : ''}`}
                >
                  <option value="">{t('form.teacherPlaceholder')}</option>
                  {users?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.teacherId ? (
              <p className="text-sm text-danger">{errors.teacherId.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link to={ROUTES.CLASSES}>
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

      {mode === 'edit' && schoolClass ? (
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
