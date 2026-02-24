"use server";

import { neon } from "@neondatabase/serverless";

export async function addReferee(data: { name: string; phone_number: string }) {
  const sql = neon(process.env.DATABASE_URL!);

  await sql`
    INSERT INTO referees (name, phone_number, is_active)
    VALUES (${data.name}, ${data.phone_number}, true);
  `;
}

export async function getReferees() {
  const sql = neon(process.env.DATABASE_URL!);

  return await sql`
    SELECT id, name
    FROM referees
    WHERE is_active = true;
  `;
}