import { ROUTES } from '../lib/routes'

export function resolvePageTitleKey(pathname: string): string {
  if (pathname === ROUTES.INSTITUTIONS) {
    return 'pages.institutions'
  }

  if (pathname === ROUTES.INSTITUTION_NEW) {
    return 'pages.institutionNew'
  }

  if (pathname.startsWith(`${ROUTES.INSTITUTIONS}/`)) {
    return 'pages.institutionEdit'
  }

  if (pathname === ROUTES.CLASSES) {
    return 'pages.classes'
  }

  if (pathname === ROUTES.CLASS_NEW) {
    return 'pages.classNew'
  }

  if (pathname.startsWith(`${ROUTES.CLASSES}/`)) {
    return 'pages.classEdit'
  }

  if (pathname === ROUTES.DASHBOARD) {
    return 'pages.dashboard'
  }

  if (pathname === ROUTES.PROFILE) {
    return 'pages.profile'
  }

  return 'pages.dashboard'
}
