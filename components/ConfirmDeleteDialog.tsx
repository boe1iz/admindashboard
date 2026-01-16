'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { ReactNode } from "react"

interface ConfirmDeleteDialogProps {
  trigger: ReactNode
  title: string
  description: string
  onConfirm: () => void
}

export function ConfirmDeleteDialog({ trigger, title, description, onConfirm }: ConfirmDeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-[30px] border border-slate-200 dark:border-slate-800 bg-card shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-black text-foreground uppercase tracking-tight">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 dark:text-slate-400 font-medium">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="rounded-full border-slate-200 dark:border-slate-800 bg-background text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 font-bold uppercase tracking-widest text-[10px]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold uppercase tracking-widest text-[10px]"
          >
            Delete Permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
