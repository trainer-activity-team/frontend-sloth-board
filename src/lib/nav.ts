import { FiBookOpen, FiBriefcase, FiGrid } from 'react-icons/fi'
import { ROUTES } from './routes'

export const navItems = [
  {
    to: ROUTES.DASHBOARD,
    labelKey: 'nav.dashboard',
    icon: FiGrid,
  },
  {
    to: ROUTES.INSTITUTIONS,
    labelKey: 'nav.institutions',
    icon: FiBriefcase,
  },
  {
    to: ROUTES.CLASSES,
    labelKey: 'nav.classes',
    icon: FiBookOpen,
  },
] as const
