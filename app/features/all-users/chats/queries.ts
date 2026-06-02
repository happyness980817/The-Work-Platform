// Draft skeleton for chat message queries.
// Keep this file commented until chat DB setup and database.types.ts regeneration
// are complete. The active implementation should follow the same shape, but
// generated FK aliases must be checked before uncommenting.

// import type { SupabaseClient } from '@supabase/supabase-js';
// import type { Database } from 'database.types';

// export const getDmRooms = async (
//   client: SupabaseClient<Database>,
//   { userId }: { userId: string },
// ) => {
//   // Sidebar room list. Same idea as wemake's getMessages:
//   // app code asks a view for rooms visible to this profile.
//   const { data, error } = await client
//     .from('dm_rooms_list_view')
//     .select('*')
//     .eq('profile_id', userId)
//     .order('last_message_at', { ascending: false, nullsFirst: false });
//
//   if (error) throw error;
//   return data ?? [];
// };

// export const getSessionRooms = async (
//   client: SupabaseClient<Database>,
//   { userId }: { userId: string },
// ) => {
//   const { data, error } = await client
//     .from('session_rooms_list_view')
//     .select('*')
//     .or(`client_id.eq.${userId},facilitator_id.eq.${userId}`)
//     .order('created_at', { ascending: false });
//
//   if (error) throw error;
//   return data ?? [];
// };

// export const getDmRecipient = async (
//   client: SupabaseClient<Database>,
//   {
//     dmRoomId,
//     userId,
//   }: {
//     dmRoomId: number;
//     userId: string;
//   },
// ) => {
//   // Same guard as getDmMessages: only a member can ask who the other member is.
//   const { count, error: memberError } = await client
//     .from('dm_room_members')
//     .select('*', { count: 'exact', head: true })
//     .eq('dm_room_id', dmRoomId)
//     .eq('profile_id', userId);
//
//   if (memberError) throw memberError;
//   if (count === 0) throw new Error('You are not a member of this DM room');
//
//   // 1:1 DM means "recipient" is the other row in dm_room_members.
//   const { data, error } = await client
//     .from('dm_room_members')
//     .select(
//       `
//       profile:profiles!profile_id (
//         profile_id,
//         name,
//         avatar
//       )
//       `,
//     )
//     .eq('dm_room_id', dmRoomId)
//     .neq('profile_id', userId)
//     .single();
//
//   if (error) throw error;
//   return data.profile;
// };

// export const getDmMessages = async (
//   client: SupabaseClient<Database>,
//   {
//     dmRoomId,
//     userId,
//   }: {
//     dmRoomId: number;
//     userId: string;
//   },
// ) => {
//   // 1. Guard first: a user can only read messages for a DM room they belong to.
//   // This mirrors wemake's getMessagesByRoomId count check.
//   const { count, error: memberError } = await client
//     .from('dm_room_members')
//     .select('*', { count: 'exact', head: true })
//     .eq('dm_room_id', dmRoomId)
//     .eq('profile_id', userId);
//
//   if (memberError) throw memberError;
//   if (count === 0) throw new Error('You are not a member of this DM room');
//
//   // 2. Read all MVP messages in ascending order. Pagination is intentionally
//   // not added yet because the current plan says full-load for MVP.
//   const { data: messages, error: messagesError } = await client
//     .from('dm_messages')
//     .select(
//       `
//       dm_message_id,
//       dm_room_id,
//       sender_id,
//       content,
//       likes,
//       created_at,
//       sender:profiles!sender_id (
//         profile_id,
//         name,
//         avatar
//       )
//       `,
//     )
//     .eq('dm_room_id', dmRoomId)
//     .order('created_at', { ascending: true });
//
//   if (messagesError) throw messagesError;
//   if (!messages?.length) return [];
//
//   // 3. Fetch my likes separately, then merge in JS. This avoids adding another
//   // DB view just to compute is_liked.
//   const dmMessageIds = messages.map((message) => message.dm_message_id);
//   const { data: likes, error: likesError } = await client
//     .from('dm_message_likes')
//     .select('dm_message_id')
//     .eq('profile_id', userId)
//     .in('dm_message_id', dmMessageIds);
//
//   if (likesError) throw likesError;
//
//   const likedMessageIds = new Set(
//     likes?.map((like) => like.dm_message_id) ?? [],
//   );
//
//   return messages.map((message) => ({
//     ...message,
//     is_liked: likedMessageIds.has(message.dm_message_id),
//   }));
// };

