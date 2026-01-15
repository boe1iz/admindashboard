'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, onSnapshot, doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { X, Search, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Athlete {
  id: string
  name: string
  assignedPrograms?: string[]
}

interface Program {
  id: string
  name: string
  isArchived: boolean
}

interface ManageProgramsDialogProps {
  athlete: Athlete
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManageProgramsDialog({ athlete, open, onOpenChange }: ManageProgramsDialogProps) {
  const [programs, setPrograms] = useState<Program[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!open) return

    const q = query(collection(db, 'programs'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const programsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Program[]
      setPrograms(programsData.filter(p => !p.isArchived))
    })

    return () => unsubscribe()
  }, [open])

  const assignProgram = async (programId: string, programName: string) => {
    try {
      await updateDoc(doc(db, 'athletes', athlete.id), {
        assignedPrograms: arrayUnion(programId)
      })
      toast.success(`Assigned ${programName}`)
    } catch (error) {
      console.error('Error assigning program:', error)
      toast.error('Failed to assign program')
    }
  }

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

  const availablePrograms = programs.filter(p => 
    !athlete.assignedPrograms?.includes(p.id) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                athlete.assignedPrograms.map(programId => {
                  const programName = programs.find(p => p.id === programId)?.name || programId
                  return (
                    <div key={programId} className="flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium group">
                      {programName}
                      <button 
                        onClick={() => unassignProgram(programId)}
                        className="hover:text-destructive transition-colors"
                        aria-label={`Unassign ${programName}`}
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-muted-foreground italic">No programs assigned.</p>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
             <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Available Programs</h3>
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
               <Input 
                 placeholder="Search programs..." 
                 className="pl-9"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
             
             <div className="max-h-[200px] overflow-y-auto space-y-1 border rounded-md p-1">
               {availablePrograms.length > 0 ? (
                 availablePrograms.map(program => (
                   <div key={program.id} className="flex items-center justify-between p-2 hover:bg-accent rounded-sm group transition-colors">
                     <span className="text-sm font-medium">{program.name}</span>
                     <Button 
                       size="sm" 
                       variant="ghost" 
                       className="h-8 gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                       onClick={() => assignProgram(program.id, program.name)}
                       aria-label={`Assign ${program.name}`}
                     >
                       <Plus className="size-3" />
                       Assign
                     </Button>
                   </div>
                 ))
               ) : (
                 <p className="text-xs text-muted-foreground p-4 text-center">No available programs found.</p>
               )}
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
