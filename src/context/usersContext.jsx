"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./authContext"
import { db } from "@/lib/firebase"
import { collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore"
import toast from "react-hot-toast"

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

    const changeRole = async (uid, role) => {
        if(!isAdmin()) {
            toast.error("Du saknar behörighet att göra detta")
            return
        }
        if(role !== "admin" && role !== "user") {
            toast.error("Ogiltig roll angiven")
            return
        }

        const numberOfAdmins = users.filter(user => user.role === "admin").length
        if(numberOfAdmins <= 1 && role === "user") {
            toast.error("Det måste finnas minst en admin")
            return
        }
        setLoading(true)
        try {
            const userRef = doc(db, "users", uid)
            await updateDoc(userRef, { role })
            toast.success(`Användaren har nu ${role}-behörighet`)
        } catch (error) {
            console.error("Error updating user role: ", error)
            toast.error("Någonting gick fel, försök igen")
        } finally {
            setLoading(false)
        }


    }
    
    const value = {
        users,
        loading,
        changeRole
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