"use client"

import { zodResolver } from "@hookform/resolvers/zod"
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
import { is } from "zod/v4/locales"

const formSchema = z.object({
    name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
    username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
    games: z.string().min(1, {
    message: "Please enter number of games.",
  }),
    is_active: z.boolean(),
})

export  const FieldForm =() => {
    const form = useForm({
        resolver: zodResolver(formSchema),
         defaultValues: {
            name: "",
            username: "",
            games: "",
            is_active: false,
        },
    })
    const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Handle form submission
    console.log(data)
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Number</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Field Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
            <Button type="submit">Cancel</Button>
            <Button type="submit">Add Field</Button>
        </div>
      </form>
    </Form>
  )
}