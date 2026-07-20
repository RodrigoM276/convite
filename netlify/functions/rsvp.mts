import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { rsvps } from "../../db/schema.js";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const guestCount = Number(body?.guestCount);
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!name || !Number.isInteger(guestCount) || guestCount < 1) {
    return Response.json({ error: "Nome e número de convidados são obrigatórios." }, { status: 400 });
  }

  const [rsvp] = await db.insert(rsvps).values({ name, guestCount, message }).returning();

  return Response.json(rsvp, { status: 201 });
};

export const config: Config = {
  path: "/api/rsvp",
};
