ALTER TABLE "chat_sessions" RENAME TO "session_rooms";--> statement-breakpoint
ALTER TABLE "session_rooms" DROP CONSTRAINT "chat_sessions_room_code_unique";--> statement-breakpoint
ALTER TABLE "session_rooms" DROP CONSTRAINT "chat_sessions_client_id_profiles_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "session_rooms" DROP CONSTRAINT "chat_sessions_facilitator_id_profiles_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "session_messages" DROP CONSTRAINT "session_messages_session_id_chat_sessions_session_id_fk";
--> statement-breakpoint
ALTER TABLE "session_rooms" ADD CONSTRAINT "session_rooms_client_id_profiles_profile_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_rooms" ADD CONSTRAINT "session_rooms_facilitator_id_profiles_profile_id_fk" FOREIGN KEY ("facilitator_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_messages" ADD CONSTRAINT "session_messages_session_id_session_rooms_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session_rooms"("session_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_rooms" ADD CONSTRAINT "session_rooms_room_code_unique" UNIQUE("room_code");