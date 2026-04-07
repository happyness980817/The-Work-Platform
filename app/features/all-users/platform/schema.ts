import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";

/* ── 예약 ── */

export const bookings = pgTable("bookings", {
  booking_id: uuid().primaryKey().defaultRandom(),
  client_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, { onDelete: "cascade" }),
  facilitator_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, { onDelete: "cascade" }),
  date: text().notNull(),
  time: text().notNull(),
  timezone: text().notNull(),
  status: text().notNull().$type<"pending" | "confirmed" | "cancelled">().default("pending"),
  created_at: timestamp().notNull().defaultNow(),
});
