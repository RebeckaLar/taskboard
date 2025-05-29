"use client"

import { cn } from "@/lib/utils"
import { Outfit } from "next/font/google"
import Link from "next/link"
import { Button } from "./ui/button"
import { AvatarDropdown } from "./avatar-dropdown"
import { useAuth } from "@/context/authContext"
import { useSearchParams } from "next/navigation"

const outfit = Outfit({
    subsets: ["latin"],
    weight: ["700"]
})

export const Nav = () => {
    const { isAdmin } = useAuth()

    const searchParams = useSearchParams()
    const date = searchParams.get("date")

    
  return (
    <nav className="flex items-center justify-between pb-10">
        <div>
            <h1 className="block sm:hidden sr-only">Taskboard</h1> 
            <Link className={cn("text-4xl font-bold hidden sm:block", outfit.className)} href="/"><h1>Taskboard</h1></Link>
            <Link className={cn("text-4xl font-bold block sm:hidden", outfit.className)} href="/">Tb</Link>
        </div>
        <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="lg">
           <Link href={`${date 
            ? `/?date=${date}`
            : "/"
        }`}>My tasks</Link> 
        </Button>

        {
            isAdmin() && (
                <>
                    <Button asChild variant="outline" size="lg" className="hidden md:flex">
                        <Link href={`${
                            date 
                            ? `/all?date=${date}` 
                            : "/all"
                        }`}>All tasks</Link> 
                    </Button>
                    <Button asChild variant="outline" size="lg" className="hidden md:flex">
                        <Link href="/add">Add task</Link> 
                    </Button>
                </>
            )
        }

        <AvatarDropdown />
        </div>
    </nav>
  )
}