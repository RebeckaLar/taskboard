"use client"

import { auth, db } from "@/lib/firebase"
import { createUserWithEmailAndPassword, EmailAuthProvider, onAuthStateChanged, reauthenticateWithCredential, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updatePassword, updateProfile } from "firebase/auth"
import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"
import toast from "react-hot-toast"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [authLoaded, setAuthLoaded] = useState(false)

    const router = useRouter()

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if(!firebaseUser) {
                setUser(null)
                setAuthLoaded(true)
                return
            }
            const docRef = doc(db, "users", firebaseUser.uid)

            if(firebaseUser?.emailVerified) { //if the user has clicked on the link
                await updateDoc(docRef, {
                    verified: firebaseUser.emailVerified //update the verified-field in the users doc to true
                }) 
            }

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
                console.warn("Could not get user doc")
                setUser(null)
            }
            setAuthLoaded(true)
        })
        return () => unsub()
    }, [])

    const register = async (email, password, displayName) => {
        setLoading(true)

        try {
            //CREATE USER:
            const res = await createUserWithEmailAndPassword(auth, email, password)
            
            //UPDATE PROFILE:
            await updateProfile(res.user, { displayName }) 

            if(!res.user) { 
                console.log("No user")
                return
            }

            //CREATE USER DOC:
            await setDoc(doc(db, "users", res.user.uid), { //Reference to the doc where I want it saved
                uid: res.user.uid,
                email: res.user.email,
                displayName: res.user.displayName,
                role: "user",
                createdAt: Timestamp.now(),
                photoURL: null,
                verified: false,
                color: "#9dedcc"

            })

            await verifyEmail()

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

    const updateUser = async (user, newUserData) => {
        setLoading(true)
        const toastId = toast.loading('Laddar...')
        try {
            const userRef = doc(db, "users", user.uid)
            await updateDoc(userRef, newUserData)
            setUser((prevUser) => ({ ...prevUser, ...newUserData }))
            toast.success("Profile updated", { id: toastId })
        } catch (error) {
            toast.error("Something went wrong, please try again", { id: toastId })
            console.log("Error updating the user: ", error)
        } finally {
            setLoading(false)
        }
    }

    const verifyEmail = async () => {
        const toastId = toast.loading('Sending link...')
        const user = auth.currentUser

        if(!user) {
            console.error("No user currently signed in.")
            toast.error("Something went wrong, please try again", { id: toastId })
            return
        }

        try {
            await sendEmailVerification(user, {
                url: `${window.location.origin}/`,
                handleCodeInApp: false //lets firebase handles user clicking on the verification-mail
            })
            toast.success("Verification link sent, please check email", { id: toastId })

        } catch (error) {
            console.error("Error sending email verification: ", error)
            toast.error("Something went wrong, please try again", { id: toastId })
        }
    }

    const changePassword = async (currentPassword, newPassword) => {
        setLoading(true)
        const toastId = toast.loading('Loading...')
        const user = auth.currentUser

        if(!user) {
            console.error("No user logged in")
            toast.error("No user logged in", { id: toastId })
            return
        }

        try {
            const userCredential = await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, currentPassword))
            await updatePassword(userCredential.user, newPassword)
            toast.success("Password updated", { id: toastId })
        } catch (error) {
            console.error("Error reauthenticating user: ", error)
            if(error.code === "auth/invalid-credential") {
                toast.error("Wrong password", { id: toastId })
              } else if(error.code === "auth/weak-password") {
                toast.error("Weak password", { id: toastId })
              } else {
                toast.error("Something went wrong, please try again", { id: toastId })
              }
            throw error 
        } finally {
            setLoading(false)
        }
    }

    const sendPasswordReset = async (email) => {
        setLoading(true)
        const toastId = toast.loading("Loading...")
        try {
            await sendPasswordResetEmail(auth, email)
            toast.success("Password recovery link sent", { id: toastId })
            return "Password recovery link sent"
        } catch (error) {
            console.error("Error sending password reset email:", error)
            toast.error("Something went wrong, please try again", { id: toastId })
            return "Something went wrong, please try again"
        } finally {
            setLoading(false)
        }
    }

    const value = {
        user,
        setUser,
        loading,
        authLoaded,
        register,
        logout,
        login,
        isAdmin,
        updateUser,
        changePassword,
        verifyEmail,
        sendPasswordReset
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