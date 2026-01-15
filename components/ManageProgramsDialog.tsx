'use client'

import { useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, doc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore'
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

interface Client {
  id: string
  name: string
  is_active: boolean
}

interface Program {
  id: string
  name: string
  isArchived: boolean
}

interface Assignment {
  id: string
  athleteId: string
  programId: string
}

interface ManageProgramsDialogProps {
  athlete: Client
  programs: Program[]
  assignments: Assignment[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManageProgramsDialog({ athlete, programs, assignments, open, onOpenChange }: ManageProgramsDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const activePrograms = programs.filter(p => !p.isArchived)
  const clientAssignments = assignments.filter(a => a.athleteId === athlete.id)

  const assignProgram = async (programId: string, programName: string) => {
    setIsProcessing(true)
    try {
      await addDoc(collection(db, 'assignments'), {
        athleteId: athlete.id,
        programId: programId,
        assigned_at: serverTimestamp(),
        current_day_number: 1
      })
      toast.success(`Assigned ${programName}`)
    } catch (error) {
      console.error('Error assigning program:', error)
      toast.error('Failed to assign program')
    } finally {
      setIsProcessing(false)
    }
  }

  const unassignProgram = async (assignmentId: string, programName: string) => {
    setIsProcessing(true)
    try {
      await deleteDoc(doc(db, 'assignments', assignmentId))
      toast.success(`Unassigned ${programName}`)
    } catch (error) {
      console.error('Error unassigning program:', error)
      toast.error('Failed to unassign program')
    } finally {
      setIsProcessing(false)
    }
  }

  const availablePrograms = activePrograms.filter(p => 
    !clientAssignments.some(a => a.programId === p.id) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[500px] transition-all ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
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
              {clientAssignments.length > 0 ? (
                clientAssignments.map(assignment => {
                  const programName = programs.find(p => p.id === assignment.programId)?.name || assignment.programId
                  return (
                    <div key={assignment.id} className="flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium group">
                      {programName}
                      <button 
                        onClick={() => unassignProgram(assignment.id, programName)}
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
                 disabled={isProcessing}
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
                       disabled={isProcessing}
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
