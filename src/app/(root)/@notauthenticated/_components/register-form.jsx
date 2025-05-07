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

export const registerFormSchema = z.object({
  displayName: z.string()
  .nonempty({ message: "Du måste ange ett användarnamn" })
  .min(3, { message: "Användarnamnet måste vara minst 3 tecken långt" })
  .max(50, { message: "Användarnamnet får inte vara längre än 50 tecken. " }),
  email: z.string().email({ message: "Du måste ange en giltig epostadress" }),
  password: z.string().nonempty({ message: "Du måste ha ett lösenord" })
  .min(6, { message: "Lösenordet måste vara minst 6 tecken långt" }),
  confirmPassword: z.string().nonempty({ message: "Du måste bekräfta lösenordet" })

}).refine(data => data.password === data.confirmPassword, {
  message: "Lösenorden matchar inte",
  path: ["confirmPassword"]
})

export const RegisterForm = ({ changeForm, form}) => {

  const [errorMessage, setErrorMessage] = useState(null)


  function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <>
      <h2 className="text-center font-semibold text-2xl mb-5">Registrera nytt konto</h2>
      { errorMessage && <p className="¨text-red-500 text-center">{ errorMessage }</p>}
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField //Handles data
          control={form.control}
          name="displayName" //name is connecting to the form-field with the matching name
          render={({ field }) => ( 
            <FormItem>
              <FormLabel>Användarnamn</FormLabel>
              <FormControl>
                <Input className="not-dark:border-gray-300" {...field} />
              </FormControl>
              <FormDescription>
                Detta kommer att vara ditt publika användarnamn på plattformen
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
              <FormLabel>E-post</FormLabel>
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
              <FormLabel>Lösenord</FormLabel>
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
              <FormLabel>Bekräfta lösenord</FormLabel>
              <FormControl>
                <Input type="password" className="not-dark:border-gray-300" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p>Har du redan ett konto? <span onClick={() => changeForm("login")} className="underline cursor-pointer">Logga in här</span></p>
        <Button type="submit">Registrera</Button>
      </form>
    </Form>
    </>
  )
}
