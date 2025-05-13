"use client"

import { createContext, useContext } from "react"

const TasksContext = createContext()

export const TasksProvider = ({ children }) => {
    const value = {

    }

    return (
        <TasksContext.Provider value={value}>
            { children }
        </TasksContext.Provider>
    )
}

export const useTasks = () => {
    const context = useContext(TasksContext)
    if(!context) {
        throw new Error("useTasks must be used within an TasksProvider")
    }
    return context
}