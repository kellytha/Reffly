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
import { importFixtures } from "@/app/actions/fixtures";
import { uploadToDropbox } from "@/app/actions/dropbox";

const formSchema = z
  .object({
    name_of_tournament: z.string().optional(),
    home_team: z.string().optional(),
    away_team: z.string().optional(),
    time_slot: z.string().optional(),
    field_number: z.string().optional(),
  })
  .refine(
    (data) => {
      // At least tournament info OR a document must exist
      return (
        data.name_of_tournament ||
        data.home_team ||
        data.away_team ||
        data.time_slot ||
        data.field_number
      );
    },
    {
      message: "Please fill tournament details OR upload a document.",
    },
  );

const Tournamentform = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_of_tournament: "",
      home_team: "",
      away_team: "",
      time_slot: "",
      field_number: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      let dropboxPath = null;
      let newTournamentId: number | null = null;

      // Upload document if provided
      if (file) {
        const fileName = `${Date.now()}_${file.name}`;

        const uploadResult = await uploadToDropbox(
          file,
          `/tournaments/${fileName}`,
        );

        if (uploadResult.success) {
          dropboxPath = uploadResult.path;
        }
      }

      // If ONLY document exists
      if (file && !data.name_of_tournament) {
        newTournamentId = await createTournamentWithGame(
          {
            name_of_tournament: "Uploaded Tournament",
            sport: sport,
            dropbox_file_path: dropboxPath,
          },
          {
            home_team: "TBD",
            away_team: "TBD",
            time_slot: "00:00",
            field_number: "TBD",
          },
        );
      } else {
        newTournamentId = await createTournamentWithGame(
          {
            name_of_tournament: data.name_of_tournament,
            sport: sport,
            dropbox_file_path: dropboxPath,
          },
          {
            home_team: data.home_team,
            away_team: data.away_team,
            time_slot: data.time_slot,
            field_number: data.field_number,
          },
        );
      }

      // Attempt to import fixtures from the uploaded file (if JSON/CSV)
      if (file && newTournamentId) {
        const fname = file.name.toLowerCase();
        if (fname.endsWith('.json')) {
          const text = await file.text();
          try {
            const fixtures = JSON.parse(text);
            await importFixtures(newTournamentId, fixtures);
          } catch {
            // ignore JSON parse errors
          }
        } else if (fname.endsWith('.csv')) {
          const text = await file.text();
          const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
          if (lines.length > 1) {
            const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
            const fixtures: any[] = [];
            for (let i = 1; i < lines.length; i++) {
              const cols = lines[i].split(',');
              const row: any = {};
              headers.forEach((h, idx) => {
                row[h] = cols[idx] ?? null;
              });
              fixtures.push(row);
            }
            await importFixtures(newTournamentId, fixtures);
          }
        }
      }

      form.reset();
      setFile(null);

      console.log("Tournament saved!");
    } catch (error) {
      console.error("Error saving tournament:", error);
    }
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
                      <DropdownMenuRadioItem value="Touch Rugby">
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
              <FormField
                control={form.control}
                name="field_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field Number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Field Number"
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
