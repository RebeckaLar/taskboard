"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/authContext"

  

export const AvatarDropdown = () => {


    const { user } = useAuth()

  return (
    <DropdownMenu>

        <DropdownMenuTrigger>
            <Avatar className="size-9 cursor-pointer">
                {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                <AvatarImage src={user?.photoURL || ""} />
                {/* <AvatarFallback>CN</AvatarFallback> */}
                <AvatarFallback>{user?.displayName?.slice(0,2).toUpperCase() || "JD"}</AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>

    </DropdownMenu>
  )
}