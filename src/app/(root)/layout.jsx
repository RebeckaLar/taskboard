"use client"
import { useAuth } from "@/context/authContext"
import { Loader2Icon } from "lucide-react"

function ApplicationLayout({ authenticated, notauthenticated }) {

    // const user = null 
    const { user, authLoaded } = useAuth()

    console.log(authLoaded)

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
    </>
        //Använder inte parallella routes på detta sätt
    // <>
    // <div className="border w-full h-64">
    //     { children }
    // </div>
    // <div className="border w-full h-64">
    //     { authenticated }     
    // </div>
    // <div className="border w-full h-64">
    //     { notauthenticated }
    // </div>
    // </>
  )
}

export default ApplicationLayout