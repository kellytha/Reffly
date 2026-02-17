"use client";

import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    name_of_tournament: z.string().min(2,{
    message: "Tournament name must be at least 2 characters."
  }),
    home_team: z.string().min(2, {
    message: "Home team name must be at least 2 characters.",
  }),
    away_team: z.string().min(2,{
      message:"Away team name must be at least 2 characters."
    })
});

const Tournamentform = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_of_tournament:"",
      home_team:"",
      away_team:"",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Handle form submission
    console.log(data);
  };

  const [position, setPosition] = React.useState("bottom")

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Tournament Details</AlertDialogTitle>
          <Form {...form}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Type Of Sports</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-32">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Type Of Sports</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={position}
                    onValueChange={setPosition}
                  >
                    <DropdownMenuRadioItem value="top">
                      Touch Rugby
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="bottom">
                      Rugby
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="right">
                      More Sports Coming Soon !
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
    
            <FormField
              control={form.control}
              name="name_of_tournament"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of Tournament</FormLabel>
                  <FormControl>
                    <Input placeholder="Name of tournament" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            Games
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
          </Form>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Add</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Tournamentform;
