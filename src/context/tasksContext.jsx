"use client"

import { addDoc, collection, onSnapshot, orderBy, query, QuerySnapshot, serverTimestamp, where } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./authContext"
import { format } from "date-fns"
import { db } from "@/lib/firebase"

const TasksContext = createContext()

export const TasksProvider = ({ children }) => {

    const [loading, setLoading] = useState(false)
    const [tasks, setTasks] = useState([])
    const { isAdmin, authLoaded, user } = useAuth()

    useEffect(() => {
        if(!authLoaded || user) return //If downloading db is not finished, or if there are no users, return. Otherwise:
        setLoading(true)
        let q

        if(isAdmin()) { //Query as admin (get ALL tasks):
            q = query(collection(db, "tasks"), orderBy("date"), orderBy("order"))
        } else {        //Query as user (get only OWN tasks):
            q = query(
                collection(db, "tasks"), 
                where("ownerId", "==", user.uid),
                orderBy("date"), 
                orderBy("order")
            )
        }

        const unsub = onSnapshot(q, querySnap => {
            const updatedTasks = querySnap.map(doc => ({
                id: doc.id, 
                ...doc.data()
            }))
            setTasks(updatedTasks)
            setLoading(false)
        })

        return () => unsub()
    }, [isAdmin])

    const getNextOrder = () => {
        return Math.max(...tasks.map(task => task.order ?? 0), 0) + 1000
    }

    const addTask = async (taskData) => {

        if(!isAdmin()) return
        setLoading(true)

        try {
            const newTask = {
                ...taskData,
                date: format(taskData.date, "yyyy-MM-dd"),
                order: getNextOrder(),
                completed: false,
                createdAt: serverTimestamp()
            }

            await addDoc(collection(db, "tasks"), newTask)
            
        } catch (error) {
            console.log(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const value = {
        addTask,
        loading,
        tasks
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