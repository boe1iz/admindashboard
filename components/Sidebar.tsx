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
    <div className="flex h-full w-64 flex-col bg-[#0F172A] text-white">
      <div className="flex h-20 items-center px-6">
        <span className="text-2xl font-black tracking-tighter text-[#0057FF]">
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
                "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-white/5",
                isActive ? "bg-[#0057FF] text-white hover:bg-[#0057FF]/90" : "text-zinc-400"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "size-5",
                  isActive ? "text-white" : "text-zinc-500 group-hover:text-white"
                )} />
                {item.name}
              </div>
              {isActive && <ChevronRight className="size-4" />}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/5 p-4 text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
        Admin Dashboard v2.0
      </div>
    </div>
  )
}
