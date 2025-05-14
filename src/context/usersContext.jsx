"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./authContext"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query } from "firebase/firestore"

const UsersContext = createContext()

export const UsersProvider = ({ children }) => {

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)

    const { isAdmin } = useAuth()

    //Real-time listener to get all users
    useEffect(() => { 
        if(!isAdmin()) return

    const q = query(collection(db, "users")) //Where to listen
    const unsub = onSnapshot(q, querySnapshot => { //To get real-time db and immediately respond
        const usersData = []
        //Map through all users in the snapshot and push them manually into the array

        querySnapshot.forEach(doc => {
            usersData.push({ ...doc.data(), id: doc.id }) //doc.data to get the information. 
        })
        setUsers(usersData)
        // Everytime theres a change to the users-collection, we look at snapshot and update our state
    }) 

    return () => unsub()
        
    }, [isAdmin]) //if admin, run the use effect again
    
    const value = {
        users,
        loading
    }

    return (
        <UsersContext.Provider value={value}>
            { children }
        </UsersContext.Provider>
    )
}

export const useUsers = () => {
    const context = useContext(UsersContext)
    if(!context) {
        throw new Error("useUsers must be used within an UsersProvider")
    }
    return context
}