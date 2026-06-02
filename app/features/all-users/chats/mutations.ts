// Draft skeleton for chat mutations.
// Keep this file commented until chat DB setup and database.types.ts regeneration
// are complete. The active implementation should follow the same shape, but
// generated RPC return fields and FK aliases must be checked before uncommenting.

// import type { SupabaseClient } from '@supabase/supabase-js';
// import type { Database } from 'database.types';
// import { getLoggedInUserId } from '../users/queries';

// export const getOrCreateDmRoom = async (
//   client: SupabaseClient<Database>,
//   { otherId }: { otherId: string },
// ) => {
//   // 1. Decide the current user on the server. Do not trust a form-provided
//   // sender/self id for permission-sensitive mutations.
//   const selfId = await getLoggedInUserId(client);
//
//   if (selfId === otherId) {
//     throw new Error('You cannot create a DM room with yourself');
//   }
//
//   // 2. Match wemake's flow: ask the DB if these two users already share a
//   // 1:1 room. The RPC must only return a room with exactly these 2 members.
//   const { data: existing, error: roomLookupError } = await client
//     .rpc('get_room', {
//       from_user_id: selfId,
//       to_user_id: otherId,
//     })
//     .maybeSingle();
//
//   if (roomLookupError) throw roomLookupError;
//   if (existing?.dm_room_id) return existing.dm_room_id;
//
//   // 3. No existing room: create the room first. Like wemake, the DB identity
//   // column creates the id; no app-side UUID is needed.
//   const { data: room, error: createRoomError } = await client
//     .from('dm_rooms')
//     .insert({})
//     .select('dm_room_id')
//     .single();
//
//   if (createRoomError) throw createRoomError;
//
//   // 4. Insert members sequentially, not as one batch. The planned RLS policy
//   // allows the second insert because the current user is already a member.
//   const { error: selfMemberError } = await client
//     .from('dm_room_members')
//     .insert({
//       dm_room_id: room.dm_room_id,
//       profile_id: selfId,
//     });
//
//   if (selfMemberError) throw selfMemberError;
//
//   const { error: otherMemberError } = await client
//     .from('dm_room_members')
//     .insert({
//       dm_room_id: room.dm_room_id,
//       profile_id: otherId,
//     });
//
//   if (otherMemberError) throw otherMemberError;
//
//   return room.dm_room_id;
// };

// export const sendDmMessage = async (
//   client: SupabaseClient<Database>,
//   {
//     dmRoomId,
//     content,
//   }: {
//     dmRoomId: number;
//     content: string;
//   },
// ) => {
//   const senderId = await getLoggedInUserId(client);
//   const trimmedContent = content.trim();
//
//   if (!trimmedContent) {
//     throw new Error('Message content is required');
//   }
//
//   // Guard before insert. RLS also enforces this, but the explicit check gives
//   // a clearer application-level error and matches wemake's pattern.
//   const { count, error: memberError } = await client
//     .from('dm_room_members')
//     .select('*', { count: 'exact', head: true })
//     .eq('dm_room_id', dmRoomId)
//     .eq('profile_id', senderId);
//
//   if (memberError) throw memberError;
//   if (count === 0) throw new Error('You are not a member of this DM room');
//
//   const { data, error } = await client
//     .from('dm_messages')
//     .insert({
//       dm_room_id: dmRoomId,
//       sender_id: senderId,
//       content: trimmedContent,
//     })
//     .select('dm_message_id')
//     .single();
//
//   if (error) throw error;
//   return data.dm_message_id;
// };

// export const sendSessionMessage = async (
//   client: SupabaseClient<Database>,
//   {
//     sessionRoomId,
//     content,
//     aiDraftId,
//   }: {
//     sessionRoomId: number;
//     content: string;
//     // Copilot integration can pass this later. Basic chat can ignore it.
//     aiDraftId?: string;
//   },
// ) => {
//   const senderId = await getLoggedInUserId(client);
//   const trimmedContent = content.trim();
//
//   if (!trimmedContent) {
//     throw new Error('Message content is required');
//   }
//
//   // The client must not decide sender_type. Derive it from session_rooms.
//   const { data: session, error: sessionError } = await client
//     .from('session_rooms')
//     .select('client_id, facilitator_id')
//     .eq('session_room_id', sessionRoomId)
//     .single();
//
//   if (sessionError) throw sessionError;
//
//   const senderType =
//     session.client_id === senderId
//       ? 'client'
//       : session.facilitator_id === senderId
//         ? 'facilitator'
//         : null;
//
//   if (!senderType) {
//     throw new Error('You are not a participant of this session');
//   }
//
//   const { data: message, error: messageError } = await client
//     .from('session_messages')
//     .insert({
//       session_room_id: sessionRoomId,
//       sender_id: senderId,
//       sender_type: senderType,
//       content: trimmedContent,
//     })
//     .select('session_message_id')
//     .single();
//
//   if (messageError) throw messageError;
//
//   // Copilot phase only: after ai_drafts exists, update the draft here when
//   // aiDraftId is present and senderId is the facilitator.
//   //
//   // if (aiDraftId) {
//   //   const { error: draftError } = await client
//   //     .from('ai_drafts')
//   //     .update({
//   //       used: true,
//   //       sent_session_message_id: message.session_message_id,
//   //     })
//   //     .eq('draft_id', aiDraftId)
//   //     .eq('facilitator_id', senderId);
//   //
//   //   if (draftError) throw draftError;
//   // }
//
//   return message.session_message_id;
// };

