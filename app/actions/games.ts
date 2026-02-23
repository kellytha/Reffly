// app/actions/games.ts
"use server";

import { neon } from "@neondatabase/serverless";

export async function addGame(tournamentId: number, data: any) {
  const sql = neon(process.env.DATABASE_URL!);

  await sql`
    INSERT INTO games (tournament_id, home_team, away_team, time_slot)
    VALUES (${tournamentId}, ${data.home_team}, ${data.away_team}, ${data.time_slot});
  `;
}
