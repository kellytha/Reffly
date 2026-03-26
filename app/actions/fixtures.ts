"use server";

import { neon } from "@neondatabase/serverless";

// Lightweight fixture import from a JSON/CSV fixture file stored in Dropbox.
// This server action assumes the uploaded fixture is either JSON or CSV and
// transforms it into multiple games for the given tournament.
export async function importFixtures(tournamentId: number, fixtures: any[]) {
  // Build a simple insert for each fixture row
  // We reuse the existing Neon client setup in other actions by importing the client
  const sql = neon(process.env.DATABASE_URL!);

  if (!Array.isArray(fixtures) || fixtures.length === 0) {
    return { inserted: 0 };
  }

  let inserted = 0;
  for (const item of fixtures) {
    const home_team = item.home_team ?? item.home ?? null;
    const away_team = item.away_team ?? item.away ?? null;
    const time_slot = item.time_slot ?? null;
    const field_number = item.field_number ?? null;
    const game_date = item.game_date ?? item.date ?? null;

    if (!home_team || !away_team) {
      // Skip invalid fixture rows
      continue;
    }

    await sql`
      INSERT INTO games (tournament_id, home_team, away_team, time_slot, field_number, game_date)
      VALUES (${tournamentId}, ${home_team}, ${away_team}, ${time_slot}, ${field_number}, ${game_date})
    `;
    inserted++;
  }

  return { inserted };
}
