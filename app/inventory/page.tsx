"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { CreateEquipmentDialog } from "@/components/CreateEquipmentDialog";
import { EditEquipmentDialog } from "@/components/EditEquipmentDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Package,
  Database,
  Archive,
  MoreVertical,
  ArchiveRestore,
  Pencil,
  Search,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface Equipment {
  id: string;
  name: string;
  is_active: boolean;
  createdAt: any;
}

function formatDate(createdAt: any): string {
  if (!createdAt) return "—";
  const date = createdAt.seconds
    ? new Date(createdAt.seconds * 1000)
    : new Date(createdAt);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function InventoryPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "equipment"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Equipment[];
      setEquipment(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleActive = async (item: Equipment) => {
    try {
      await updateDoc(doc(db, "equipment", item.id), {
        is_active: !item.is_active,
      });
      toast.success(
        item.is_active
          ? "Equipment archived to Vault"
          : "Equipment restored to Operational",
      );
    } catch (error) {
      console.error("Error toggling status: ", error);
      toast.error("Failed to update status");
    }
  };

  const filterBySearch = (items: Equipment[]) =>
    items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );

  const activeItems = filterBySearch(
    equipment.filter((item) => item.is_active),
  );
  const archivedItems = filterBySearch(
    equipment.filter((item) => !item.is_active),
  );
  const totalActive = equipment.filter((item) => item.is_active).length;
  const totalArchived = equipment.filter((item) => !item.is_active).length;

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 min-h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-foreground flex items-center gap-3 uppercase">
            <Package className="size-6 md:size-8 text-primary dark:text-[#3B82F6]" />
            Equipment Inventory
          </h2>
          <p className="text-xs md:text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
            Manage facility gear and operational equipment.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateEquipmentDialog />
        </div>
      </div>

      <Tabs defaultValue="operational" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList className="bg-card border border-slate-200 dark:border-slate-800 p-1 rounded-full w-fit shadow-sm">
            <TabsTrigger
              value="operational"
              className="rounded-full px-4 md:px-6 data-[state=active]:bg-primary data-[state=active]:text-white text-xs md:text-sm font-black uppercase tracking-tight dark:text-slate-400"
            >
              Operational ({totalActive})
            </TabsTrigger>
            <TabsTrigger
              value="vault"
              className="rounded-full px-4 md:px-6 data-[state=active]:bg-primary data-[state=active]:text-white text-xs md:text-sm font-black uppercase tracking-tight dark:text-slate-400"
            >
              Archived Vault ({totalArchived})
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search gear..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium focus-visible:ring-primary"
            />
          </div>
        </div>

        <TabsContent value="operational" className="outline-none">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : activeItems.length === 0 ? (
            <Card className="bg-card border-slate-200 dark:border-slate-800 p-8 md:p-12 text-center shadow-md rounded-3xl md:rounded-[40px]">
              <div className="mx-auto flex size-16 md:size-20 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 mb-4">
                <Database className="size-8 md:size-10 text-slate-300 dark:text-slate-700" />
              </div>
              <h3 className="text-lg font-black text-foreground uppercase tracking-tight">
                No Gear Found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-2 font-medium text-sm">
                {search
                  ? `No results for "${search}".`
                  : "Your operational equipment will appear here once added or restored from the vault."}
              </p>
            </Card>
          ) : (
            <Card className="bg-card border-slate-200 dark:border-slate-800 shadow-md rounded-3xl md:rounded-4xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 w-8"></th>
                      <th className="text-left px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        Name
                      </th>
                      <th className="text-left px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hidden sm:table-cell">
                        Date Added
                      </th>
                      <th className="text-left px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hidden md:table-cell">
                        Status
                      </th>
                      <th className="px-4 py-4 w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence initial={false}>
                      {activeItems.map((item, index) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-b border-slate-50 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                              <Package className="size-4 text-primary dark:text-blue-400" />
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-black text-foreground uppercase tracking-tight text-sm">
                              {item.name}
                            </span>
                          </td>
                          <td className="px-4 py-4 hidden sm:table-cell">
                            <span className="text-slate-500 dark:text-slate-400 font-medium text-xs">
                              {formatDate(item.createdAt)}
                            </span>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-black uppercase tracking-widest text-[10px] rounded-full px-3">
                              Operational
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                  <MoreVertical className="size-4 text-slate-400" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="rounded-2xl border-slate-200 dark:border-slate-800 bg-card shadow-xl"
                              >
                                <DropdownMenuItem
                                  onClick={() => setEditingItem(item)}
                                  className="rounded-xl m-1 dark:hover:bg-slate-800"
                                >
                                  <Pencil className="mr-2 size-4" />
                                  Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => toggleActive(item)}
                                  className="rounded-xl m-1 text-slate-500 dark:hover:bg-slate-800"
                                >
                                  <Archive className="mr-2 size-4" />
                                  Archive
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="vault" className="outline-none">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : archivedItems.length === 0 ? (
            <Card className="bg-card border-slate-200 dark:border-slate-800 p-8 md:p-12 text-center shadow-md rounded-3xl md:rounded-[40px]">
              <div className="mx-auto flex size-16 md:size-20 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 mb-4">
                <Archive className="size-8 md:size-10 text-slate-300 dark:text-slate-700" />
              </div>
              <h3 className="text-lg font-black text-foreground uppercase tracking-tight">
                Vault is Empty
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-2 font-medium text-sm">
                {search
                  ? `No results for "${search}".`
                  : "Archived equipment is stored here for future restoration."}
              </p>
            </Card>
          ) : (
            <Card className="bg-card border-slate-200 dark:border-slate-800 shadow-md rounded-3xl md:rounded-4xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 w-8"></th>
                      <th className="text-left px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        Name
                      </th>
                      <th className="text-left px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hidden sm:table-cell">
                        Date Added
                      </th>
                      <th className="text-left px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hidden md:table-cell">
                        Status
                      </th>
                      <th className="px-4 py-4 w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence initial={false}>
                      {archivedItems.map((item, index) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-b border-slate-50 dark:border-slate-800/60 last:border-0 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
                        >
                          <td className="px-6 py-4">
                            <div className="size-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                              <Archive className="size-4 text-slate-400 dark:text-slate-600" />
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-black text-foreground uppercase tracking-tight text-sm">
                              {item.name}
                            </span>
                          </td>
                          <td className="px-4 py-4 hidden sm:table-cell">
                            <span className="text-slate-500 dark:text-slate-400 font-medium text-xs">
                              {formatDate(item.createdAt)}
                            </span>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            <Badge className="bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-black uppercase tracking-widest text-[10px] rounded-full px-3">
                              In Vault
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                  <MoreVertical className="size-4 text-slate-400" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="rounded-2xl border-slate-200 dark:border-slate-800 bg-card shadow-xl"
                              >
                                <DropdownMenuItem
                                  onClick={() => setEditingItem(item)}
                                  className="rounded-xl m-1 dark:hover:bg-slate-800"
                                >
                                  <Pencil className="mr-2 size-4" />
                                  Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => toggleActive(item)}
                                  className="rounded-xl m-1 text-primary font-bold dark:text-blue-400 dark:hover:bg-slate-800"
                                >
                                  <ArchiveRestore className="mr-2 size-4" />
                                  Restore
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {editingItem && (
        <EditEquipmentDialog
          equipment={editingItem}
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
        />
      )}
    </div>
  );
}
