"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/authContext"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { HexColorPicker } from "react-colorful"
import { createPortal } from "react-dom"

export const ColorPicker = ({ className, user }) => {

    const [isOpen, setIsOpen] = useState(false)
    const [color, setColor] = useState(user.color || "#9dedb8")

    const { updateUser } = useAuth()

    const handleColorChange = async () => {
        setIsOpen(false)
        if(color === user.color) return
        await updateUser(user, { color })
    }

  return (
    <>
        <div className={cn("w-20 relative", className)}>
            <Button
                className="p-2 border-2 border-primary/50"
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div 
                className="w-12 h-5 rounded border-2 border-transparent"
                style={{ backgroundColor: color }}
                />
            </Button>
        </div>
        {
            isOpen && createPortal (
                <>
                    {/* overlay: */}
                    <div 
                        className="bg-transparent fixed inset-0 z-[900] pointer-events-auto"
                        onClick={handleColorChange}
                    />

                    {/* color-picker: */}
                    <div
                    className="fixed z-[1000] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                    onClick={e => e.stopPropagation()}
                    >
                        <HexColorPicker 
                            id="color-picker"
                            color={color}
                            onChange={setColor}
                        />
                    </div>
                </>,
                document.body
            )
        }
    </>
  )
}