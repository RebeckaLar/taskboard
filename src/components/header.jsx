"use client"

import { isValid, parse } from "date-fns"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "./ui/button"
import { ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react"
import { DatePicker } from "./date-picker"

export const Header = () => {

  const searchParams = useSearchParams()
  const date = searchParams.get("date")
  const router = useRouter()
  const pathName = usePathname()

  const parsed = date 
  ? parse(date, "yyyy-MM-dd", new Date())
  : new Date()

  // Test this by going to http://localhost:3000/?date=2025-05-25 
  console.log({parsed})

  //If valid date, send parsed, otherwise a new date
  const selectedDate = isValid(parsed) ? parsed : new Date

  const navigateToDate = (newDate) => {

  }

  return (
    <div className="flex items-center justify-center gap-4">
      <Button variant="outline">
        <ChevronsLeftIcon />
      </Button>

      <DatePicker
      date={selectedDate} 
      onDateChange={navigateToDate}
      />
      <Button variant="outline">
        <ChevronsRightIcon />
      </Button>
    </div>
  )
}