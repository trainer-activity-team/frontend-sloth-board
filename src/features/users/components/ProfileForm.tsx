import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { useUpdateUser } from '../hooks/useUpdateUser'
import {
  createProfileFormSchema,
  type ProfileFormValues,
} from '../schemas'
import type { User } from '../types'

export interface ProfileFormProps {
  user: User
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { t } = useTranslation('profile')

  const schema = useMemo(() => createProfileFormSchema(t), [t])

  const defaultValues: ProfileFormValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: '',
    confirmPassword: '',
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const { mutate, isPending } = useUpdateUser()

  const onSubmit = (values: ProfileFormValues) => {
    mutate({ id: user.id, data: values })
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
            label={t('form.firstNameLabel')}
            error={errors.firstName?.message}
            autoComplete="given-name"
            {...register('firstName')}
          />

          <Input
            label={t('form.lastNameLabel')}
            error={errors.lastName?.message}
            autoComplete="family-name"
            {...register('lastName')}
          />

          <Input
            label={t('form.emailLabel')}
            type="email"
            error={errors.email?.message}
            autoComplete="email"
            {...register('email')}
          />

          <div>
            <Input
              label={t('form.passwordLabel')}
              type="password"
              error={errors.password?.message}
              autoComplete="new-password"
              {...register('password')}
            />
            <p className="mt-1.5 text-sm text-muted">{t('form.passwordHint')}</p>
            <div className="mt-4">
              <Input
                label={t('form.confirmPasswordLabel')}
                type="password"
                error={errors.confirmPassword?.message}
                autoComplete="new-password"
                {...register('confirmPassword')}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" isLoading={isPending} className="w-full sm:w-auto">
              {t('form.submitUpdate')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
