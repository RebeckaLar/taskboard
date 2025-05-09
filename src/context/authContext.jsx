"use client"

import { auth, db } from "@/lib/firebase"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [authLoaded, setAuthLoaded] = useState(false)

    const router = useRouter()
    // console.log(user)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if(!firebaseUser) {
                setUser(null)
                setAuthLoaded(true)
                return
            }
            const docRef = doc(db, "users", firebaseUser.uid)

            // const docSnap = await getDoc(docRef)
            // if(docSnap.exists()) {
            //     setUser(docSnap.data())
            // }

            const getUserDocWithRetry = async (retries = 5, delay = 300) => {
                let docSnap = null
                for(let i = 0; i < retries; i++) {
                    docSnap = await getDoc(docRef)
                    if(docSnap.exists()) break

                    await new Promise((resolve) => {
                        setTimeout(resolve, delay)
                    })
                }

                return docSnap
            }

            const docSnap = await getUserDocWithRetry()

            if(docSnap && docSnap.exists()) {
                setUser(docSnap.data())
            } else {
                console.warn("Användardokument kunde inte hämtas")
                setUser(null)
            }

            setAuthLoaded(true)
        })
        return () => unsub()
    }, [])

    const register = async (email, password, displayName) => {
        setLoading(true)

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password)
            await updateProfile(res.user, { displayName })

            if(!res.user) {
                console.log("No user")
                return
            }

            // const docRef = doc(db, "users", res.user.uid) //Reference to the doc where I want it saved
            await setDoc(doc(db, "users", res.user.uid), {   //Reference to the doc where I want it saved
                uid: res.user.uid,
                email: res.user.email,
                displayName: res.user.displayName,
                role: "user",
                createdAt: Timestamp.now(),
                photoURL: null,
                verified: false,
                color: "#9dedcc"

            })

        } catch (error) {
            console.log("Error registering the user: ", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        router.replace("/")
        await signOut(auth)
    }

    const login = async (email, password) => {
        setLoading(true)
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
            console.log("Error signing in: ", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const isAdmin = () => {
        if(!user) return false
        return user.role === "admin"
    }

    const value = {
        user,
        loading,
        authLoaded,
        register,
        logout,
        login,
        isAdmin
    }

    return (
        <AuthContext.Provider value={value}>
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => { //In a component: const { user } = useAuth()
    const context = useContext(AuthContext) 
    if(!context) {
        throw new Error("useAuth must be used inside an AuthProvider")
    }
    return context
}