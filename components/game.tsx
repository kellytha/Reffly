"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";


const formSchema = z.object({
    home_team: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
    away_team: z.string().min(2, {
    message: "Please enter number of games.",
  }),
    field: z.string().min(1, {
    message: "Please enter field number."
  }),
    time_slot: z.string().min(4, {
    message: "Please enter start time."
  }),
    refs_required: z.string().min(1, {
    message: "Please enter end time."
  }),
})

export  const TournamentForm =() => {
    const form = useForm({
        resolver: zodResolver(formSchema),
         defaultValues: {
            home_team: "",
            away_team: "",
            field: "",
            time_slot:"",
            refs_required:"",
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
          name="home_team"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Home Team</FormLabel>
              <FormControl>
                <Input placeholder="Home Team" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="away_team"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Away Team</FormLabel>
              <FormControl>
                <Input placeholder="Away Team" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="field"
          render={({ field }) => (
            <FormItem>
              <FormLabel>select field</FormLabel>
              <FormControl>
                <Input placeholder="Number of Games" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time_slot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Slot</FormLabel>
              <FormControl>
                <Input type="time" placeholder="Time Slot" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="refs_required"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referees required</FormLabel>
              <FormControl>
                <Input  placeholder="number of refs required " {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
            <Button type="submit">Add Game</Button>
        </div>
      </form>
    </Form>
  )
}