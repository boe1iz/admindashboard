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
  Menu
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Programs', href: '/programs', icon: BookOpen },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Inventory', href: '/inventory', icon: Package },
]

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  return (
    <div className="lg:hidden flex items-center h-16 px-4 border-b border-slate-200 dark:border-slate-800 bg-card sticky top-0 z-30">
      <Sheet open={open} onOpenChange={setOpen}>
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
                  onClick={() => setOpen(false)}
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
  )
}