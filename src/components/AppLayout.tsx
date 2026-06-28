import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AppHeader } from './layout/AppHeader'
import { Sidebar } from './layout/Sidebar'

export function AppLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const closeMobileSidebar = () => setIsMobileSidebarOpen(false)

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden min-h-screen lg:block">
        <Sidebar />
      </div>

      {isMobileSidebarOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/20"
            onClick={closeMobileSidebar}
            aria-label="Close menu"
          />
          <div className="relative z-50 h-full w-64 shadow-lg">
            <Sidebar onNavigate={closeMobileSidebar} />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col bg-background">
        <AppHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
