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

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Du måste ange en giltig epostadress" }),
  password: z.string().nonempty({ message: "Du måste ha ett lösenord" })
})

export const LoginForm = ({ changeForm, form }) => {

  const [errorMessage, setErrorMessage] = useState(null)

  // const form = useForm({
  //   resolver: zodResolver(loginFormSchema),
  //   defaultValues: {
  //     email: "",
  //     password: "",
  //   }
  // })

  function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <>
      <h2 className="text-center font-semibold text-2xl mb-5">Logga in</h2>
      { errorMessage && <p className="¨text-red-500 text-center">{ errorMessage }</p>}
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField //Handles data
          control={form.control}
          name="email" //name is connecting to the form-field with the matching name
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
        <FormField //Handles data
          control={form.control}
          name="password" //name is connecting to the form-field with the matching name
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
        <p>Har du inget konto? <span onClick={() => changeForm("register")} className="underline cursor-pointer">Registrera dig här</span></p>
        <Button type="submit">Logga in</Button>
      </form>
    </Form>
    </>
  )
}
