"use server";

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function getReferees() {
  const referees = await sql`
    SELECT id, name, phone_number, association, club, level, rating, is_active
    FROM referees
    WHERE is_active = true
    ORDER BY name;
  `;

  return referees;
}

export async function addReferee(data: { name: string; phone_number: string; association?: string; club?: string; level?: string }) {
  const sql = neon(process.env.DATABASE_URL!);

  await sql`
    INSERT INTO referees (name, phone_number, association, club, level, is_active)
    VALUES (${data.name}, ${data.phone_number}, ${data.association || null}, ${data.club || null}, ${data.level || 'Junior'}, true);
  `;
}

export async function updateReferee(id: number, data: { name: string; phone_number: string; association?: string; club?: string; level?: string }) {
  const sql = neon(process.env.DATABASE_URL!);

  await sql`
    UPDATE referees
    SET name = ${data.name}, phone_number = ${data.phone_number}, association = ${data.association || null}, club = ${data.club || null}, level = ${data.level || 'Junior'}
    WHERE id = ${id};
  `;
}

export async function deleteReferee(id: number) {
  const sql = neon(process.env.DATABASE_URL!);

  await sql`
    UPDATE referees
    SET is_active = false
    WHERE id = ${id};
  `;
}

export async function rateReferee(refereeId: number, gameId: number, rating: number, ratedBy: number, comments?: string) {
  const sql = neon(process.env.DATABASE_URL!);

  await sql`
    INSERT INTO referee_ratings (referee_id, game_id, rated_by, rating, comments)
    VALUES (${refereeId}, ${gameId}, ${ratedBy}, ${rating}, ${comments || null});
  `;

  // Update referee's average rating
  await sql`
    UPDATE referees
    SET rating = (
      SELECT AVG(rating)::decimal(3,2)
      FROM referee_ratings
      WHERE referee_id = ${refereeId}
    )
    WHERE id = ${refereeId};
  `;
}

// Rate a referee by the currently logged-in user (or provided identifier).
// This is a convenience wrapper around the underlying referee_ratings schema
// that allows rating without requiring a specific game to be tied.
export async function rateRefereeByUser(
  refereeId: number,
  rating: number,
  ratedBy: string,
  gameId?: number,
  comments?: string,
) {
  const sql = neon(process.env.DATABASE_URL!);

  await sql`
    INSERT INTO referee_ratings (referee_id, game_id, rated_by, rating, comments)
    VALUES (${refereeId}, ${gameId ?? null}, ${ratedBy}, ${rating}, ${comments ?? null});
  `;

  // Update referee's average rating
  await sql`
    UPDATE referees
    SET rating = (
      SELECT AVG(rating)::decimal(3,2)
      FROM referee_ratings
      WHERE referee_id = ${refereeId}
    )
    WHERE id = ${refereeId};
  `;
}
