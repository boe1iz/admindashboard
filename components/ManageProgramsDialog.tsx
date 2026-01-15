'use client'

import { db } from '@/lib/firebase'
import { doc, updateDoc, arrayRemove } from 'firebase/firestore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { toast } from 'sonner'

interface Athlete {
  id: string
  name: string
  assignedPrograms?: string[]
}

interface ManageProgramsDialogProps {
  athlete: Athlete
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManageProgramsDialog({ athlete, open, onOpenChange }: ManageProgramsDialogProps) {
  const unassignProgram = async (programId: string) => {
    try {
      await updateDoc(doc(db, 'athletes', athlete.id), {
        assignedPrograms: arrayRemove(programId)
      })
      toast.success(`Unassigned ${programId}`)
    } catch (error) {
      console.error('Error unassigning program:', error)
      toast.error('Failed to unassign program')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Programs for {athlete.name}</DialogTitle>
          <DialogDescription>
            Assign or unassign training programs for this athlete.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Assigned Programs</h3>
            <div className="flex flex-wrap gap-2">
              {athlete.assignedPrograms && athlete.assignedPrograms.length > 0 ? (
                athlete.assignedPrograms.map(programId => (
                  <div key={programId} className="flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium group">
                    {programId}
                    <button 
                      onClick={() => unassignProgram(programId)}
                      className="hover:text-destructive transition-colors"
                      aria-label={`Unassign ${programId}`}
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">No programs assigned.</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
             <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Available Programs</h3>
             {/* Placeholder for searchable dropdown in next task */}
             <div className="h-10 w-full rounded-md border border-dashed border-muted-foreground/50 flex items-center justify-center text-xs text-muted-foreground">
               Searchable Program Selector Placeholder
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}