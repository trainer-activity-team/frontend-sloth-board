import { Logo } from '../Logo'
import { navItems } from '../../lib/nav'
import { NavItem } from './NavItem'
import { SidebarFooter } from './SidebarFooter'

export interface SidebarProps {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-surface">
      <div className="border-b border-border px-5 py-5">
        <Logo variant="compact" />
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            labelKey={item.labelKey}
            icon={item.icon}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
      <SidebarFooter />
    </aside>
  )
}
