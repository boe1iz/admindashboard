"use client";

import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Shield, ArrowLeft, Loader2, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import { ChangePasswordDialog } from "@/components/ChangePasswordDialog";

export default function ProfilePage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user?.displayName) {
      setName(user.displayName);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Session terminated safely");
    } catch (error) {
      toast.error("Failed to terminate session");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);
    try {
      await updateProfile(user, { displayName: name });
      const clientRef = doc(db, 'clients', user.uid);
      await updateDoc(clientRef, {
        name: name,
        updated_at: serverTimestamp()
      });
      toast.success("Profile synchronized successfully");
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to sync profile updates");
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8 px-4">
      <div className="flex items-center justify-between">
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
            <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">Account Settings</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
              Manage your {isAdmin ? "Coach" : "Athlete"} Profile
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card className="border-slate-200 dark:border-slate-800 shadow-xl rounded-[40px] overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <User className="size-5 text-primary" />
                </div>
                Identity Details
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-tight text-slate-400 ml-13">
                Your public information across the ON3 network.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                      Display Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Athlete Name"
                        className="h-14 pl-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus-visible:ring-primary font-bold"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        id="email"
                        value={user?.email || ""}
                        disabled
                        className="h-14 pl-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 opacity-60 font-bold"
                      />
                    </div>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={updating}
                  className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  {updating ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                  Synchronize Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-xl rounded-[40px] overflow-hidden bg-card/50 backdrop-blur-sm border-dashed">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <Shield className="size-5 text-blue-500" />
                </div>
                Security & Access
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-tight text-slate-400 ml-13">
                Update your secure credentials.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                We recommend using a strong, unique password to protect your training data and performance history.
              </p>
              <ChangePasswordDialog />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-red-200 dark:border-red-900 shadow-xl rounded-[40px] overflow-hidden bg-red-50/5 dark:bg-red-950/5 border-dashed">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-red-500">
                <LogOut className="size-3" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <Button 
                variant="outline"
                onClick={handleLogout}
                className="w-full h-12 rounded-2xl border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-black uppercase tracking-widest text-[10px] transition-all"
              >
                Logout Session
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
