"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

interface WorkoutFeedbackDialogProps {
  workoutId: string;
  workoutTitle: string;
  programId: string;
}

export function WorkoutFeedbackDialog({
  workoutId,
  workoutTitle,
  programId,
}: WorkoutFeedbackDialogProps) {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !feedback.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "feedback"), {
        uid: user.uid,
        user_email: user.email,
        workout_id: workoutId,
        workout_title: workoutTitle,
        program_id: programId,
        content: feedback.trim(),
        created_at: serverTimestamp(),
        status: "new",
      });
      
      toast.success("Feedback transmitted to coach");
      setFeedback("");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to transmit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-10 md:size-12 rounded-full text-slate-300 hover:text-primary hover:bg-primary/5 dark:hover:bg-blue-500/10 transition-colors"
          aria-label="Give feedback"
        >
          <MessageSquare className="size-5 md:size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[30px] border-slate-200 dark:border-slate-800 bg-card shadow-2xl sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight">
              Session Feedback
            </DialogTitle>
            <DialogDescription className="text-xs font-bold uppercase text-slate-400">
              Sharing insights for {workoutTitle}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Textarea
              placeholder="Share your feedback with the coach (e.g., intensity, recovery, technique)..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[120px] rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus-visible:ring-primary text-sm p-4"
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting || !feedback.trim()}
              className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Transmitting...
                </div>
              ) : (
                <>
                  <Send className="size-4 mr-2" />
                  Transmit Feedback
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
