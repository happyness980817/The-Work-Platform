import {
  pgTable,
  uuid,
  pgSchema,
  text,
  pgEnum,
  boolean,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

const users = pgSchema("auth").table("users", {
  id: uuid().primaryKey(),
});

export const roles = pgEnum("role", ["client", "facilitator"]);

/* ── 공통 프로필 (모든 유저 — 다른 테이블은 여기를 FK로 참조) ── */

export const profiles = pgTable("profiles", {
  profile_id: uuid()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  role: roles().notNull().default("client"),
  name: text().notNull(),
  avatar: text(),
  is_admin: boolean().notNull().default(false),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

/* ── 클라이언트 프로필 (클라이언트 전용 확장) ── */

export const clientProfiles = pgTable("client_profiles", {
  profile_id: uuid()
    .primaryKey()
    .references(() => profiles.profile_id, { onDelete: "cascade" }),
  bio: text(),
});

/* ── 퍼실리테이터 프로필 (상담사 전용 확장) ── */

export const facilitatorProfiles = pgTable("facilitator_profiles", {
  profile_id: uuid()
    .primaryKey()
    .references(() => profiles.profile_id, { onDelete: "cascade" }),
  bio: text(),
  introduction: text(),
  languages: jsonb().$type<string[]>().default([]),
  availability: text(),
});
