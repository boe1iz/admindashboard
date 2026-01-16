'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Package, 
  ChevronRight,
  Menu,
  User as UserIcon,
  LogOut
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/AuthProvider'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { ChangePasswordDialog } from '@/components/ChangePasswordDialog'
import { ThemeToggle } from '@/components/ThemeToggle'

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Programs', href: '/programs', icon: BookOpen },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Inventory', href: '/inventory', icon: Package },
]

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [navOpen, setNavOpen] = React.useState(false)
  const [settingsOpen, setSettingsOpen] = React.useState(false)

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <div className="lg:hidden flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800 bg-card sticky top-0 z-30">
      <div className="flex items-center">
        <Sheet open={navOpen} onOpenChange={setNavOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="size-10 rounded-xl" aria-label="Open Menu">
              <Menu className="size-6 text-[#0057FF] dark:text-[#3B82F6]" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-card border-r border-slate-200 dark:border-slate-800">
            <SheetHeader className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
              <SheetTitle className="text-left">
                <span className="text-2xl font-black tracking-tighter text-[#0057FF] dark:text-[#3B82F6]">
                  ON3 ATHLETICS
                </span>
              </SheetTitle>
            </SheetHeader>
            
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setNavOpen(false)}
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
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>
        
        <div className="ml-4">
          <span className="text-lg font-black tracking-tighter text-[#0057FF] dark:text-[#3B82F6]">
            ON3 ATHLETICS
          </span>
        </div>
      </div>

      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="size-10 rounded-xl" aria-label="Open User Settings">
            <UserIcon className="size-6 text-[#0057FF] dark:text-[#3B82F6]" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[auto] max-h-[85vh] rounded-t-[30px] border-t border-slate-200 dark:border-slate-800 bg-card p-0 overflow-hidden">
          <div className="p-6">
            <SheetHeader className="mb-6 text-left">
              <SheetTitle className="text-xl font-black text-foreground uppercase tracking-tight">Coach Settings</SheetTitle>
              <SheetDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Manage your administrative session.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6">
              {user && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <UserIcon className="size-5 text-primary dark:text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Active Identity</p>
                      <p className="text-sm font-bold text-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <ChangePasswordDialog />
                    <Button 
                      variant="ghost" 
                      size="lg" 
                      onClick={handleLogout}
                      className="w-full justify-start h-12 rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/5 font-black uppercase tracking-widest text-[10px]"
                    >
                      <LogOut className="size-4 mr-3" />
                      Logout Session
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Visual Aesthetic</p>
                  <p className="text-sm font-bold text-foreground">Interface Theme</p>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}