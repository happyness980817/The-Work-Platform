import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  bigint,
  jsonb,
  primaryKey,
  timestamp,
} from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";

/* ── 1:1 DM 대화방 ── */

export const dmRooms = pgTable("dm_rooms", {
  dm_room_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  created_at: timestamp().notNull().defaultNow(),
});

export const dmRoomMembers = pgTable(
  "dm_room_members",
  {
    dm_room_id: bigint({ mode: "number" })
      .notNull()
      .references(() => dmRooms.dm_room_id, { onDelete: "cascade" }),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.profile_id, { onDelete: "cascade" }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.dm_room_id, table.profile_id] })],
);

/* ── DM 메시지 ── */

export const dmMessages = pgTable("dm_messages", {
  dm_message_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  dm_room_id: bigint({ mode: "number" })
    .notNull()
    .references(() => dmRooms.dm_room_id, { onDelete: "cascade" }),
  sender_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, { onDelete: "cascade" }),
  content: text().notNull(),
  likes: integer().notNull().default(0),
  created_at: timestamp().notNull().defaultNow(),
});

/* ── 세션(상담 채팅방) ── */

export const sessionRooms = pgTable("session_rooms", {
  session_room_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
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
  session_message_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  session_room_id: bigint({ mode: "number" })
    .notNull()
    .references(() => sessionRooms.session_room_id, { onDelete: "cascade" }),
  sender_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, { onDelete: "cascade" }),
  sender_type: text().notNull().$type<"client" | "facilitator" | "ai">(),
  content: text().notNull(),
  likes: integer().notNull().default(0),
  created_at: timestamp().notNull().defaultNow(),
});

/* Message likes */

export const dmMessageLikes = pgTable(
  "dm_message_likes",
  {
    dm_message_id: bigint({ mode: "number" })
      .notNull()
      .references(() => dmMessages.dm_message_id, { onDelete: "cascade" }),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.profile_id, { onDelete: "cascade" }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.dm_message_id, table.profile_id] }),
  ],
);

export const sessionMessageLikes = pgTable(
  "session_message_likes",
  {
    session_message_id: bigint({ mode: "number" })
      .notNull()
      .references(() => sessionMessages.session_message_id, {
        onDelete: "cascade",
      }),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.profile_id, { onDelete: "cascade" }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.session_message_id, table.profile_id] }),
  ],
);

/* The Work worksheets */

export const worksheets = pgTable("worksheets", {
  worksheet_id: uuid().primaryKey().defaultRandom(),
  session_room_id: bigint({ mode: "number" })
    .notNull()
    .references(() => sessionRooms.session_room_id, { onDelete: "cascade" }),
  client_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, { onDelete: "cascade" }),
  type: text().notNull().$type<"judge-your-neighbor" | "when-story-hard">(),
  data: jsonb().notNull(),
  created_at: timestamp().notNull().defaultNow(),
});
