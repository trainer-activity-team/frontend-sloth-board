import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { ErrorMessage } from '../../../components/ui/ErrorMessage'
import { Input } from '../../../components/ui/Input'
import { Loader } from '../../../components/ui/Loader'
import { ROUTES } from '../../../lib/routes'
import { useInstitutions } from '../../institutions/hooks/useInstitutions'
import { createContractFormSchema, type ContractFormValues } from '../schemas'
import { useCreateContract } from '../hooks/useCreateContract'
import { useDeleteContract } from '../hooks/useDeleteContract'
import { usePricingModes } from '../hooks/usePricingModes'
import { useUpdateContract } from '../hooks/useUpdateContract'
import type { Contract } from '../types'

const selectClassName =
  'w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60'

export interface ContractFormProps {
  mode: 'create' | 'edit'
  contract?: Contract
}

function toDateInputValue(value: string | undefined): string {
  if (!value) {
    return ''
  }

  return value.slice(0, 10)
}

function toNumberValue(value: string | undefined): number {
  if (!value) {
    return 0
  }

  const parsed = Number.parseFloat(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

export function ContractForm({ mode, contract }: ContractFormProps) {
  const { t } = useTranslation('contracts')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const {
    data: institutions,
    isPending: isInstitutionsPending,
    isError: isInstitutionsError,
    error: institutionsError,
    refetch: refetchInstitutions,
  } = useInstitutions()
  const {
    data: pricingModes,
    isPending: isPricingModesPending,
    isError: isPricingModesError,
    error: pricingModesError,
    refetch: refetchPricingModes,
  } = usePricingModes()

  const schema = useMemo(() => createContractFormSchema(t), [t])

  const defaultValues: ContractFormValues = {
    institutionId: contract?.institutionId ?? 0,
    pricingModeId: contract?.pricingModeId ?? 0,
    contractNumber: contract?.contractNumber ?? '',
    startDate: toDateInputValue(contract?.startDate),
    endDate: toDateInputValue(contract?.endDate),
    hourlyVolumePlanned: toNumberValue(contract?.hourlyVolumePlanned),
    unitPrice: toNumberValue(contract?.unitPrice),
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ContractFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const { mutate: createMutate, isPending: isCreating } = useCreateContract()
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateContract()
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteContract()

  const isPending = isCreating || isUpdating
  const selectsLoading = isInstitutionsPending || isPricingModesPending
  const selectsError = isInstitutionsError || isPricingModesError

  const onSubmit = (values: ContractFormValues) => {
    if (mode === 'create') {
      createMutate(values)
      return
    }

    if (contract) {
      updateMutate({ id: contract.id, data: values })
    }
  }

  const handleDelete = () => {
    if (contract) {
      deleteMutate(contract.id)
    }
  }

  if (selectsLoading) {
    return <Loader />
  }

  if (selectsError) {
    return (
      <ErrorMessage
        error={institutionsError ?? pricingModesError}
        fallbackMessage={t('errors.loadOptionsFailed')}
        onRetry={() => {
          void refetchInstitutions()
          void refetchPricingModes()
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
          <div className="grid gap-5 md:grid-cols-2">
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
                      field.onChange(
                        event.target.value
                          ? Number.parseInt(event.target.value, 10)
                          : 0,
                      )
                    }
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
                <p className="text-sm text-danger">
                  {errors.institutionId.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="pricingModeId"
                className="text-sm uppercase tracking-wide text-muted"
              >
                {t('form.pricingModeLabel')}
              </label>
              <Controller
                name="pricingModeId"
                control={control}
                render={({ field }) => (
                  <select
                    id="pricingModeId"
                    value={field.value || ''}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value
                          ? Number.parseInt(event.target.value, 10)
                          : 0,
                      )
                    }
                    className={`${selectClassName} ${errors.pricingModeId ? 'border-danger focus:border-danger focus:ring-danger' : ''}`}
                  >
                    <option value="">{t('form.pricingModePlaceholder')}</option>
                    {pricingModes?.map((pricingMode) => (
                      <option key={pricingMode.id} value={pricingMode.id}>
                        {pricingMode.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.pricingModeId ? (
                <p className="text-sm text-danger">
                  {errors.pricingModeId.message}
                </p>
              ) : null}
            </div>
          </div>

          <Input
            label={t('form.contractNumberLabel')}
            error={errors.contractNumber?.message}
            {...register('contractNumber')}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label={t('form.startDateLabel')}
              type="date"
              error={errors.startDate?.message}
              {...register('startDate')}
            />

            <Input
              label={t('form.endDateLabel')}
              type="date"
              error={errors.endDate?.message}
              {...register('endDate')}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label={t('form.hourlyVolumePlannedLabel')}
              type="number"
              min={0}
              step="0.01"
              error={errors.hourlyVolumePlanned?.message}
              {...register('hourlyVolumePlanned', { valueAsNumber: true })}
            />

            <Input
              label={t('form.unitPriceLabel')}
              type="number"
              min={0}
              step="0.01"
              error={errors.unitPrice?.message}
              {...register('unitPrice', { valueAsNumber: true })}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link to={ROUTES.CONTRACTS}>
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

      {mode === 'edit' && contract ? (
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
