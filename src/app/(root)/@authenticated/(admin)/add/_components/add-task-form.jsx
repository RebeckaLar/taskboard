"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useRouter, useSearchParams } from "next/navigation"
import { eachDayOfInterval, parse } from "date-fns"
import { useState } from "react"
import { useUsers } from "@/context/usersContext"
import Link from "next/link"
import { Calendar } from "@/components/ui/calendar"
import { useTasks } from "@/context/tasksContext"

const base = z.object({
    title: z.string().nonempty({ message: "Uppgift är obligatorisk" }),
    ownerId: z.string().nonempty({ message: "Du måste välja en användare" }),

})

const single = base.extend({
    reoccuring: z.literal("none"),
    date: z.date(),
})


const multiple = base.extend({
    reoccuring: z.literal("multiple"),
    dateMultiple: z.array(z.date()).min(1, "Välj minst ett datum"),
})

const range = base.extend({
    reoccuring: z.literal("range"),
    dateRange: z.object({
        from: z.date(),
        to: z.date()
    })
})


const formSchema = z.discriminatedUnion("reoccuring", [
    single,
    multiple,
    range
])

export const AddTaskForm = () => {

    const searchParams = useSearchParams()
    const presetDate = searchParams.get("date")
    const presetUserId = searchParams.get("userId")

    const { users } = useUsers()
    const { addTask, loading } = useTasks()
    const [submitted, setSubmitted] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const router = useRouter()
    // const loading = false

  // 1. Define your form.
const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
       title: "",
       ownerId: presetUserId ?? "",
       reoccuring: "none",
       date: presetDate ? parse(presetDate, "yyyy-MM-dd", new Date()) ?? new Date() : new Date()
    },
  })

  const reoccuringType = form.watch("reoccuring")

async function onSubmit(values) {
    const base = {
        title: values.title,
        ownerId: values.ownerId
    }
    console.log(values)
    try {
        setSubmitted(true) //To avoid spam
    
        if(values.reoccuring === "none") {
            await addTask({ ...base, date: values.date })
        }
        if(values.reoccuring === "multiple") {
            await Promise.all(
                values.dateMultiple.map(d => addTask({ ...base, date: d}))
            )

        }
        if(values.reoccuring === "range") {
            const days = eachDayOfInterval({ start: values.dateRange.from, end: values.dateRange.to})
            await Promise.all(
                days.dateMultiple.map(d => addTask({ ...base, date: d}))
            )
        }
    
        form.reset()
        // TODO: kolla vart router ska pusha beroende på vilken sida man kmr ifrån
        router.push("/")
      } catch (error) {
        console.error(error)
        setErrorMessage("Någonting gick fel, försök igen")
        setSubmitted(false)
      }
  }

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Uppgift</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
    <FormField
          control={form.control}
          name="ownerId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tilldelad till</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-52 justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? users.find(
                            (user) => user.uid === field.value
                          )?.displayName
                        : "Välj användare"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-0">
                  <Command>
                    <CommandInput
                      placeholder="Sök användare..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>Inga användare hittades.</CommandEmpty>
                      <CommandGroup>
                        {users.map((user) => (
                          <CommandItem
                            value={user.displayName.toLowerCase()}
                            key={user.uid}
                            onSelect={() => {
                              form.setValue("ownerId", user.uid)
                            }}
                          >
                            {user.displayName}
                            <Check
                              className={cn(
                                "ml-auto",
                                user.uid === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the user that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reoccuring"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upprepning</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full sm:w-52">
                    <SelectValue placeholder="Välj upprepning" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Ingen</SelectItem>
                  <SelectItem value="multiple">Flera dagar</SelectItem>
                  <SelectItem value="range">Från - Till</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                 { reoccuringType === "none" && 'Välj hur ofta uppgiften ska upprepas. Väljer du "ingen" så är det en engångsuppgift.'}
                 { reoccuringType === "multiple" && 'Välj flera dagar som du vill ha uppgiften på.'}
                 { reoccuringType === "range" && 'Välj ett start- och slutdatum för uppgiften. Uppgiften kommer att upprepas varje dag mellan dessa datum.'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {
            reoccuringType === "none" && (
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem>
                             <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )
        }
        {
            reoccuringType === "multiple" && (
                <FormField
                    control={form.control}
                    name="dateMultiple"
                    render={({ field }) => (
                        <FormItem>
                             <Calendar
                                mode="multiple"
                                selected={field.value}
                                onSelect={field.onChange}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )
        }
        {
            reoccuringType === "range" && (
                <FormField
                    control={form.control}
                    name="dateRange"
                    render={({ field }) => (
                        <FormItem>
                             <Calendar
                                mode="range"
                                selected={field.value}
                                onSelect={field.onChange}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )
        }
            { errorMessage && <p className="text-red-500 text-sm">{ errorMessage }</p>}
            <Button disabled={loading || submitted} type="submit">{ loading ? "Skapar..." : "Skapa uppgift" }</Button>
          </form>
        </Form>
      )
}