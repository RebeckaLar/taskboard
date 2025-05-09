"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/authContext"

export const Logout = () => {

    const { logout } = useAuth()

  return (
    <Button onClick={logout}>Logout</Button>
  )
}