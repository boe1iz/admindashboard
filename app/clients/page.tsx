'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore'
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

interface Client {
  id: string
  name: string
  email: string
  is_active: boolean
}

interface Program {
  id: string
  name: string
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
        is_active: !client.is_active
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
          className={`relative group cursor-pointer border-slate-200 bg-white shadow-md hover:shadow-xl hover:border-primary/30 transition-all rounded-[40px] overflow-hidden ${isProcessing ? 'opacity-50 pointer-events-none scale-[0.98]' : ''} ${!client.is_active ? 'opacity-60' : ''}`}
          onClick={() => setIsManageDialogOpen(true)}
        >
          <div className="absolute top-4 right-4 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl border-slate-200 shadow-xl">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setIsEditDialogOpen(true); }} className="rounded-xl m-1">
                  <Pencil className="mr-2 size-4" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleActive(); }} className="rounded-xl m-1">
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
              <Users className="size-6 text-primary" />
            </div>
            <CardTitle className="font-black text-slate-900 uppercase tracking-tight">{client.name}</CardTitle>
            <CardDescription className="text-xs font-bold text-slate-400">{client.email}</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="flex flex-wrap gap-2">
              {clientAssignments.length > 0 ? (
                clientAssignments.map(assignment => {
                   const progId = assignment.programId || assignment.program_id
                   const programName = programs.find(p => p.id === progId)?.name || progId || 'Unknown Program'
                   return (
                     <span key={assignment.id} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                       {programName}
                     </span>
                   )
                })
              ) : (
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">No active programs</span>
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
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Client Roster</h1>
          <p className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest mt-1">
            Manage your high-performance athlete network.
          </p>
        </div>
        <CreateClientDialog />
      </div>
      
      <Tabs defaultValue="operational" className="w-full">
        <TabsList className="bg-white border border-slate-200 p-1 rounded-full w-fit shadow-sm mb-8">
          <TabsTrigger value="operational" className="rounded-full px-4 md:px-6 data-[state=active]:bg-[#0057FF] data-[state=active]:text-white text-xs md:text-sm font-black uppercase tracking-tight">Operational ({activeClients.length})</TabsTrigger>
          <TabsTrigger value="vault" className="rounded-full px-4 md:px-6 data-[state=active]:bg-[#0057FF] data-[state=active]:text-white text-xs md:text-sm font-black uppercase tracking-tight">Archived Vault ({archivedClients.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="operational" className="space-y-4 outline-none">
          {activeClients.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeClients.map(client => (
                <ClientCard key={client.id} client={client} programs={programs} assignments={assignments} />
              ))}
            </div>
          ) : (
            <Card className="p-12 border-slate-200 bg-white flex flex-col items-center justify-center text-center rounded-[40px] shadow-md">
              <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Users className="size-10 text-slate-200" />
              </div>
              <CardTitle className="text-slate-900 font-black uppercase tracking-tight mb-2">No Active Clients</CardTitle>
              <CardDescription className="font-medium text-slate-500">Onboard your first client to get started.</CardDescription>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="vault" className="space-y-4 outline-none">
          {archivedClients.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {archivedClients.map(client => (
                <ClientCard key={client.id} client={client} programs={programs} assignments={assignments} />
              ))}
            </div>
          ) : (
            <Card className="p-12 border-slate-200 bg-white flex flex-col items-center justify-center text-center rounded-[40px] shadow-md">
              <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Archive className="size-10 text-slate-200" />
              </div>
              <CardTitle className="text-slate-900 font-black uppercase tracking-tight mb-2">Vault is Empty</CardTitle>
              <CardDescription className="font-medium text-slate-500">Archived clients will appear here.</CardDescription>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}