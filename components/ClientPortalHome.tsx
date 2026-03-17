"use client";

import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import { LogOut, BookOpen, Activity, History, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function ClientPortalHome() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Athlete Portal</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">
            Welcome back, {user?.displayName || user?.email?.split('@')[0]}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="rounded-xl border-slate-200 dark:border-slate-800"
        >
          <LogOut className="size-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-8 rounded-[30px] bg-primary/10 border border-primary/20 relative overflow-hidden group cursor-pointer"
        >
          <div className="relative z-10">
            <BookOpen className="size-10 text-primary mb-4" />
            <h2 className="text-xl font-black uppercase tracking-tight">My Programs</h2>
            <p className="text-sm font-bold text-slate-500 uppercase mt-2">View your assigned training tracks</p>
          </div>
          <div className="absolute -right-4 -bottom-4 size-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-8 rounded-[30px] bg-blue-500/10 border border-blue-500/20 relative overflow-hidden group cursor-pointer"
        >
          <div className="relative z-10">
            <Activity className="size-10 text-blue-500 mb-4" />
            <h2 className="text-xl font-black uppercase tracking-tight">Active Workout</h2>
            <p className="text-sm font-bold text-slate-500 uppercase mt-2">Jump into your next session</p>
          </div>
          <div className="absolute -right-4 -bottom-4 size-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-8 rounded-[30px] bg-slate-500/10 border border-slate-500/20 relative overflow-hidden group cursor-pointer"
        >
          <div className="relative z-10">
            <History className="size-10 text-slate-500 mb-4" />
            <h2 className="text-xl font-black uppercase tracking-tight">History</h2>
            <p className="text-sm font-bold text-slate-500 uppercase mt-2">Review your past performance</p>
          </div>
          <div className="absolute -right-4 -bottom-4 size-32 bg-slate-500/5 rounded-full blur-2xl group-hover:bg-slate-500/10 transition-colors" />
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-8 rounded-[30px] bg-zinc-500/10 border border-zinc-500/20 relative overflow-hidden group cursor-pointer"
        >
          <div className="relative z-10">
            <User className="size-10 text-zinc-500 mb-4" />
            <h2 className="text-xl font-black uppercase tracking-tight">Profile</h2>
            <p className="text-sm font-bold text-slate-500 uppercase mt-2">Manage your account settings</p>
          </div>
          <div className="absolute -right-4 -bottom-4 size-32 bg-zinc-500/5 rounded-full blur-2xl group-hover:bg-zinc-500/10 transition-colors" />
        </motion.div>
      </div>
    </div>
  );
}
