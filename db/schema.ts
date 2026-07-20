import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const rsvps = pgTable("rsvps", {
  id: serial().primaryKey(),
  name: text().notNull(),
  guestCount: integer("guest_count").notNull(),
  message: text().default(""),
  createdAt: timestamp("created_at").defaultNow(),
});
