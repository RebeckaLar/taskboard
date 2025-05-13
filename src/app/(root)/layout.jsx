"use client"
import { useAuth } from "@/context/authContext"
import { Loader2Icon } from "lucide-react"
import { Toaster } from "react-hot-toast"

function ApplicationLayout({ authenticated, notauthenticated }) {

    const { user, authLoaded } = useAuth()

    // console.log(authLoaded)

    if(!authLoaded) {
      return (
        <div className="flex items-center justify-center h-[90svh]">
          <Loader2Icon className="size-20 animate-spin"/>
        </div>
      )
    }
  return (
    <> 
        {
            user === null 
            ? notauthenticated
            : authenticated
        }
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
    </>
  )
}

export default ApplicationLayout