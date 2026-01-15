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
import { MoreVertical, Archive, ArchiveRestore, Settings2, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { CreateClientDialog } from '@/components/CreateClientDialog'
import { ManageClientProgramsDialog } from '@/components/ManageClientProgramsDialog'
import { EditClientDialog } from '@/components/EditClientDialog'

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
    (a.client_id === client.id) || 
    (a.client_id === client.id)
  )

  return (
    <>
      <Card 
        className={`relative group cursor-pointer hover:border-primary/50 transition-all ${isProcessing ? 'opacity-50 pointer-events-none scale-[0.98]' : ''} ${!client.is_active ? 'grayscale-[0.5] opacity-80' : ''}`}
        onClick={() => setIsManageDialogOpen(true)}
      >
        <div className="absolute top-4 right-4 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setIsEditDialogOpen(true); }}>
                <Pencil className="mr-2 size-4" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setIsManageDialogOpen(true); }}>
                <Settings2 className="mr-2 size-4" />
                Manage Programs
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleActive(); }}>
                {client.is_active ? (
                  <>
                    <Archive className="mr-2 size-4" />
                    Archive
                  </>
                ) : (
                  <>
                    <ArchiveRestore className="mr-2 size-4" />
                    Restore
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardHeader>
          <CardTitle>{client.name}</CardTitle>
          <CardDescription>{client.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {clientAssignments.map(assignment => {
               const progId = assignment.programId || assignment.program_id
               const programName = programs.find(p => p.id === progId)?.name || progId || 'Unknown Program'
               return (
                 <span key={assignment.id} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                   {programName}
                 </span>
               )
            })}
          </div>
        </CardContent>
      </Card>

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

  if (loading) return <div className="p-10">Loading Clients...</div>

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-foreground uppercase tracking-tight">Client Roster</h1>
        <CreateClientDialog />
      </div>
      
      <Tabs defaultValue="operational" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
          <TabsTrigger value="operational">Operational</TabsTrigger>
          <TabsTrigger value="vault">Archived Vault</TabsTrigger>
        </TabsList>
        
        <TabsContent value="operational" className="space-y-4">
          {activeClients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeClients.map(client => (
                <ClientCard key={client.id} client={client} programs={programs} assignments={assignments} />
              ))}
            </div>
          ) : (
            <Card className="p-12 border-dashed flex flex-col items-center justify-center text-center">
              <CardTitle className="text-muted-foreground mb-2">No Active Clients</CardTitle>
              <CardDescription>Onboard your first client to get started.</CardDescription>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="vault" className="space-y-4">
          {archivedClients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archivedClients.map(client => (
                <ClientCard key={client.id} client={client} programs={programs} assignments={assignments} />
              ))}
            </div>
          ) : (
            <Card className="p-12 border-dashed flex flex-col items-center justify-center text-center">
              <CardTitle className="text-muted-foreground mb-2">Vault is Empty</CardTitle>
              <CardDescription>Archived clients will appear here.</CardDescription>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}