import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Checkbox } from '../../../components/ui/Checkbox'
import { ColorInput } from '../../../components/ui/ColorInput'
import { Input } from '../../../components/ui/Input'
import { ROUTES } from '../../../lib/routes'
import { useCreateInstitution } from '../hooks/useCreateInstitution'
import { useDeleteInstitution } from '../hooks/useDeleteInstitution'
import { useUpdateInstitution } from '../hooks/useUpdateInstitution'
import {
  createInstitutionFormSchema,
  type InstitutionFormValues,
} from '../schemas'
import {
  DEFAULT_INSTITUTION_COLOR,
  type Institution,
} from '../types'

export interface InstitutionFormProps {
  mode: 'create' | 'edit'
  institution?: Institution
}

export function InstitutionForm({ mode, institution }: InstitutionFormProps) {
  const { t } = useTranslation('institutions')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const schema = useMemo(() => createInstitutionFormSchema(t), [t])

  const defaultValues: InstitutionFormValues = {
    name: institution?.name ?? '',
    address: institution?.address ?? '',
    color: institution?.color ?? DEFAULT_INSTITUTION_COLOR,
    requiresDeclaration: institution?.requiresDeclaration ?? false,
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InstitutionFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const { mutate: createMutate, isPending: isCreating } = useCreateInstitution()
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateInstitution()
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteInstitution()

  const isPending = isCreating || isUpdating

  const onSubmit = (values: InstitutionFormValues) => {
    if (mode === 'create') {
      createMutate(values)
      return
    }

    if (institution) {
      updateMutate({ id: institution.id, data: values })
    }
  }

  const handleDelete = () => {
    if (institution) {
      deleteMutate(institution.id)
    }
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
            label={t('form.addressLabel')}
            error={errors.address?.message}
            {...register('address')}
          />

          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <ColorInput
                label={t('form.colorLabel')}
                value={field.value}
                onChange={field.onChange}
                error={errors.color?.message}
                name={field.name}
              />
            )}
          />

          <Checkbox
            label={t('form.requiresDeclarationLabel')}
            error={errors.requiresDeclaration?.message}
            {...register('requiresDeclaration')}
          />

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link to={ROUTES.INSTITUTIONS}>
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

      {mode === 'edit' && institution ? (
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
