"use server";

import { neon } from "@neondatabase/serverless";
import { currentUser } from "@clerk/nextjs/server";

const sql = neon(process.env.DATABASE_URL!);

export async function syncUser() {
  const user = await currentUser();
  if (!user) return null;

  const clerkId = user.id;
  const email = user.emailAddresses[0]?.emailAddress?? null;
  if (!email){
    console.warn(`User ${user.id} has no email address `);
  }
  const firstName = user.firstName;
  const lastName = user.lastName;
  const username = user.username;

  await sql`
    INSERT INTO users (clerk_id, email, first_name, last_name, username)
    VALUES (${clerkId}, ${email}, ${firstName}, ${lastName}, ${username})
    ON CONFLICT (clerk_id)
    DO UPDATE SET 
      email = EXCLUDED.email,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      username = EXCLUDED.username;
  `;
}
