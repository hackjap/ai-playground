import { Outlet, useLocation, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, PieChart, List, Settings, Target } from 'lucide-react'

const Navigation = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: '홈' },
    { path: '/goals', icon: Target, label: '목표' },
    { path: '/budget', icon: PieChart, label: '예산' },
    { path: '/expenses', icon: List, label: '내역' },
    { path: '/settings', icon: Settings, label: '설정' },
  ]

  // 온보딩 페이지에서는 네비게이션 숨기기
  const hideNavigation = location.pathname === '/' || location.pathname.startsWith('/onboarding')

  if (hideNavigation) {
    return <Outlet />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content */}
      <main className="pb-16">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-area-bottom">
        <div className="flex justify-around items-center py-2 px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/goals' && location.pathname.startsWith('/goals'))
            const Icon = item.icon
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center space-y-1 py-2 px-3 h-auto touch-target ${
                    isActive 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default Navigation