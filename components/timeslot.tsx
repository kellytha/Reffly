"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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

const formSchema = z.object({
    start_time: z.string().min(4, {
    message: "Please enter start time."
  }),
    end_time: z.string().min(4, {
    message: "Please enter end time."
  }),
})

export  const TimeSlotForm =() => {
    const form = useForm({
        resolver: zodResolver(formSchema),
         defaultValues: {
            start_time:"",
            end_time:"",
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
          name="start_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input type="time" placeholder="Field Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="end_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
            <Button type="submit">Add Time Slot</Button>
            <Button type="reset">Cancel</Button>
        </div>
      </form>
    </Form>

)}