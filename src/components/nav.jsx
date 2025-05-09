"use client"

import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google"
import Link from "next/link"
import { Button } from "./ui/button"
import { AvatarDropdown } from "./avatar-dropdown"
import { useAuth } from "@/context/authContext"

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"]
})

export const Nav = () => {

    // const isAdmin = true
    const { isAdmin } = useAuth()

    
  return (
    <nav className="flex items-center justify-between pb-10">
        <div>
            <h1 className="block sm:hidden sr-only">familyplanner</h1> 
            <Link className={cn("text-4xl font-bold hidden sm:block", poppins.className)} href="/"><h1>familyplanner</h1></Link>
            <Link className={cn("text-4xl font-bold block sm:hidden", poppins.className)} href="/">fp</Link>
        </div>
        <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="lg">
           <Link href="/">Min dag</Link> 
        </Button>

        {
            isAdmin() && (
                <>
                    <Button asChild variant="outline" size="lg" className="hidden md:flex">
                        <Link href="/all">Alla</Link> 
                    </Button>
                    <Button asChild variant="outline" size="lg" className="hidden md:flex">
                        <Link href="/add">Lägg till uppgift</Link> 
                    </Button>
                </>
            )
        }

        <AvatarDropdown />
        </div>
    </nav>
  )
}