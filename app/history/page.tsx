"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Calendar, Trophy, Trash2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface HistoryItem {
  id: string;
  workout_title: string;
  user_email: string;
  uid: string;
  completed_at: any;
}

export default function HistoryPage() {
  const { user, isAdmin } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    let q = query(
      collection(db, "training_history"),
      orderBy("completed_at", "desc")
    );

    // If not admin, only show own history
    if (!isAdmin) {
      q = query(
        collection(db, "training_history"),
        where("uid", "==", user.uid),
        orderBy("completed_at", "desc")
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const historyData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as HistoryItem[];
      setHistory(historyData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isAdmin]);

  const deleteRecord = async (id: string) => {
    try {
      await deleteDoc(doc(db, "training_history", id));
      toast.success("Record purged from history");
    } catch (error) {
      toast.error("Failed to purge record");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">
        Synchronizing History...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="rounded-xl"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <History className="size-8 text-primary" />
            Training History
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">
            Archived sessions and performance milestones
          </p>
        </div>
      </div>

      {history.length === 0 ? (
        <Card className="p-12 border-slate-200 dark:border-slate-800 bg-card/50 flex flex-col items-center justify-center text-center rounded-[40px] border-dashed">
          <div className="size-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6">
            <Trophy className="size-10 text-slate-200 dark:text-slate-800" />
          </div>
          <CardTitle className="text-foreground font-black uppercase tracking-tight mb-2">
            No Records Found
          </CardTitle>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
            Complete your first session to begin your legacy.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence initial={false}>
            {history.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="border-slate-200 dark:border-slate-800 bg-card rounded-[30px] overflow-hidden hover:border-primary/20 transition-all">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Calendar className="size-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-black text-foreground uppercase tracking-tight text-base truncate">
                          {item.workout_title}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                          {item.completed_at?.seconds 
                            ? new Date(item.completed_at.seconds * 1000).toLocaleString() 
                            : "Just now"}
                          {isAdmin && ` • ${item.user_email}`}
                        </p>
                      </div>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRecord(item.id)}
                        className="rounded-full text-slate-300 hover:text-red-500 hover:bg-red-500/5 transition-colors"
                      >
                        <Trash2 className="size-5" />
                      </Button>
                    )}
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
