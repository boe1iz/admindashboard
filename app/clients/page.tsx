'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical, Archive, ArchiveRestore, Pencil, Users } from 'lucide-react'
import { toast } from 'sonner'
import { CreateClientDialog } from '@/components/CreateClientDialog'
import { ManageClientProgramsDialog } from '@/components/ManageClientProgramsDialog'
import { EditClientDialog } from '@/components/EditClientDialog'
import { motion } from 'framer-motion'
import { logActivity } from '@/lib/activity'

interface Client {
  id: string
  name: string
  email: string
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

export function ClientCard({ client, programs, assignments }: { client: Client, programs: Program[], assignments: Assignment[] }) {
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const toggleActive = async () => {
    setIsProcessing(true)
    try {
      await updateDoc(doc(db, 'clients', client.id), {
        is_active: !client.is_active,
        updated_at: serverTimestamp()
      })
      await logActivity({
        type: !client.is_active ? 'restore' : 'archive',
        client_name: client.name
      })
      toast.success(!client.is_active ? "Client restored" : "Client archived")
    } catch (error) {
      console.error('Error updating client: ', error)
      toast.error("Failed to update client")
    } finally {
      setIsProcessing(false)
    }
  }

  const clientAssignments = assignments.filter(a => 
    (a.clientId === client.id) || 
    (a.client_id === client.id)
  )

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02, y: -4 }}
      >
        <Card 
          className={`relative group cursor-pointer border-slate-200 dark:border-slate-800 bg-card shadow-md hover:shadow-xl hover:border-primary/30 transition-all rounded-[24px] md:rounded-[40px] overflow-hidden ${isProcessing ? 'opacity-50 pointer-events-none scale-[0.98]' : ''} ${!client.is_active ? 'opacity-60 grayscale' : ''}`}
          onClick={() => setIsManageDialogOpen(true)}
        >
          <div className="absolute top-4 right-4 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  <MoreVertical className="size-4 dark:text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl border-slate-200 dark:border-slate-800 bg-card shadow-xl">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setIsEditDialogOpen(true); }} className="rounded-xl m-1 dark:hover:bg-slate-800">
                  <Pencil className="mr-2 size-4" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleActive(); }} className="rounded-xl m-1 dark:hover:bg-slate-800">
                  {client.is_active ? (
                    <>
                      <Archive className="mr-2 size-4" />
                      Archive
                    </>
                  ) : (
                    <>
                      <ArchiveRestore className="mr-2 size-4 text-primary" />
                      <span className="text-primary font-bold">Restore</span>
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardHeader className="p-6">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Users className="size-6 text-primary dark:text-blue-400" />
            </div>
            <CardTitle className="font-black text-foreground uppercase tracking-tight">{client.name}</CardTitle>
            <CardDescription className="text-xs font-bold text-slate-400 dark:text-slate-500">{client.email}</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="flex flex-wrap gap-2">
              {clientAssignments.length > 0 ? (
                clientAssignments.map(assignment => {
                   const progId = assignment.programId || assignment.program_id
                   const programName = programs.find(p => p.id === progId)?.name || progId || 'Unknown Program'
                   return (
                     <span key={assignment.id} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                       {programName}
                     </span>
                   )
                })
              ) : (
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600">No active programs</span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <ManageClientProgramsDialog 
        client={client} 
        programs={programs}
        assignments={assignments}
        open={isManageDialogOpen} 
        onOpenChange={setIsManageDialogOpen} 
      />

      <EditClientDialog
        client={client}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  )
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const qClients = query(collection(db, 'clients'))
    const qPrograms = query(collection(db, 'programs'))
    const qAssignments = query(collection(db, 'assignments'))
    
    const unsubscribeClients = onSnapshot(qClients, (snapshot) => {
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[]
      setClients(clientsData)
    })

    const unsubscribePrograms = onSnapshot(qPrograms, (snapshot) => {
      const programsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Program[]
      setPrograms(programsData)
    })

    const unsubscribeAssignments = onSnapshot(qAssignments, (snapshot) => {
      const assignmentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Assignment[]
      setAssignments(assignmentsData)
      setLoading(false)
    })

    return () => {
      unsubscribeClients()
      unsubscribePrograms()
      unsubscribeAssignments()
    }
  }, [])

  const activeClients = clients.filter(c => c.is_active)
  const archivedClients = clients.filter(c => !c.is_active)

  if (loading) return <div className="p-8 text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">Synchronizing Roster...</div>

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
            <Users className="size-6 md:size-8 text-[#0057FF] dark:text-[#3B82F6]" />
            Client Roster
          </h1>
          <p className="text-xs md:text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
            Manage your high-performance athlete network.
          </p>
        </div>
        <CreateClientDialog />
      </div>
      
      <Tabs defaultValue="operational" className="w-full">
        <TabsList className="bg-card border border-slate-200 dark:border-slate-800 p-1 rounded-full w-fit shadow-sm mb-8">
          <TabsTrigger value="operational" className="rounded-full px-4 md:px-6 data-[state=active]:bg-[#0057FF] data-[state=active]:text-white text-xs md:text-sm font-black uppercase tracking-tight dark:text-slate-400">Operational ({activeClients.length})</TabsTrigger>
          <TabsTrigger value="vault" className="rounded-full px-4 md:px-6 data-[state=active]:bg-[#0057FF] data-[state=active]:text-white text-xs md:text-sm font-black uppercase tracking-tight dark:text-slate-400">Archived Vault ({archivedClients.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="operational" className="space-y-4 outline-none">
          {activeClients.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {activeClients.map(client => (
                <ClientCard key={client.id} client={client} programs={programs} assignments={assignments} />
              ))}
            </div>
          ) : (
            <Card className="p-8 md:p-12 border-slate-200 dark:border-slate-800 bg-card flex flex-col items-center justify-center text-center rounded-[24px] md:rounded-[40px] shadow-md">
              <div className="size-16 md:size-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Users className="size-8 md:size-10 text-slate-200 dark:text-slate-700" />
              </div>
              <CardTitle className="text-foreground font-black uppercase tracking-tight mb-2 text-lg md:text-xl">No Active Clients</CardTitle>
              <CardDescription className="font-medium text-slate-500 dark:text-slate-400 text-sm">Onboard your first client to get started.</CardDescription>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="vault" className="space-y-4 outline-none">
          {archivedClients.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {archivedClients.map(client => (
                <ClientCard key={client.id} client={client} programs={programs} assignments={assignments} />
              ))}
            </div>
          ) : (
            <Card className="p-8 md:p-12 border-slate-200 dark:border-slate-800 bg-card flex flex-col items-center justify-center text-center rounded-[24px] md:rounded-[40px] shadow-md">
              <div className="size-16 md:size-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Archive className="size-8 md:size-10 text-slate-200 dark:text-slate-700" />
              </div>
              <CardTitle className="text-foreground font-black uppercase tracking-tight mb-2 text-lg md:text-xl">Vault is Empty</CardTitle>
              <CardDescription className="font-medium text-slate-500 dark:text-slate-400 text-sm">Archived clients will appear here.</CardDescription>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}