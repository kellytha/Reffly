"use server";

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function createTournament(data: any) {;

  const result = await sql`
    INSERT INTO tournaments (name_of_tournament, sport_type, dropbox_file_path)
    VALUES (${data.name_of_tournament}, ${data.sport}, ${data.dropbox_file_path || null})
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
      t.dropbox_file_path,
      COUNT(DISTINCT ga.referee_id) AS referees
    FROM tournaments t
    LEFT JOIN games g ON g.tournament_id = t.id
    LEFT JOIN game_allocations ga ON ga.game_id = g.id
    GROUP BY t.id
  `;

  return tournaments;
}

export async function getTournamentGames(tournamentId: number) {
  const games = await sql`
    SELECT
      g.id,
      g.home_team,
      g.away_team,
      g.time_slot,
      g.game_date,
      g.field_number,
      g.status,
      t.name_of_tournament,
      t.sport_type,
      COALESCE(
        json_agg(
          json_build_object(
            'id', r.id,
            'name', r.name,
            'association', r.association,
            'level', r.level,
            'rating', r.rating
          )
        ) FILTER (WHERE r.id IS NOT NULL),
        '[]'
      ) as referees
    FROM games g
    JOIN tournaments t ON g.tournament_id = t.id
    LEFT JOIN game_allocations ga ON g.id = ga.game_id
    LEFT JOIN referees r ON ga.referee_id = r.id AND r.is_active = true
    WHERE t.id = ${tournamentId}
    GROUP BY g.id, t.name_of_tournament, t.sport_type
    ORDER BY g.game_date, g.time_slot;
  `;

  return games;
}

export async function getTournamentById(tournamentId: number) {
  const tournament = await sql`
    SELECT
      t.id,
      t.name_of_tournament,
      t.sport_type,
      t.dropbox_file_path,
      COUNT(DISTINCT g.id) as game_count,
      COUNT(DISTINCT ga.referee_id) AS referees
    FROM tournaments t
    LEFT JOIN games g ON g.tournament_id = t.id
    LEFT JOIN game_allocations ga ON ga.game_id = g.id
    WHERE t.id = ${tournamentId}
    GROUP BY t.id
  `;

  return tournament[0] || null;
}
export async function createTournamentWithGame(tournamentData: any, gameData: any) {
  // Insert tournament
  const tournamentResult = await sql`
    INSERT INTO tournaments (name_of_tournament, sport_type, dropbox_file_path)
    VALUES (${tournamentData.name_of_tournament}, ${tournamentData.sport}, ${tournamentData.dropbox_file_path || null})
    RETURNING id;
  `;

  const tournamentId = tournamentResult[0].id;

  // Insert game
  await sql`
    INSERT INTO games (tournament_id, home_team, away_team, time_slot, field_number)
    VALUES (${tournamentId}, ${gameData.home_team}, ${gameData.away_team}, ${gameData.time_slot}, ${gameData.field_number});
  `;

  return tournamentId;
}
