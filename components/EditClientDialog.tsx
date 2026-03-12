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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface Client {
  id: string
  name: string
  email: string
  notes?: string
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
  const [formData, setFormData] = useState({
    name: client.name,
    notes: client.notes || ''
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
      toast.success("Client profile updated")
    } catch (error) {
      console.error('Error updating client: ', error)
      toast.error("Failed to update client")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[95vw] rounded-[30px] border-slate-200 dark:border-slate-800 bg-card p-0 overflow-hidden">
        <div className="p-6 md:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black text-foreground uppercase tracking-tight">Edit Profile</DialogTitle>
            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Update the dashboard profile for {client.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Full Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 focus-visible:ring-[#0057FF]"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Email Address (Managed by Auth)</Label>
                <Input
                  value={client.email}
                  disabled
                  className="h-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 px-4 opacity-50 cursor-not-allowed"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-notes" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Additional Info / Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Injuries, goals, or specific requirements..."
                  className="min-h-[100px] rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 focus-visible:ring-[#0057FF] resize-none"
                />
              </div>
            </div>
            <DialogFooter className="mt-8">
              <Button type="submit" disabled={loading} className="w-full rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-xs h-14 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
                {loading ? 'Saving...' : 'Update Profile'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
