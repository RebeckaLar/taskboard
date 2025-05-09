import React from 'react'
import { ThemeProvider } from './theme-provider'
import { AuthProvider } from '@/context/authContext'

function Providers({ children }) {
  return (
    <AuthProvider>
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
  >
    { children }
  </ThemeProvider>
  </AuthProvider>
  )
}

export default Providers