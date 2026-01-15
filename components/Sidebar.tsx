'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Package, 
  ChevronRight 
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Programs', href: '/programs', icon: BookOpen },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Inventory', href: '/inventory', icon: Package },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-card/40 border-r border-white/5 glass-dark z-20">
      <div className="flex h-20 items-center px-6">
        <span className="text-2xl font-black tracking-tighter text-primary drop-shadow-[0_0_10px_rgba(0,87,255,0.3)]">
          13CONCEPT
        </span>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-black uppercase tracking-tight transition-all",
                isActive 
                  ? "bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "size-5 transition-transform group-hover:scale-110",
                  isActive ? "text-white" : "text-zinc-600 group-hover:text-primary"
                )} />
                {item.name}
              </div>
              {isActive && <ChevronRight className="size-4" />}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/5 p-4 text-[10px] text-zinc-700 uppercase tracking-widest font-black">
        Admin Dashboard v2.0
      </div>
    </div>
  )
}