// export const getSessionById = async (
//   client: SupabaseClient<Database>,
//   { sessionRoomId }: { sessionRoomId: number },
// ) => {
//   const { data, error } = await client
//     .from('session_rooms')
//     .select(
//       `
//       session_room_id,
//       client_id,
//       facilitator_id,
//       session_number,
//       is_active,
//       started_at,
//       ended_at,
//       created_at,
//       client:profiles!client_id (
//         profile_id,
//         name,
//         avatar
//       ),
//       facilitator:profiles!facilitator_id (
//         profile_id,
//         name,
//         avatar
//       )
//       `,
//     )
//     .eq('session_room_id', sessionRoomId)
//     .single();
//
//   if (error) throw error;
//   return data;
// };

// export const getSessionParticipant = async (
//   client: SupabaseClient<Database>,
//   {
//     sessionRoomId,
//     userId,
//   }: {
//     sessionRoomId: number;
//     userId: string;
//   },
// ) => {
//   const { data, error } = await client
//     .from('session_rooms')
//     .select('client_id, facilitator_id')
//     .eq('session_room_id', sessionRoomId)
//     .single();
//
//   if (error) throw error;
//   if (data.client_id === userId) return 'client' as const;
//   if (data.facilitator_id === userId) return 'facilitator' as const;
//   return null;
// };

// export const getLatestSessionRoom = async (
//   client: SupabaseClient<Database>,
//   {
//     clientId,
//     facilitatorId,
//   }: {
//     clientId: string;
//     facilitatorId: string;
//   },
// ) => {
//   // Used by the DM page's "create/start session" action. It does not care
//   // whether the previous session is active; the product decision is "go to the
//   // latest session for this pair, or create one if none exists".
//   const { data, error } = await client
//     .from('session_rooms')
//     .select('*')
//     .eq('client_id', clientId)
//     .eq('facilitator_id', facilitatorId)
//     .order('created_at', { ascending: false })
//     .limit(1)
//     .maybeSingle();
//
//   if (error) throw error;
//   return data;
// };

// export const getSessionMessages = async (
//   client: SupabaseClient<Database>,
//   {
//     sessionRoomId,
//     userId,
//   }: {
//     sessionRoomId: number;
//     userId: string;
//   },
// ) => {
//   // 1. Guard first: only the client or facilitator in this session can read it.
//   const { data: session, error: sessionError } = await client
//     .from('session_rooms')
//     .select('session_room_id, client_id, facilitator_id')
//     .eq('session_room_id', sessionRoomId)
//     .single();
//
//   if (sessionError) throw sessionError;
//
//   const isParticipant =
//     session.client_id === userId || session.facilitator_id === userId;
//   if (!isParticipant) throw new Error('You are not a participant of this session');
//
//   // 2. Read all MVP session messages in chronological order.
//   const { data: messages, error: messagesError } = await client
//     .from('session_messages')
//     .select(
//       `
//       session_message_id,
//       session_room_id,
//       sender_id,
//       sender_type,
//       content,
//       likes,
//       created_at,
//       sender:profiles!sender_id (
//         profile_id,
//         name,
//         avatar
//       )
//       `,
//     )
//     .eq('session_room_id', sessionRoomId)
//     .order('created_at', { ascending: true });
//
//   if (messagesError) throw messagesError;
//   if (!messages?.length) return [];
//
//   // 3. Fetch only the current user's likes for these messages and merge them.
//   const sessionMessageIds = messages.map(
//     (message) => message.session_message_id,
//   );
//   const { data: likes, error: likesError } = await client
//     .from('session_message_likes')
//     .select('session_message_id')
//     .eq('profile_id', userId)
//     .in('session_message_id', sessionMessageIds);
//
//   if (likesError) throw likesError;
//
//   const likedMessageIds = new Set(
//     likes?.map((like) => like.session_message_id) ?? [],
//   );
//
//   return messages.map((message) => ({
//     ...message,
//     is_liked: likedMessageIds.has(message.session_message_id),
//   }));
// };

// Optional next skeleton, after worksheet UI/backend contract is confirmed:
//
// export const getLatestWorksheet = async (
//   client: SupabaseClient<Database>,
//   {
//     sessionRoomId,
//     type,
//   }: {
//     sessionRoomId: number;
//     type: 'judge-your-neighbor' | 'when-story-hard';
//   },
// ) => {
//   // Select latest worksheet for session/type and return null if none exists.
// };
