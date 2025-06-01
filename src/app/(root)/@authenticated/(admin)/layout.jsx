"use client"

import { useAuth } from "@/context/authContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

function AdminLayout({ children }) {

    const { isAdmin } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if(!isAdmin()) {
          router.replace("/")
      }
    }, [])

    if(!isAdmin) {
      return null
    }

  return (
    <div>{ children }</div>
  )
}
export default AdminLayout