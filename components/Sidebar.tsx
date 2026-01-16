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
import { AuthProvider, useAuth } from '@/components/AuthProvider'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChangePasswordDialog } from '@/components/ChangePasswordDialog'

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Programs', href: '/programs', icon: BookOpen },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Inventory', href: '/inventory', icon: Package },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
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

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

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
        {user && (
          <div className="px-2 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="size-4 text-primary dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Coach Access</p>
                <p className="text-[11px] font-bold text-foreground truncate">{user.email}</p>
              </div>
            </div>
            <div className="space-y-1">
              <ChangePasswordDialog />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="w-full justify-start h-9 rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/5 font-black uppercase tracking-widest text-[9px]"
              >
                <LogOut className="size-3.5 mr-2" />
                Logout Session
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between px-2">
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