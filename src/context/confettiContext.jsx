"use client"

import { createContext, useContext, useState } from "react"
import ReactConfetti from "react-confetti"

const ConfettiContext = createContext()

export const ConfettiProvider = ({ children }) => {

    const [isOpen, setIsOpen] = useState(false)

    const showConfetti = () => {
        setIsOpen(true)
    }

    const value = {
        showConfetti
    }
    return (
        <ConfettiContext.Provider value={value}>
            {
                isOpen && (
                    <ReactConfetti 
                    className="pointer-events-none z-50" 
                    numberOfPieces={500} 
                    recycle={false} 
                    onConfettiComplete={() => setIsOpen(false)}
                    />
                )
            }
            { children }
        </ConfettiContext.Provider>
    )
}


export const useConfetti = () => { //In a component: const { user } = useAuth()
    const context = useContext(ConfettiContext) 
    if(!context) {
        throw new Error("useConfetti must be used inside an ConfettiProvider")
    }
    return context
}