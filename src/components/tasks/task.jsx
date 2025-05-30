"use client"

import { format, isAfter } from "date-fns"
import { motion } from "motion/react"
import { useEffect, useState } from "react"

//ANIMATIONS FOR TASKS
export const Task = ({ task, handleComplete, index, accentColor }) => {

        const todayDateTime = new Date(task.date + " "+ task.time)

        const today = new Date()

        const taskOverdue = isAfter( today, todayDateTime)

        console.log(today+ " 1")
        console.log(todayDateTime+ " 2")
        console.log(taskOverdue+ " 3")

  return (
    <Delay delay={ 100 * index }>
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        transition={{
          x: { type: "spring", bounce: 0, duration: 0.5 },
          opacity: { duration: 0.4 }
        }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        key={task.id}
        className="p-4 shadow-sm bg-background rounded-lg cursor-pointer"
        onClick={() => handleComplete(task)}
        style={{ backgroundColor: accentColor }}
        >
          <div className="flex justify-between">
            <span className="text-xl font-normal">{task.title}</span>
            <span className="text-xl font-semibold">{task.time.toString()}</span>
                {taskOverdue && (
                <span className="text-red-500 text-xs font-semibold ml-2">Task overdue</span>
              )}
          </div>
      </motion.div>
    </Delay>
  )
}

export const Delay = ({ children, delay }) => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  if(!visible) return null

  return <>{ children }</>
}