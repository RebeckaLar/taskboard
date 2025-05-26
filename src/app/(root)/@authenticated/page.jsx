// import { Logout } from "./log-out"
"use client"
import { Header } from "@/components/header"
import { TaskColumn } from "@/components/tasks/task-column"
import { useAuth } from "@/context/authContext"

import { isValid, parse } from "date-fns"
import { useSearchParams } from "next/navigation"

function HomePage() {
      const searchParams = useSearchParams()
      const date = searchParams.get("date")

      const parsed = date
      ? parse(date, "yyyy-MM-dd", new Date())
      : new Date()

  const selectedDate = isValid(parsed) ? parsed : new Date()

  //The logged in user:
  const { user } = useAuth()
  
  return (
    <>
      <Header />
      <div className="mt-10 pb-20">
        <TaskColumn date={selectedDate} user={user}/>
      </div>
    </>
  )
}

export default HomePage