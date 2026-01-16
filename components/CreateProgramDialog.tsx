'use client'

import { useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
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
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useMediaQuery } from '@/hooks/use-media-query'

export function CreateProgramDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '0'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addDoc(collection(db, 'programs'), {
        ...formData,
        price: parseFloat(formData.price),
        isArchived: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      setOpen(false)
      setFormData({ name: '', description: '', price: '0' })
      toast.success("Program created successfully")
    } catch (error) {
      console.error('Error adding program: ', error)
      toast.error("Failed to create program")
    } finally {
      setLoading(false)
    }
  }

  const content = (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="grid gap-4 py-4 flex-1">
        <div className="grid gap-2">
          <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Program Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Elite Strength Phase 1"
            required
            className="rounded-xl border-slate-200 dark:border-slate-800 bg-background"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief overview of the program"
            required
            className="rounded-xl border-slate-200 dark:border-slate-800 bg-background min-h-[100px]"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Price ($)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0 for free"
            required
            className="rounded-xl border-slate-200 dark:border-slate-800 bg-background"
          />
        </div>
      </div>
      <div className="mt-auto pt-6">
        <Button type="submit" disabled={loading} className="w-full rounded-full bg-primary font-black uppercase tracking-widest text-xs h-12 shadow-lg shadow-primary/20">
          {loading ? 'Creating...' : 'Create Program'}
        </Button>
      </div>
    </form>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-full h-10 px-6 font-black uppercase tracking-widest text-[10px]">
          <Plus className="size-4" />
          New Program
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-[95vw] rounded-[30px] border-slate-200 dark:border-slate-800 bg-card p-0 overflow-hidden">
        <div className="p-6 md:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black text-foreground uppercase tracking-tight">Create Program</DialogTitle>
            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Add a new training program to the operational roster.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Program Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Elite Strength Phase 1"
                  required
                  className="h-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 focus-visible:ring-[#0057FF]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief overview of the program"
                  required
                  className="rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 focus-visible:ring-[#0057FF] min-h-[100px]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0 for free"
                  required
                  className="h-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 focus-visible:ring-[#0057FF]"
                />
              </div>
            </div>
            <DialogFooter className="mt-8">
              <Button type="submit" disabled={loading} className="w-full rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-xs h-14 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
                {loading ? 'Creating...' : 'Create Program'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

