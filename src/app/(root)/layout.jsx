"use client"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/authContext"
import { Loader2Icon } from "lucide-react"
import { Toaster } from "react-hot-toast"

function ApplicationLayout({ authenticated, notauthenticated }) {

    const { user, authLoaded, verifyEmail } = useAuth()

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
        {/* {
            user === null 
            ? notauthenticated
            : authenticated
        } */}
        {
            user === null 
            ? notauthenticated
            : user.verified
              ? authenticated
              : (
                <div className="flex flex-col text-center gap-4 items-center justify-center mt-96">
                  <h2 className="text-2xl font-bold">Verifiera din e-postadress</h2>
                  <p>Vi har skickat en verifieringslänk till din e-postadress. Vänligen kontrollera din inkorg.</p>
                  <Button onClick={verifyEmail}>Skicka igen</Button>
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