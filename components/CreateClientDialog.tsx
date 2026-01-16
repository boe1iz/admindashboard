'use client'

import { useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { logActivity } from '@/lib/activity'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { useMediaQuery } from '@/hooks/use-media-query'

export function CreateClientDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addDoc(collection(db, 'clients'), {
        ...formData,
        is_active: true,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      })
      await logActivity({
        type: 'onboarded',
        client_name: formData.name
      })
      setOpen(false)
      setFormData({ name: '', email: '' })
      toast.success("Client onboarded successfully")
    } catch (error) {
      console.error('Error adding client: ', error)
      toast.error("Failed to onboard client")
    } finally {
      setLoading(false)
    }
  }

  const content = (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="grid gap-4 py-4 flex-1">
        <div className="grid gap-2">
          <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. John Doe"
            required
            className="rounded-xl border-slate-200 dark:border-slate-800 bg-background"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
            required
            className="rounded-xl border-slate-200 dark:border-slate-800 bg-background"
          />
        </div>
      </div>
      <div className="mt-auto pt-6">
        <Button type="submit" disabled={loading} className="w-full rounded-full bg-primary font-black uppercase tracking-widest text-xs h-12 shadow-lg shadow-primary/20">
          {loading ? 'Onboarding...' : 'Onboard Client'}
        </Button>
      </div>
    </form>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-full h-10 px-6 font-black uppercase tracking-widest text-[10px]">
          <UserPlus className="size-4" />
          Onboard Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-[95vw] rounded-[30px] border-slate-200 dark:border-slate-800 bg-card p-0 overflow-hidden">
        <div className="p-6 md:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black text-foreground uppercase tracking-tight">Onboard Client</DialogTitle>
            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Create a new client profile and add them to the roster.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  required
                  className="h-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 focus-visible:ring-[#0057FF]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                  className="h-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 focus-visible:ring-[#0057FF]"
                />
              </div>
            </div>
            <DialogFooter className="mt-8">
              <Button type="submit" disabled={loading} className="w-full rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-xs h-14 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
                {loading ? 'Onboarding...' : 'Onboard Client'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

