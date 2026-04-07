CREATE TYPE "public"."role" AS ENUM('client', 'facilitator');--> statement-breakpoint
CREATE TABLE "chat_session_members" (
	"member_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"profile_id" uuid NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"session_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_code" text NOT NULL,
	"openai_conversation_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chat_sessions_room_code_unique" UNIQUE("room_code")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"message_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"sender_type" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"booking_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"facilitator_id" uuid NOT NULL,
	"date" text NOT NULL,
	"time" text NOT NULL,
	"timezone" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_profiles" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"bio" text
);
--> statement-breakpoint
CREATE TABLE "facilitator_profiles" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"bio" text,
	"introduction" text,
	"languages" jsonb DEFAULT '[]'::jsonb,
	"availability" text,
	"is_certified" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"role" "role" DEFAULT 'client' NOT NULL,
	"name" text NOT NULL,
	"avatar" text,
	"is_editor" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_session_members" ADD CONSTRAINT "chat_session_members_session_id_chat_sessions_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."chat_sessions"("session_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_session_members" ADD CONSTRAINT "chat_session_members_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_session_id_chat_sessions_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."chat_sessions"("session_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_profiles_profile_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_client_id_profiles_profile_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_facilitator_id_profiles_profile_id_fk" FOREIGN KEY ("facilitator_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_profiles" ADD CONSTRAINT "client_profiles_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facilitator_profiles" ADD CONSTRAINT "facilitator_profiles_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;