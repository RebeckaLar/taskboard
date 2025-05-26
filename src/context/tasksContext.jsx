"use client"

import { addDoc, collection, doc, onSnapshot, orderBy, query, QuerySnapshot, serverTimestamp, updateDoc, where, writeBatch } from "firebase/firestore"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useAuth } from "./authContext"
import { format } from "date-fns"
import { db } from "@/lib/firebase"

const TasksContext = createContext()

export const TasksProvider = ({ children }) => {

    const [loading, setLoading] = useState(false)
    const [tasks, setTasks] = useState([])
    const { isAdmin, authLoaded, user } = useAuth()

    useEffect(() => {
        if(!authLoaded || !user) return //If downloading db is not finished, or if there are no users, return. Otherwise:
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
            const updatedTasks = querySnap.docs.map(doc => ({
                id: doc.id, 
                ...doc.data()
            }))
            setTasks(updatedTasks)
            setLoading(false)
        })

        return () => unsub()
    }, [isAdmin, user])

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
                time: format(taskData.time, "HH:mm"),
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

    const completeTask = async (taskId) => {
        setLoading(true)
        try {
            const taskRef = doc(db, "tasks", taskId)
            await updateDoc(taskRef, {
                completed: true
            })
        } catch (error) {
            console.error("Fel vid uppdatering av uppgift: ", error)
        } finally {
            setLoading(false)
        }
    }

    const saveReorder = async (orderedTasks, moved) => { //after tasks are moved, save the new order to db
        setLoading(true)

        const prevTasks = tasks

        setTasks(orderedTasks)

        const batch = writeBatch() 

        moved.forEach(({ id, newOrder }) => {
            batch.update(doc(db, "tasks", id), { order: newOrder })
        })

        try {
            await batch.commit()
        } catch (error) {
            console.error("Batch error:", error)
            setTasks(prevTasks)
        } finally {
            setLoading(false)
        }
    } 

    //Sending the uid object and date object
    const getTasksByUserForDate = (uid, date) => {
 
        const iso = useMemo(() => format(date, "yyyy-MM-dd"), [date]) //Variable used to avoid repeating code

        return useMemo(() => {
            return tasks
                .filter(task => task.ownerId === uid && task.date === iso)
                .sort((a, b) => a.order - b.order)
        }, [tasks, uid, iso])
    }

    const value = {
        addTask,
        loading,
        tasks,
        getTasksByUserForDate,
        completeTask,
        saveReorder
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