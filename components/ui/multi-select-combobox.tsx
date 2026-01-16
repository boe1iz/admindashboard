"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export type Option = {
  label: string
  value: string
}

interface MultiSelectComboboxProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  emptyText?: string
}

export function MultiSelectCombobox({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  emptyText = "No options found.",
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const handleUnselect = (value: string) => {
    onChange(selected.filter((s) => s !== value))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between min-h-[44px] h-auto py-2 rounded-2xl border-slate-200 dark:border-slate-800 bg-card hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <div className="flex flex-wrap gap-1">
            {selected.length > 0 ? (
              selected.map((value) => (
                <Badge
                  variant="secondary"
                  key={value}
                  className="mr-1 rounded-full px-2 py-0 font-black uppercase text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-none"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUnselect(value)
                  }}
                >
                  {options.find((o) => o.value === value)?.label}
                  <X className="ml-1 h-3 w-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer" />
                </Badge>
              ))
            ) : (
              <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                {placeholder}
              </span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-slate-400 dark:text-slate-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden bg-card">
        <Command className="bg-card">
          <CommandInput placeholder="Search..." className="font-bold uppercase text-[10px] tracking-widest text-foreground" />
          <CommandList className="bg-card">
            <CommandEmpty className="py-6 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {emptyText}
            </CommandEmpty>
            <CommandGroup className="bg-card">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(
                      selected.includes(option.value)
                        ? selected.filter((s) => s !== option.value)
                        : [...selected, option.value]
                    )
                  }}
                  className="rounded-xl m-1 font-black uppercase text-[10px] tracking-widest text-foreground dark:hover:bg-slate-800"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
