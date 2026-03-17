"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BookOpen, User, History } from "lucide-react";
import { motion } from "framer-motion";

const clientNavItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Programs", href: "/programs", icon: BookOpen },
  { name: "History", href: "/history", icon: History },
  { name: "Profile", href: "/profile", icon: User },
];

export function ClientBottomNav() {
  const pathname = usePathname();

  return (
    <div 
      data-testid="client-bottom-nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-card/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-40 px-6 flex items-center justify-around pb-safe"
    >
      {clientNavItems.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className="relative flex flex-col items-center gap-1 group"
          >
            <div className={cn(
              "p-2 rounded-2xl transition-all duration-300",
              isActive 
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" 
                : "text-slate-400 group-hover:text-primary dark:group-hover:text-blue-400"
            )}>
              <item.icon className="size-5" />
            </div>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-tighter transition-colors",
              isActive ? "text-primary dark:text-blue-400" : "text-slate-400"
            )}>
              {item.name}
            </span>
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute -top-2 size-1 bg-primary rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
