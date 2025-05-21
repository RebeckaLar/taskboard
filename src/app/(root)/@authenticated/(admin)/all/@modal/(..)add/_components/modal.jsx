"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export function Modal({ children }) {
  const [open, setOpen] = React.useState(true)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const router = useRouter()

  const handleOpenChange = (open) => {
    router.back()
    setOpen(open)
  }

  // DESKTOP SCREEN:
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogHeader>
          <DialogTitle>Lägg till en uppgift</DialogTitle>
        </DialogHeader>
        <DialogContent className="sm:max-w-[425px]">
          { children }
        </DialogContent>
      </Dialog>
    )
  }

  // SMALLER SCREEN:
  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-center text-xl">
          <DrawerTitle>Lägg till en uppgift</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto h-[80svh]">
          { children }
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
