"use client";

import { useState, useCallback } from "react";
import * as React from "react";
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
import { createTournamentWithGame } from "@/app/actions/tournament";

const formSchema = z.object({
  name_of_tournament: z.string().min(2, {
    message: "Tournament name must be at least 2 characters.",
  }),
  home_team: z.string().min(2, {
    message: "Home team name must be at least 2 characters.",
  }),
  away_team: z.string().min(2, {
    message: "Away team name must be at least 2 characters.",
  }),
  time_slot: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Please enter a valid time (HH:MM).",
  }),
});

const Tournamentform = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_of_tournament: "",
      home_team: "",
      away_team: "",
      time_slot: "",
    },
  });

  const onSubmit = async (data: any) => {
    // Atomic operation: create tournament and game in a single transaction
    await createTournamentWithGame({
      name_of_tournament: data.name_of_tournament,
      sport: sport, // from your dropdown
    }, {
      home_team: data.home_team,
      away_team: data.away_team,
      time_slot: data.time_slot,
    });
    form.reset();
    console.log("Tournament + Game saved!");
  };

  const [sport, setSport] = React.useState("rugby");

  const [file, setFile] = useState<File | null>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex justify-center items-center">
          Add Tournament Details
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="items-center p-6 h-screen overflow-y-scroll scroll-smooth">
        <AlertDialogHeader>
          <AlertDialogTitle>Add Tournament Details</AlertDialogTitle>
          <div className="flex flex-col justify-center items-center gap-4 p-5 ">
            <Form {...form}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Type Of Sports</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-32">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Type Of Sports</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={sport}
                      onValueChange={setSport}
                    >
                      <DropdownMenuRadioItem value="top">
                        Touch Rugby
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="rugby">
                        Rugby
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="other">
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
                      <Input
                        placeholder="Name Of Tournament"
                        className="w-81.25"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-semibold font-black">Games</p>
              <FormField
                control={form.control}
                name="home_team"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Team</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Home Team"
                        className="w-81.25"
                        {...field}
                      />
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
                      <Input
                        placeholder="Away Team"
                        className="w-81.25"
                        {...field}
                      />
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
                    <FormLabel>Time Slot:</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        placeholder="Time Slot"
                        className="w-81.25"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button type="button">Add Game</button>
            </Form>
          </div>
          <div className="flex flex-col justify-center items-center gap-2 p-5 m-3">
            <p className="text-semibold font-black">
              Drop a Pdf/Docx or Picture
            </p>
            <label
              htmlFor="fileInput"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="w-81.25 h-45 border-2 bordered border-gray-400 rounded-md flex flex-col justify-center items-center cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  document.getElementById("fileInput")?.click();
                }
              }}
            >
              {!file ? (
                <>
                  <p className="text-gray-600">Drag & drop files here</p>
                  <p className="text-gray-400 text-sm">
                    or click to select files
                  </p>
                </>
              ) : (
                <p className="text-gray-600">{file.name}</p>
              )}
            </label>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,image/*"
              onChange={handleChange}
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>
            Add
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Tournamentform;
