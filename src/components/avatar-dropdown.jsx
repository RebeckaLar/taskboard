"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/authContext"
import { LogOutIcon, SettingsIcon } from "lucide-react"
import Link from "next/link"

export const AvatarDropdown = () => {

    const { user, logout, isAdmin } = useAuth()

  return (
    <DropdownMenu>

        {/* AVATAR ICON */}
        <DropdownMenuTrigger>
            <Avatar className="size-9 cursor-pointer">
                <AvatarImage src={user?.photoURL || ""} className="h-full w-full object-cover"/>
                <AvatarFallback className="bg-gray-700/30">{user?.displayName?.slice(0,2).toUpperCase() || "JD"}</AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>

    {/* DROPDOWN MENU */}
        <DropdownMenuContent align="end" className="w-44">

            {/* Admin button: See all tasks */}
            {
                isAdmin() && (
                   <>  
                    <DropdownMenuItem asChild className="not-dark:hover:bg-gray-200 cursor-pointer md:hidden">
                        <Link href="/all" className="flex items-center gap-2 text-xl md:text-base">
                            All tasks
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="not-dark:hover:bg-gray-200 cursor-pointer md:hidden">
                        <Link href="/add" className="flex items-center gap-2 text-xl md:text-base">
                            Add task
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="md:hidden"/>
                   </> 
                )
            }

            {/* Settings button */}
            <DropdownMenuItem asChild className="not-dark:hover:bg-gray-200 cursor-pointer">
                <Link href="/settings" className="flex items-center gap-2 text-xl md:text-base">
                    <SettingsIcon className="size-5 md:size-4"/>
                    Settings
                </Link>
            </DropdownMenuItem>

            {/* Log out button */}
            <DropdownMenuItem onClick={logout} className="not-dark:hover:bg-gray-200 cursor-pointer">
                <Link href="/settings" className="flex items-center gap-2 text-xl md:text-base">
                    <LogOutIcon className="size-5 md:size-4"/>
                    Log out
                </Link>
            </DropdownMenuItem>

        </DropdownMenuContent>

    </DropdownMenu>
  )
}