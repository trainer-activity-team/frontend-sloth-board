import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { useLogin } from '../hooks/useLogin'
import { createLoginSchema, type LoginFormValues } from '../schemas'

export function LoginForm() {
  const { t } = useTranslation('auth')
  const loginSchema = useMemo(() => createLoginSchema(t), [t])
  const { mutate, isPending } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit((data) => mutate(data))}
      noValidate
    >
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          {t('login.title')}
        </h1>
        <p className="text-sm text-muted">{t('login.subtitle')}</p>
      </div>

      <Input
        label={t('login.email')}
        type="email"
        autoComplete="email"
        placeholder={t('login.emailPlaceholder')}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label={t('login.password')}
        type="password"
        autoComplete="current-password"
        placeholder={t('login.passwordPlaceholder')}
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" className="w-full" isLoading={isPending}>
        {t('login.submit')}
      </Button>
    </form>
  )
}
