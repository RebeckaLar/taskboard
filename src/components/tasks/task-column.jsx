"use client"

import { cn } from "@/lib/utils"
import { TaskList } from "./task-list"
import { useEffect, useRef, useState } from "react"
import { useTasks } from "@/context/tasksContext"
import { useAuth } from "@/context/authContext"
import { Switch } from "../ui/switch"
import { TaskProgress } from "./task-progress"
import { TaskReorder } from "./task-reorder"
import { useConfetti } from "@/context/confettiContext"
import { getReadableTextColor, shade } from "@/utils/color"
import { Button } from "../ui/button"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

// CREATES THE COLUMNS OF DIFFERENT USERS TASKS
export const TaskColumn = ({ user, date, className }) => {

    const [isReordering, setIsReordering, saveReorder] = useState(false)
    const [localTasks, setLocalTasks] = useState([]) //fyll i med tasks när vi börjar sortera

    //To avoid updating EVERY task, and only the actually moved tasks,
    const movedTasks = useRef([])

    const { getTasksByUserForDate, completeTask } = useTasks()
    //Tasks from db
    const tasks = getTasksByUserForDate(user.uid, date)

    //Return non-completed tasks
    const notCompleted = tasks.filter(task => !task.completed)

    const { isAdmin } = useAuth()
    const { showConfetti } = useConfetti()

    const handleComplete = async (task) => {
        completeTask(task.id)
        if(tasks.length > 0 && notCompleted.length === 1) {
            showConfetti()
        }
    }

    //Djup kopia av "tasks". Vill inte ha shallow obj som pekar på samma ref obj, utan helt ny kopia:
    const startReorder = () => {
        const deep = tasks
        .filter(t => !t.completed) //Return  non-completed tasks
        .map(t => ({ ...t }))

        movedTasks.current = []
        setLocalTasks(deep)
    }

    const handleCheckChange = (checked) => {
        if(!checked) { //Om inte completed
            //spara ordningen till databasen
            const payload = movedTasks.current.filter(mt => {
            const original = localTasks.find(t => t.id === mt.id)
            return original && original.order !== mt.newOrder
            })
            if(payload.length < 0) {
                saveReorder(localTasks, payload)
            }
        } else {
            startReorder()
        }
        setIsReordering(checked)
    }

    const bgColor = user.color ?? "#ffffff"
    const textColor = getReadableTextColor(bgColor)
    const columnStyle = user.color
    ? {
        backgroundColor: bgColor,
        color: textColor
    }
    : undefined

    const accentColor = 
        textColor === "#000000"
            ? shade(bgColor, -40)
            : shade(bgColor, +40)

    const accentColorIntense = 
        textColor === "#000000"
            ? shade(bgColor, -60)
            : shade(bgColor, +60)


  return (
    <div className={cn("bg-foreground/20 max-w-96 p-5 mx-auto rounded-xl flex flex-col", className)}
        style={columnStyle}
    >
        <TaskProgress total={tasks.length} user={user} accentColor={accentColorIntense} completed={tasks.length - notCompleted.length} className="mb-5"/> 
        {
            isAdmin() && (
                <div className="flex items-center justify-between mb-5" style={{ "--track": accentColorIntense ?? "#99a1af" }}>
                    <span className="font-medium">Sortera</span>
                    <Switch 
                        checked={isReordering}
                        onCheckedChange={handleCheckChange}
                        className="data-[state=unchecked]:bg-[color:var(--track)] dark:data-[state=unchecked]:bg-[color:var(--track)] border border-[color:var(-track)]"
                    />
                </div>
            )
        }
        <div className="flex-1">
            {
            isReordering
                ? <TaskReorder tasks={localTasks} accentColor={accentColor} setTasks={setLocalTasks} movedTasks={movedTasks}/>
                : <TaskList tasks={notCompleted} accentColor={accentColor} handleComplete={handleComplete} />
            }
        </div>
        {/* admin? Add btn */}
        {
            isAdmin() && (
                <div className="flex items-center justify-center mt-6">
                    <Button 
                    asChild
                    variant="icon"
                    className="border-4 border-primary rounded-full p-2 size-12 hover:bg-[color:var(--track)] hover:text-secondary transition-colors"
                    style={{ borderColor: accentColorIntense, color: textColor, "--track": accentColor }}
                    >
                        <Link href={`/add?date=${format(date, "yyyy-MM-dd")}&userId=${user.uid}`} aria-label="Lägg till uppgift">
                            <PlusIcon className="size-6"/>
                        </Link>
                    </Button>
                </div>
            )
        }
    </div>
  )
}