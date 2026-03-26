import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  uuid,
  bigint,
} from "drizzle-orm/pg-core";
import { profiles } from "~/features/all-users/users/schema";

/* ── Enums ── */

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
]);

/* ── 예약 ── */

export const bookings = pgTable("bookings", {
  booking_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  client_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, { onDelete: "cascade" }),
  facilitator_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, { onDelete: "cascade" }),
  date: timestamp().notNull(),
  time: text().notNull(),
  timezone: text().notNull().default("Asia/Seoul"),
  status: bookingStatusEnum().notNull().default("pending"),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
