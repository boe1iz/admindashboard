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
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { MultiSelectCombobox } from './ui/multi-select-combobox'
import { useEquipment } from '@/hooks/useEquipment'
import { useMediaQuery } from '@/hooks/use-media-query'

interface EditWorkoutDialogProps {
  programId: string
  dayId: string
  workout: {
    id: string
    title: string
    instructions: string
    video_url?: string
    equipment_ids?: string[]
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditWorkoutDialog({ programId, dayId, workout, open, onOpenChange }: EditWorkoutDialogProps) {
  const [loading, setLoading] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { equipment } = useEquipment()
  const [formData, setFormData] = useState({
    title: workout.title,
    instructions: workout.instructions,
    video_url: workout.video_url || '',
    equipmentIds: workout.equipment_ids || []
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateDoc(doc(db, 'programs', programId, 'days', dayId, 'workouts', workout.id), {
        title: formData.title,
        instructions: formData.instructions,
        video_url: formData.video_url,
        equipment_ids: formData.equipmentIds,
        updatedAt: serverTimestamp()
      })
      onOpenChange(false)
      toast.success("Workout updated")
    } catch (error) {
      console.error('Error updating workout: ', error)
      toast.error("Failed to update workout")
    } finally {
      setLoading(false)
    }
  }

  const content = (
    <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-y-auto">
      <div className="grid gap-4 py-4 flex-1">
        <div className="grid gap-2">
          <Label htmlFor="edit-workout-title" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Workout Title</Label>
          <Input
            id="edit-workout-title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="rounded-xl border-slate-200 dark:border-slate-800 bg-background"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="edit-equipment" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Equipment</Label>
          <MultiSelectCombobox
            options={equipment}
            selected={formData.equipmentIds}
            onChange={(ids) => setFormData({ ...formData, equipmentIds: ids })}
            placeholder="Select equipment..."
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="edit-workout-instructions" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Instructions</Label>
          <Textarea
            id="edit-workout-instructions"
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            required
            className="rounded-xl border-slate-200 dark:border-slate-800 bg-background min-h-[100px]"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="edit-video-url" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Video Link</Label>
          <Input
            id="edit-video-url"
            value={formData.video_url}
            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
            placeholder="https://..."
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[95vw] rounded-[30px] border-slate-200 dark:border-slate-800 bg-card p-0 overflow-hidden">
        <div className="p-6 md:p-8 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black text-foreground uppercase tracking-tight">Edit Workout</DialogTitle>
            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Update the title, instructions, or video link for this exercise.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-workout-title" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Workout Title</Label>
                <Input
                  id="edit-workout-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="h-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 focus-visible:ring-[#0057FF]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-equipment" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Equipment</Label>
                <MultiSelectCombobox
                  options={equipment}
                  selected={formData.equipmentIds}
                  onChange={(ids) => setFormData({ ...formData, equipmentIds: ids })}
                  placeholder="Select equipment..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-workout-instructions" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Instructions</Label>
                <Textarea
                  id="edit-workout-instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  required
                  className="rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 focus-visible:ring-[#0057FF] min-h-[100px]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-video-url" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Video Link</Label>
                <Input
                  id="edit-video-url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://..."
                  className="h-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 focus-visible:ring-[#0057FF]"
                />
              </div>
            </div>
            <DialogFooter className="mt-8">
              <Button type="submit" disabled={loading} className="w-full rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-xs h-14 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

