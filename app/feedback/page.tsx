"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash2, CheckCircle, Clock, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeedbackItem {
  id: string;
  workout_title: string;
  user_email: string;
  uid: string;
  content: string;
  created_at: any;
  status: "new" | "reviewed";
}

export default function FeedbackAdminPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(
      collection(db, "feedback"),
      orderBy("created_at", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const feedbackData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FeedbackItem[];
      setFeedback(feedbackData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const toggleStatus = async (item: FeedbackItem) => {
    try {
      await updateDoc(doc(db, "feedback", item.id), {
        status: item.status === "new" ? "reviewed" : "new",
      });
      toast.success("Feedback status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const deleteFeedback = async (id: string) => {
    try {
      await deleteDoc(doc(db, "feedback", id));
      toast.success("Feedback removed");
    } catch (error) {
      toast.error("Failed to remove feedback");
    }
  };

  if (!isAdmin && !authLoading) return <div className="p-8 font-black uppercase text-red-500">Access Denied</div>;
  if (loading) return <div className="p-8 font-black uppercase text-slate-500 animate-pulse">Syncing Insights...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8 px-4">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
          <MessageSquare className="size-8 text-primary" />
          Athlete Insights
        </h1>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">
          Direct feedback and performance reports from the field
        </p>
      </div>

      {feedback.length === 0 ? (
        <Card className="p-12 border-slate-200 dark:border-slate-800 bg-card/50 flex flex-col items-center justify-center text-center rounded-[40px] border-dashed">
          <MessageSquare className="size-16 text-slate-100 dark:text-slate-900 mb-4" />
          <CardTitle className="text-foreground font-black uppercase tracking-tight mb-2">
            Inbox Clear
          </CardTitle>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
            No new feedback received from athletes.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence initial={false}>
            {feedback.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className={cn(
                  "border-slate-200 dark:border-slate-800 bg-card rounded-[30px] overflow-hidden transition-all",
                  item.status === "new" ? "border-l-4 border-l-primary shadow-lg" : "opacity-70"
                )}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "size-10 rounded-xl flex items-center justify-center",
                          item.status === "new" ? "bg-primary/10 text-primary" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                        )}>
                          <User className="size-5" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-black uppercase tracking-tight">
                            {item.workout_title}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            <Mail className="size-3" />
                            {item.user_email}
                            <Clock className="size-3 ml-2" />
                            {item.created_at?.seconds 
                              ? new Date(item.created_at.seconds * 1000).toLocaleString() 
                              : "Just now"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleStatus(item)}
                          className={cn(
                            "rounded-full transition-colors",
                            item.status === "reviewed" ? "text-green-500" : "text-slate-300"
                          )}
                          title={item.status === "new" ? "Mark as Reviewed" : "Mark as New"}
                        >
                          <CheckCircle className="size-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteFeedback(item.id)}
                          className="rounded-full text-slate-300 hover:text-red-500 hover:bg-red-500/5 transition-colors"
                        >
                          <Trash2 className="size-5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2 pb-6">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-sm font-medium leading-relaxed italic text-slate-600 dark:text-slate-300">
                      "{item.content}"
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
