import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";

/* ── 세션(채팅방) ── */

export const chatSessions = pgTable("chat_sessions", {
  session_id: uuid().primaryKey().defaultRandom(),
  room_code: text().notNull().unique(),
  openai_conversation_id: text(),
  created_at: timestamp().notNull().defaultNow(),
});

/* ── 세션 참여자 ── */

export const chatSessionMembers = pgTable("chat_session_members", {
  member_id: uuid().primaryKey().defaultRandom(),
  session_id: uuid()
    .notNull()
    .references(() => chatSessions.session_id, { onDelete: "cascade" }),
  profile_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, { onDelete: "cascade" }),
  joined_at: timestamp().notNull().defaultNow(),
});

/* ── 메시지 ── */

export const messages = pgTable("messages", {
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
