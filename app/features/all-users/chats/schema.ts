import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";

/* ── DM 대화방 ── */

export const dmRooms = pgTable("dm_rooms", {
  room_id: uuid().primaryKey().defaultRandom(),
  created_at: timestamp().notNull().defaultNow(),
});

/* ── DM 참여자 ── */

export const dmRoomMembers = pgTable("dm_room_members", {
  member_id: uuid().primaryKey().defaultRandom(),
  room_id: uuid()
    .notNull()
    .references(() => dmRooms.room_id, { onDelete: "cascade" }),
  profile_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, { onDelete: "cascade" }),
  joined_at: timestamp().notNull().defaultNow(),
});

/* ── DM 메시지 ── */

export const dmMessages = pgTable("dm_messages", {
  message_id: uuid().primaryKey().defaultRandom(),
  room_id: uuid()
    .notNull()
    .references(() => dmRooms.room_id, { onDelete: "cascade" }),
  sender_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, { onDelete: "cascade" }),
  content: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
});

/* ── 세션(상담 채팅방) ── */

export const chatSessions = pgTable("chat_sessions", {
  session_id: uuid().primaryKey().defaultRandom(),
  room_code: text().notNull().unique(),
  client_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, { onDelete: "cascade" }),
  facilitator_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, { onDelete: "cascade" }),
  session_number: integer().notNull().default(1),
  is_active: boolean().notNull().default(false),
  openai_conversation_id: text(),
  started_at: timestamp(),
  ended_at: timestamp(),
  created_at: timestamp().notNull().defaultNow(),
});

/* ── 세션 메시지 ── */

export const sessionMessages = pgTable("session_messages", {
  message_id: uuid().primaryKey().defaultRandom(),
  session_id: uuid()
    .notNull()
    .references(() => chatSessions.session_id, { onDelete: "cascade" }),
  sender_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, { onDelete: "cascade" }),
  sender_type: text().notNull().$type<"client" | "facilitator" | "ai">(),
  content: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
});
