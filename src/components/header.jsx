"use client"

import { addDays, format, isValid, parse } from "date-fns"
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

  // If valid date, send parsed, otherwise a new date
  const selectedDate = isValid(parsed) ? parsed : new Date

  const navigateToDate = (newDate) => {
    const formatted = format(newDate, "yyyy-MM-dd")
    const params = new URLSearchParams(searchParams.toString())
    params.set("date", formatted)
    router.push(`${pathName}?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-center gap-4">
      {/* When clicking left button, select the current date but go back one day: */}
      <Button variant="outline" onClick={() => navigateToDate(addDays(selectedDate, -1))}>
        <ChevronsLeftIcon />
      </Button>

      <DatePicker
      date={selectedDate} 
      onDateChange={navigateToDate}
      />
      {/* When clicking left button, select the current date but add one day: */}
      <Button variant="outline" onClick={() => navigateToDate(addDays(selectedDate, 1))}>
        <ChevronsRightIcon />
      </Button>
    </div>
  )
}