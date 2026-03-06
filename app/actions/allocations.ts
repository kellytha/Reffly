"use server";

import { neon } from "@neondatabase/serverless";
import { GoogleGenerativeAI } from "@google/generative-ai";

const sql = neon(process.env.DATABASE_URL!);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getGames() {
  const games = await sql`
    SELECT
      g.id,
      g.home_team,
      g.away_team,
      g.time_slot,
      g.game_date,
      g.field_number,
      t.name_of_tournament,
      t.sport_type,
      COALESCE(
        json_agg(
          json_build_object(
            'id', r.id,
            'name', r.name,
            'association', r.association,
            'club', r.club,
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
    GROUP BY g.id, t.name_of_tournament, t.sport_type
    ORDER BY g.game_date, g.time_slot;
  `;

  return games;
}

export async function allocateReferees(formData: FormData) {
  try {
    // Get all games that need referees
    const games = await sql`
      SELECT g.id, g.home_team, g.away_team, g.time_slot, g.game_date, t.sport_type
      FROM games g
      JOIN tournaments t ON g.tournament_id = t.id
      WHERE g.status = 'scheduled';
    `;

    // Get all available referees
    const referees = await sql`
      SELECT id, name, association, club, level, rating,
             (SELECT COUNT(*) FROM game_allocations ga
              JOIN games g2 ON ga.game_id = g2.id
              WHERE ga.referee_id = referees.id
              AND g2.game_date = CURRENT_DATE) as games_today
      FROM referees
      WHERE is_active = true
      ORDER BY rating DESC, level DESC;
    `;

    for (const game of games) {
      // Get current allocations for this game
      const currentAllocations = await sql`
        SELECT COUNT(*) as count FROM game_allocations WHERE game_id = ${game.id};
      `;

      const allocatedCount = currentAllocations[0].count;

      // Need 3 referees per game
      if (allocatedCount < 3) {
        const needed = 3 - allocatedCount;

        // Use AI to allocate referees
        const allocation = await allocateRefereesWithAI(game, referees, needed);

        for (const refereeId of allocation) {
          await sql`
            INSERT INTO game_allocations (game_id, referee_id)
            VALUES (${game.id}, ${refereeId})
            ON CONFLICT (game_id, referee_id) DO NOTHING;
          `;
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error allocating referees:", error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

async function allocateRefereesWithAI(game: any, allReferees: any[], needed: number) {
  let allocatedReferees: any[] = [];

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Get already allocated referees for this game
    allocatedReferees = await sql`
      SELECT r.id, r.name, r.association, r.club
      FROM game_allocations ga
      JOIN referees r ON ga.referee_id = r.id
      WHERE ga.game_id = ${game.id};
    `;

    const allocatedIds = allocatedReferees.map(r => r.id);
    const availableReferees = allReferees.filter(r => !allocatedIds.includes(r.id));

    // Get referees who have games within 2 hours before or after this game
    const gameTime = new Date(`${game.game_date}T${game.time_slot}`);
    const twoHoursBefore = new Date(gameTime.getTime() - 2 * 60 * 60 * 1000);
    const twoHoursAfter = new Date(gameTime.getTime() + 2 * 60 * 60 * 1000);

    const busyReferees = await sql`
      SELECT DISTINCT ga.referee_id
      FROM game_allocations ga
      JOIN games g ON ga.game_id = g.id
      WHERE g.game_date = ${game.game_date}
      AND g.time_slot >= ${twoHoursBefore.toTimeString().slice(0, 5)}
      AND g.time_slot <= ${twoHoursAfter.toTimeString().slice(0, 5)}
      AND ga.referee_id != ALL(${allocatedIds.length > 0 ? allocatedIds : [0]});
    `;

    const busyIds = busyReferees.map(r => r.referee_id);
    const finalAvailable = availableReferees.filter(r => !busyIds.includes(r.id));

    if (finalAvailable.length < needed) {
      // If not enough referees, use all available
      return finalAvailable.slice(0, needed).map(r => r.id);
    }

    const prompt = `
You are an AI referee allocation system for ${game.sport_type} tournaments.

Game Details:
- Home Team: ${game.home_team}
- Away Team: ${game.away_team}
- Time: ${game.time_slot}
- Sport: ${game.sport_type}

Already Allocated Referees: ${allocatedReferees.map(r => `${r.name} (${r.association})`).join(', ') || 'None'}

Available Referees:
${finalAvailable.map(r => `- ID: ${r.id}, Name: ${r.name}, Association: ${r.association || 'None'}, Club: ${r.club || 'None'}, Level: ${r.level}, Rating: ${r.rating}, Games Today: ${r.games_today}`).join('\n')}

Requirements:
1. Allocate exactly ${needed} referees for this game
2. For touch rugby, referees cannot officiate games involving their own association
3. Ensure referees have at least 120 minutes rest between games (already filtered)
4. Prioritize higher rated referees
5. Ensure diverse associations/clubs when possible
6. Return only the referee IDs in a comma-separated list

Please allocate the best ${needed} referees for this game. Return only their IDs separated by commas.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();

    // Extract referee IDs from the response
    const ids = response.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

    // Validate that the IDs exist in available referees
    const validIds = ids.filter(id => finalAvailable.some(r => r.id === id));

    return validIds.slice(0, needed);
  } catch (error) {
    console.error("AI allocation error:", error);
    // Fallback: allocate highest rated available referees
    const allocatedIds = allocatedReferees.map((r: { id: any; }) => r.id);
    return allReferees
      .filter(r => !allocatedIds.includes(r.id))
      .slice(0, needed)
      .map(r => r.id);
  }
}

export async function getRefereeAllocations(refereeId: number) {
  const allocations = await sql`
    SELECT
      ga.id,
      g.home_team,
      g.away_team,
      g.time_slot,
      g.game_date,
      g.field_number,
      t.name_of_tournament,
      ga.assigned_at
    FROM game_allocations ga
    JOIN games g ON ga.game_id = g.id
    JOIN tournaments t ON g.tournament_id = t.id
    WHERE ga.referee_id = ${refereeId}
    AND g.game_date >= CURRENT_DATE
    ORDER BY g.game_date, g.time_slot;
  `;

  return allocations;
}