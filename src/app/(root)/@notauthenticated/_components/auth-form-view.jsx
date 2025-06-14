"use client"

import { useState } from 'react'
import { LoginForm, loginFormSchema } from './login-form'
import { RegisterForm, registerFormSchema } from './register-form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PasswordResetProvider } from '@/context/passord-reset-context'
import { ResetPasswordDialog } from './reset-password-dialog'

export const AuthFormView = () => {

  const [showLogin, setShowLogin] = useState(true)

  const changeForm = (formName) => {
    if(formName === "login") {
      setShowLogin(true)
    } else if (formName === "register") {
      setShowLogin(false)
    }
  }

    const loginForm = useForm({
      resolver: zodResolver(loginFormSchema),
      defaultValues: {
        email: "",
        password: "",
      }
    })

    const registerForm = useForm({
      resolver: zodResolver(registerFormSchema),
      defaultValues: {
        email: "",
        password: "",
        displayName: "",
        confirmPassword: "",
      }
    })
  
  
  return (
    <div className='border dark:border-brown-800 max-w-2xl mx-auto p-4 rounded-2xl'>
      <PasswordResetProvider>
        <ResetPasswordDialog />
      {
        showLogin
        ? <LoginForm changeForm={changeForm} form={loginForm} />
        : <RegisterForm changeForm={changeForm} form={registerForm} />
      }
      </PasswordResetProvider>
    </div>
  )
}
