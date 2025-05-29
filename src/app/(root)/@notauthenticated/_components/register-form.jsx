"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/authContext"
import { getErrorMessage } from "@/lib/getFirebaseError.js"

export const registerFormSchema = z.object({
  displayName: z.string()
  .nonempty({ message: "Please enter a username." })
  .min(3, { message: "Username requires at least 3 characters." })
  .max(50, { message: "Username cannot have more than 50 characters." }),
  email: z.string().email({ message: "Please enter a valid e-mail." }),
  password: z.string().nonempty({ message: "Please enter a password." })
  .min(6, { message: "Password requires at least 6 characters." }),
  confirmPassword: z.string().nonempty({ message: "Please confirm password." })

}).refine(data => data.password === data.confirmPassword, {
  message: "Password do not match.",
  path: ["confirmPassword"]
})

export const RegisterForm = ({ changeForm, form}) => {

  const [errorMessage, setErrorMessage] = useState(null)
  const { register, loading } = useAuth()


  async function onSubmit(values) {

    try {
      const { email, password, displayName } = values
      await register(email, password, displayName)

    } catch (err) {
      const errorMessage = getErrorMessage(err.code)
      setErrorMessage(errorMessage)
    }
  }

  return (
    <>
      <h2 className="text-center font-semibold text-2xl mb-5">Register new account</h2>
      { errorMessage && <p className="¨text-red-500 text-center">{ errorMessage }</p>}
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField //Handles data
          control={form.control}
          name="displayName" //name is connecting to the form-field with the matching name
          render={({ field }) => ( 
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input className="not-dark:border-gray-300" {...field} />
              </FormControl>
              <FormDescription>
                This will be your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => ( 
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" className="not-dark:border-gray-300" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => ( 
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input type="password" className="not-dark:border-gray-300" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p>Already have an account? <span onClick={() => changeForm("login")} className="underline cursor-pointer">Log in here</span></p>
        <Button disabled={loading} className="w-full sm:w-auto" type="submit">Register</Button>
      </form>
    </Form>
    </>
  )
}
