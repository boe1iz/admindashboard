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
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Programs', href: '/programs', icon: BookOpen },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Inventory', href: '/inventory', icon: Package },
]

export function Sidebar() {
  const pathname = usePathname()
  const [version, setVersion] = useState<{ commitId: string } | null>(null)

  useEffect(() => {
    // Attempt to load version.json. If it fails, it will be handled by the catch block.
    // In some environments, top-level imports of missing files will fail the build.
    // Using a dynamic import inside useEffect is safer for build-time generated files.
    import('@/lib/version.json')
      .then((mod) => {
        if (mod.default && mod.default.commitId) {
          setVersion(mod.default);
        } else if (mod.commitId) {
          setVersion(mod as any);
        }
      })
      .catch(() => {
        // Silently fail if version.json is not yet generated
      });
  }, [])

  return (
    <div className="hidden lg:flex h-full w-64 flex-col bg-card border-r border-slate-200 dark:border-slate-800 z-20 shadow-sm transition-colors duration-300">
      <div className="flex h-20 items-center px-6">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <span className="text-2xl font-black tracking-tighter text-[#0057FF] dark:text-[#3B82F6]">
            ON3 ATHLETICS
          </span>
        </Link>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
          
          return (
            <motion.div
              key={item.name}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-black uppercase tracking-tight transition-all",
                  isActive 
                    ? "bg-[#0057FF] text-white shadow-lg shadow-[#0057FF]/20" 
                    : "text-slate-400 hover:text-[#0057FF] dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn(
                    "size-5 transition-transform",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-[#0057FF] dark:group-hover:text-blue-400"
                  )} />
                  {item.name}
                </div>
                {isActive && <ChevronRight className="size-4" />}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      <div className="border-t border-slate-100 dark:border-slate-800 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] text-slate-300 dark:text-slate-500 uppercase tracking-widest font-black">
              Admin Dashboard v2.0
            </div>
            {version && (
              <div className="text-[9px] text-slate-300 dark:text-slate-500 font-mono opacity-60">
                Commit: {version.commitId}
              </div>
            )}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}