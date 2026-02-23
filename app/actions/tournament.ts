"use server";

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function createTournament(data: any) {
  const sql = neon(process.env.DATABASE_URL!);

  const result = await sql`
    INSERT INTO tournaments (name_of_tournament, sport_type)
    VALUES (${data.name_of_tournament}, ${data.sport})
    RETURNING id;
  `;

  return result[0].id;
}

export async function getTournaments() {
  const tournaments = await sql`
    SELECT 
      t.id,
      t.name_of_tournament,
      t.sport_type AS sport,
      g.home_team,
      g.away_team,
      COALESCE(
        (SELECT COUNT(*) FROM referees r WHERE r.tournament_id = t.id),
        0
      ) AS referees
    FROM tournaments t
    LEFT JOIN games g ON g.tournament_id = t.id
  `;

  return tournaments;
}

export async function createTournamentWithGame(tournamentData: any, gameData: any) {
  // Insert tournament
  const tournamentResult = await sql`
    INSERT INTO tournaments (name_of_tournament, sport_type)
    VALUES (${tournamentData.name_of_tournament}, ${tournamentData.sport})
    RETURNING id;
  `;

  const tournamentId = tournamentResult[0].id;

  // Insert game
  await sql`
    INSERT INTO games (tournament_id, home_team, away_team, time_slot)
    VALUES (${tournamentId}, ${gameData.home_team}, ${gameData.away_team}, ${gameData.time_slot});
  `;

  return tournamentId;
}
