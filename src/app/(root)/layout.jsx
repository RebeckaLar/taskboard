"use client"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/authContext"
import { Loader2Icon } from "lucide-react"
import { Toaster } from "react-hot-toast"

function ApplicationLayout({ authenticated, notauthenticated }) {

    const { user, authLoaded, verifyEmail } = useAuth()

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
            : user.verified
              ? authenticated
              : (
                <div className="flex flex-col text-center gap-4 items-center justify-center mt-96">
                  <h2 className="text-2xl font-bold">Verify your e-mail</h2>
                  <p>We've sent a recovery link to your e-mail. Please check your inbox.</p>
                  <Button onClick={verifyEmail}>Send again</Button>
                </div>
              )
        }
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
    </>
  )
}

export default ApplicationLayout