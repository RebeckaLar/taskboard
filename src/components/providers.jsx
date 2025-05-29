import React from 'react'
import { ThemeProvider } from './theme-provider'
import { AuthProvider } from '@/context/authContext'
import { UsersProvider } from '@/context/usersContext'
import { TasksProvider } from '@/context/tasksContext'

function Providers({ children }) {
  return (
    <AuthProvider>
      <UsersProvider>
        <TasksProvider>
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
        >
            { children }
        </ThemeProvider>
      </TasksProvider>
    </UsersProvider>
  </AuthProvider>
  )
}

export default Providers