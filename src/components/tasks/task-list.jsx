"use client"
import { Task } from "./task"
import { AnimatePresence, motion } from "motion/react"

export const TaskList = ({ tasks, handleComplete, accentColor }) => {
  return (
    <motion.div className="space-y-3 w-full" layout>
      <AnimatePresence mode="popLayout">
        {
          tasks.map((task, index)=> (
            <Task key={task.id} task={task} time={task.time} handleComplete={handleComplete} accentColor={accentColor} index={index}/>
          ))
        }
      </AnimatePresence>
    </motion.div>
  )
}