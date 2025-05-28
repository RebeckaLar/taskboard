"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/authContext"
import { getErrorMessage } from "@/lib/getFirebaseError"
import { usePasswordReset } from "@/context/passord-reset-context"

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid e-mail." }),
  password: z.string().nonempty({ message: "Please enter a password." })
})

export const LoginForm = ({ changeForm, form }) => {

  const [errorMessage, setErrorMessage] = useState(null)
  const { loading, login } = useAuth()
  const { setOpen } = usePasswordReset()

  async function onSubmit(values) {
    try {
      await login(values.email, values.password)
    } catch (error) {
      const errorMessage = getErrorMessage(error.code)
      setErrorMessage(errorMessage)
    }
  }

  return (
    <>
      <h2 className="text-center font-semibold text-2xl mb-5">Log in</h2>
      { errorMessage && <p className="¨text-red-500 text-center">{ errorMessage }</p>}
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField //Handles data
          control={form.control}
          name="email" //name is connecting to the form-field with the matching name
          render={({ field }) => ( 
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" className="not-dark:border-gray-300" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField //Handles data
          control={form.control}
          name="password" //name is connecting to the form-field with the matching name
          render={({ field }) => ( 
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" className="not-dark:border-gray-300" {...field} />
              </FormControl>
              <FormMessage />
              <p>Forgot password? <span onClick={() => setOpen(true)} className="underline cursor-pointer">Send recovery link</span></p>
            </FormItem>
          )}
        />
        <p>Don't have an account? <span onClick={() => changeForm("register")} className="underline cursor-pointer">Register here</span></p>
        <Button disabled={loading} className="w-full sm:w-auto" type="submit">Log in</Button>
      </form>
    </Form>
    </>
  )
}