// export const createSession = async (
//   client: SupabaseClient<Database>,
//   {
//     clientId,
//     facilitatorId,
//   }: {
//     clientId: string;
//     facilitatorId: string;
//   },
// ) => {
//   const selfId = await getLoggedInUserId(client);
//
//   if (selfId !== facilitatorId) {
//     throw new Error('Only the facilitator can create this session');
//   }
//
//   const { data: latestSession, error: latestSessionError } = await client
//     .from('session_rooms')
//     .select('session_number')
//     .eq('client_id', clientId)
//     .eq('facilitator_id', facilitatorId)
//     .order('session_number', { ascending: false })
//     .limit(1)
//     .maybeSingle();
//
//   if (latestSessionError) throw latestSessionError;
//
//   const nextSessionNumber = (latestSession?.session_number ?? 0) + 1;
//
//   // Like wemake rooms, session_rooms uses a DB-generated bigint identity id.
//   const { data, error } = await client
//     .from('session_rooms')
//     .insert({
//       client_id: clientId,
//       facilitator_id: facilitatorId,
//       session_number: nextSessionNumber,
//     })
//     .select('session_room_id')
//     .single();
//
//   if (error) throw error;
//   return data.session_room_id;
// };

// export const startSession = async (
//   client: SupabaseClient<Database>,
//   { sessionRoomId }: { sessionRoomId: number },
// ) => {
//   const facilitatorId = await getLoggedInUserId(client);
//
//   const { error } = await client
//     .from('session_rooms')
//     .update({
//       is_active: true,
//       started_at: new Date().toISOString(),
//     })
//     .eq('session_room_id', sessionRoomId)
//     .eq('facilitator_id', facilitatorId);
//
//   if (error) throw error;
// };

// export const endSession = async (
//   client: SupabaseClient<Database>,
//   { sessionRoomId }: { sessionRoomId: number },
// ) => {
//   const facilitatorId = await getLoggedInUserId(client);
//
//   const { error } = await client
//     .from('session_rooms')
//     .update({
//       is_active: false,
//       ended_at: new Date().toISOString(),
//     })
//     .eq('session_room_id', sessionRoomId)
//     .eq('facilitator_id', facilitatorId);
//
//   if (error) throw error;
// };

// export const toggleDmMessageLike = async (
//   client: SupabaseClient<Database>,
//   {
//     dmMessageId,
//     liked,
//   }: {
//     dmMessageId: number;
//     liked: boolean;
//   },
// ) => {
//   const profileId = await getLoggedInUserId(client);
//
//   if (liked) {
//     const { error } = await client.from('dm_message_likes').insert({
//       dm_message_id: dmMessageId,
//       profile_id: profileId,
//     });
//
//     if (error) throw error;
//     return;
//   }
//
//   const { error } = await client
//     .from('dm_message_likes')
//     .delete()
//     .eq('dm_message_id', dmMessageId)
//     .eq('profile_id', profileId);
//
//   if (error) throw error;
// };

// export const toggleSessionMessageLike = async (
//   client: SupabaseClient<Database>,
//   {
//     sessionMessageId,
//     liked,
//   }: {
//     sessionMessageId: number;
//     liked: boolean;
//   },
// ) => {
//   const profileId = await getLoggedInUserId(client);
//
//   if (liked) {
//     const { error } = await client.from('session_message_likes').insert({
//       session_message_id: sessionMessageId,
//       profile_id: profileId,
//     });
//
//     if (error) throw error;
//     return;
//   }
//
//   const { error } = await client
//     .from('session_message_likes')
//     .delete()
//     .eq('session_message_id', sessionMessageId)
//     .eq('profile_id', profileId);
//
//   if (error) throw error;
// };

// export const createWorksheet = async (
//   client: SupabaseClient<Database>,
//   {
//     sessionRoomId,
//     type,
//     data,
//   }: {
//     sessionRoomId: number;
//     type: 'judge-your-neighbor' | 'when-story-hard';
//     data: unknown;
//   },
// ) => {
//   const clientId = await getLoggedInUserId(client);
//
//   // Explicit app-level guard. RLS also enforces this.
//   const { data: session, error: sessionError } = await client
//     .from('session_rooms')
//     .select('client_id')
//     .eq('session_room_id', sessionRoomId)
//     .single();
//
//   if (sessionError) throw sessionError;
//   if (session.client_id !== clientId) {
//     throw new Error('Only the client can create a worksheet for this session');
//   }
//
//   const { data: worksheet, error } = await client
//     .from('worksheets')
//     .insert({
//       session_room_id: sessionRoomId,
//       client_id: clientId,
//       type,
//       data,
//     })
//     .select('worksheet_id')
//     .single();
//
//   if (error) throw error;
//   return worksheet.worksheet_id;
// };
