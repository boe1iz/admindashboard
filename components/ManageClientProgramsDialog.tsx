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
import { logActivity } from '@/lib/activity'

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
  clientId?: string
  client_id?: string
  programId?: string
  program_id?: string
}

interface ManageClientProgramsDialogProps {
  client: Client
  programs: Program[]
  assignments: Assignment[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManageClientProgramsDialog({ client, programs, assignments, open, onOpenChange }: ManageClientProgramsDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const activePrograms = programs.filter(p => !p.isArchived)
  const clientAssignments = assignments.filter(a => 
    (a.clientId === client.id) || 
    (a.client_id === client.id) || 
    (a.client_id === client.id)
  )

  const assignProgram = async (programId: string, programName: string) => {
    setIsProcessing(true)
    try {
      await addDoc(collection(db, 'assignments'), {
        client_id: client.id,
        client_name: client.name,
        program_id: programId,
        program_name: programName,
        assigned_at: serverTimestamp(),
        current_day_number: 1
      })
      await logActivity({
        type: 'assignment',
        client_name: client.name,
        program_name: programName
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
      await logActivity({
        type: 'unassigned',
        client_name: client.name,
        program_name: programName
      })
      toast.success(`Unassigned ${programName}`)
    } catch (error) {
      console.error('Error unassigning program:', error)
      toast.error('Failed to unassign program')
    } finally {
      setIsProcessing(false)
    }
  }

  const availablePrograms = activePrograms.filter(p => 
    !clientAssignments.some(a => (a.programId === p.id) || (a.program_id === p.id)) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] rounded-[30px] border-slate-200 dark:border-slate-800 bg-card p-0 overflow-hidden">
        <div className="p-6 md:p-8 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black text-foreground uppercase tracking-tight">Manage Programs</DialogTitle>
            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Assign or unassign training programs for {client.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-8">
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Assigned Programs</h3>
              <div className="flex flex-wrap gap-2">
                {clientAssignments.length > 0 ? (
                  clientAssignments.map(assignment => {
                    const progId = assignment.programId || assignment.program_id
                    const programName = programs.find(p => p.id === progId)?.name || progId || 'Unknown Program'
                    return (
                      <div key={assignment.id} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-black uppercase tracking-tight group border border-slate-200/50 dark:border-slate-700/50">
                        {programName}
                        <button 
                          onClick={() => unassignProgram(assignment.id, programName)}
                          className="hover:text-destructive transition-colors shrink-0"
                          aria-label={`Unassign ${programName}`}
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-600 italic ml-1">No programs assigned.</p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
               <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Available Programs</h3>
               <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                 <Input 
                   placeholder="Search programs..." 
                   className="h-12 pl-11 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus-visible:ring-[#0057FF]"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   disabled={isProcessing}
                 />
               </div>
               
               <div className="max-h-[250px] overflow-y-auto space-y-1 border border-slate-100 dark:border-slate-800 rounded-2xl p-1 bg-slate-50/50 dark:bg-slate-900/30">
                 {availablePrograms.length > 0 ? (
                   availablePrograms.map(program => (
                     <div key={program.id} className="flex items-center justify-between p-3 hover:bg-white dark:hover:bg-slate-800 rounded-xl group transition-all">
                       <span className="text-sm font-bold text-foreground">{program.name}</span>
                       <Button 
                         size="sm" 
                         variant="ghost" 
                         className="h-9 rounded-full gap-1 opacity-0 md:group-hover:opacity-100 transition-opacity text-[#0057FF] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 font-black uppercase text-[10px] tracking-widest"
                         onClick={() => assignProgram(program.id, program.name)}
                         aria-label={`Assign ${program.name}`}
                         disabled={isProcessing}
                       >
                         <Plus className="size-3.5" />
                         Assign
                       </Button>
                       {/* Mobile-only visible assign button */}
                       <Button 
                         size="sm" 
                         variant="ghost" 
                         className="h-9 rounded-full md:hidden text-[#0057FF] dark:text-blue-400 font-black uppercase text-[10px] tracking-widest"
                         onClick={() => assignProgram(program.id, program.name)}
                         disabled={isProcessing}
                       >
                         Assign
                       </Button>
                     </div>
                   ))
                 ) : (
                   <p className="text-[10px] uppercase font-black text-slate-400 p-6 text-center">No available programs found.</p>
                 )}
               </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
