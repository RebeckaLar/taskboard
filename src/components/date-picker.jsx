import { format, isToday, isTomorrow, isYesterday } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { sv } from "date-fns/locale"

export const DatePicker = ({ date, onDateChange }) => {
  return (
    <Popover>
        <PopoverTrigger asChild>
            <Button>  
                {
                    isToday(date)
                    ? "Idag"
                    : isTomorrow(date)
                        ? "Imorgon"
                        : isYesterday(date)
                            ? "Igår"
                            : format(date, "PPP", { locale: sv })
                }
            </Button >
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
        <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
        />
        </PopoverContent>
    </Popover>
  )
}