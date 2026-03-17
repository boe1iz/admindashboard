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
import { History, Calendar, Trophy, Trash2, ArrowLeft, Activity, User } from "lucide-react";
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
    }, (error) => {
      console.error("Firestore History Error:", error);
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
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="p-8 text-slate-500 font-black uppercase tracking-widest text-[10px] animate-pulse">
            Synchronizing History...
          </p>
        </div>
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
          className="rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800"
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
        <Card className="p-16 border-slate-200 dark:border-slate-800 bg-card/50 flex flex-col items-center justify-center text-center rounded-[40px] border-dashed shadow-inner">
          <div className="size-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Trophy className="size-12 text-slate-200 dark:text-slate-800" />
          </div>
          <CardTitle className="text-foreground font-black uppercase tracking-tight mb-2 text-xl">
            No Records Found
          </CardTitle>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest max-w-xs leading-relaxed">
            Complete your first session to begin your training legacy.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence initial={false}>
            {history.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ scale: 1.01 }}
              >
                <Card className="border-slate-200 dark:border-slate-800 bg-card rounded-[30px] overflow-hidden hover:border-primary/30 transition-all shadow-md hover:shadow-xl">
                  <CardContent className="p-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="size-14 rounded-[20px] bg-primary/10 flex items-center justify-center shrink-0">
                        <Activity className="size-7 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-black text-foreground uppercase tracking-tight text-base md:text-lg truncate">
                          {item.workout_title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <Calendar className="size-3" />
                            {item.completed_at?.seconds 
                              ? new Date(item.completed_at.seconds * 1000).toLocaleString() 
                              : "Just now"}
                          </div>
                          {isAdmin && (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                              <User className="size-3" />
                              {item.user_email}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRecord(item.id)}
                        className="rounded-full text-slate-300 hover:text-red-500 hover:bg-red-500/5 transition-colors shrink-0"
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
