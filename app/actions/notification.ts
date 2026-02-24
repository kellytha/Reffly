"use server";

import twilio from "twilio";

export async function sendAllocationMessage({
  phone_number,
  game,
  time_slot,
  field_number,
}: {
  phone_number: string;
  game: string;
  time_slot: string;
  field_number: string;
}) {
  const client = twilio(
    process.env.TWILIO_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  );

  await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER!, 
    to: phone_number,                       
    body: `🏉 Ref Allocation\n\nGame: ${game}\nTime: ${time_slot}\nField: ${field_number}\n\nPlease confirm.`,
  });
}