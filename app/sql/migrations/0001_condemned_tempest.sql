CREATE TABLE "dm_messages" (
	"message_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dm_room_members" (
	"member_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" uuid NOT NULL,
	"profile_id" uuid NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dm_rooms" (
	"room_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_session_members" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "bookings" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "chat_session_members" CASCADE;--> statement-breakpoint
DROP TABLE "bookings" CASCADE;--> statement-breakpoint
ALTER TABLE "messages" RENAME TO "session_messages";--> statement-breakpoint
ALTER TABLE "session_messages" DROP CONSTRAINT "messages_session_id_chat_sessions_session_id_fk";
--> statement-breakpoint
ALTER TABLE "session_messages" DROP CONSTRAINT "messages_sender_id_profiles_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD COLUMN "client_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD COLUMN "facilitator_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD COLUMN "session_number" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD COLUMN "is_active" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD COLUMN "started_at" timestamp;--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD COLUMN "ended_at" timestamp;--> statement-breakpoint
ALTER TABLE "dm_messages" ADD CONSTRAINT "dm_messages_room_id_dm_rooms_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."dm_rooms"("room_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dm_messages" ADD CONSTRAINT "dm_messages_sender_id_profiles_profile_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dm_room_members" ADD CONSTRAINT "dm_room_members_room_id_dm_rooms_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."dm_rooms"("room_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dm_room_members" ADD CONSTRAINT "dm_room_members_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_client_id_profiles_profile_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_facilitator_id_profiles_profile_id_fk" FOREIGN KEY ("facilitator_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_messages" ADD CONSTRAINT "session_messages_session_id_chat_sessions_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."chat_sessions"("session_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_messages" ADD CONSTRAINT "session_messages_sender_id_profiles_profile_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;