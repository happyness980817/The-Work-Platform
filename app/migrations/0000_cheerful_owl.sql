CREATE TYPE "public"."role" AS ENUM('client', 'facilitator');--> statement-breakpoint
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
	"is_admin" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "client_profiles" ADD CONSTRAINT "client_profiles_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facilitator_profiles" ADD CONSTRAINT "facilitator_profiles_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;