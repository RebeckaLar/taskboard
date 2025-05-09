"use client"

import { useAuth } from "@/context/authContext"
import { useRouter } from "next/navigation"

function AdminLayout({ children }) {

    const { isAdmin } = useAuth()
    const router = useRouter()

    if(!isAdmin()) {
        router.replace("/")
    }

  return (
    <div>{ children }</div>
  )
}
export default AdminLayout