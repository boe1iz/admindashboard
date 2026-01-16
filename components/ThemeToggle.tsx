'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="size-10" /> // Placeholder to avoid layout shift
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="size-10 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400 transition-all" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
