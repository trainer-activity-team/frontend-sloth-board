import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '../components/AppLayout'
import { AuthLayout } from '../components/AuthLayout'
import { ROUTES } from '../lib/routes'
import { ClassFormPage } from '../pages/ClassFormPage'
import { ClassesPage } from '../pages/ClassesPage'
import { ContractFormPage } from '../pages/ContractFormPage'
import { ContractsPage } from '../pages/ContractsPage'
import { DashboardPage } from '../pages/DashboardPage'
import { InstitutionFormPage } from '../pages/InstitutionFormPage'
import { InstitutionsPage } from '../pages/InstitutionsPage'
import { LoginPage } from '../pages/LoginPage'
import { ProfilePage } from '../pages/ProfilePage'
import { RegisterPage } from '../pages/RegisterPage'
import { GuestRoute } from './GuestRoute'
import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.LOGIN, element: <LoginPage /> },
          { path: ROUTES.REGISTER, element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
          { path: ROUTES.INSTITUTIONS, element: <InstitutionsPage /> },
          { path: ROUTES.INSTITUTION_NEW, element: <InstitutionFormPage /> },
          { path: ROUTES.INSTITUTION_DETAIL, element: <InstitutionFormPage /> },
          { path: ROUTES.CLASSES, element: <ClassesPage /> },
          { path: ROUTES.CLASS_NEW, element: <ClassFormPage /> },
          { path: ROUTES.CLASS_DETAIL, element: <ClassFormPage /> },
          { path: ROUTES.CONTRACTS, element: <ContractsPage /> },
          { path: ROUTES.CONTRACT_NEW, element: <ContractFormPage /> },
          { path: ROUTES.CONTRACT_DETAIL, element: <ContractFormPage /> },
          { path: ROUTES.PROFILE, element: <ProfilePage /> },
          { path: '/', element: <Navigate to={ROUTES.DASHBOARD} replace /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to={ROUTES.DASHBOARD} replace /> },
])
