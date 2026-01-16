'use client'

import { useState } from 'react'
import { db } from '@/lib/firebase'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useMediaQuery } from '@/hooks/use-media-query'

interface Client {
  id: string
  name: string
  email: string
}

export function EditClientDialog({ 
  client, 
  open, 
  onOpenChange 
}: { 
  client: Client
  open: boolean
  onOpenChange: (open: boolean) => void 
}) {
  const [loading, setLoading] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [formData, setFormData] = useState({
    name: client.name,
    email: client.email
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateDoc(doc(db, 'clients', client.id), {
        ...formData,
        updated_at: serverTimestamp()
      })
      onOpenChange(false)
      toast.success("Client details updated")
    } catch (error) {
      console.error('Error updating client: ', error)
      toast.error("Failed to update client")
    } finally {
      setLoading(false)
    }
  }

  const content = (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="grid gap-4 py-4 flex-1">
        <div className="grid gap-2">
          <Label htmlFor="edit-name" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Full Name</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="rounded-xl border-slate-200 dark:border-slate-800 bg-background"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="edit-email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Email Address</Label>
          <Input
            id="edit-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="rounded-xl border-slate-200 dark:border-slate-800 bg-background"
          />
        </div>
      </div>
      <div className="mt-auto pt-6">
        <Button type="submit" disabled={loading} className="w-full rounded-full bg-primary font-black uppercase tracking-widest text-xs h-12 shadow-lg shadow-primary/20">
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] rounded-[30px] border-slate-200 dark:border-slate-800 bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-foreground uppercase tracking-tight">Edit Client Details</DialogTitle>
            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Update the profile information for {client.name}.
            </DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-[30px] border-t border-slate-200 dark:border-slate-800 bg-card">
        <SheetHeader>
          <SheetTitle className="text-xl font-black text-foreground uppercase tracking-tight">Edit Client Details</SheetTitle>
          <SheetDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Update the profile information for {client.name}.
          </SheetDescription>
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  )
}

