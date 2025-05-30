"use client"
import { useTasks } from "@/context/tasksContext"
import { Task } from "./task"
import { AnimatePresence, motion } from "motion/react"

export const TaskList = ({ tasks, handleComplete, accentColor }) => {

  //   const isTaskOverdue = (task) => {
  // // Combine date and time into a single Date object
  //       const taskDateTime = new Date(`${task.date}T${task.time}`);
  //       return !task.completed && taskDateTime < new Date();
  //   }
  //   console.log(isTaskOverdue)
  // const isTaskOverdue = useTasks({ tasks })
  return (
    <motion.div className="space-y-3 w-full" layout>
      <AnimatePresence mode="popLayout">
        {
          tasks.map((task, index)=> (
            <div key={task.id}>
              <Task 
                task={task} 
                time={task.time} 
                handleComplete={handleComplete} 
                accentColor={accentColor} 
                index={index}
              />
              {/* {isTaskOverdue && (
                <span className="text-red-500 text-xs font-semibold ml-2">Task overdue</span>
              )} */}
            </div>
            
          ))
        }
      </AnimatePresence>
    </motion.div>
  )
}