import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'database.types';
import { redirect } from 'react-router';

export const getLoggedInUserId = async (
  client: SupabaseClient<Database>,
) => {
  const { data, error } = await client.auth.getUser();
  if (error || data.user == null) throw redirect('/auth/login');
  return data.user.id;
};

export const getUserById = async (
  profileId: string,
  client: SupabaseClient<Database>,
) => {
  const { data, error } = await client
    .from('profiles')
    .select(
      `
      profile_id,
      name,
      avatar,
      role,
      is_editor,
      created_at
      `,
    )
    .eq('profile_id', profileId)
    .single();
  if (error) throw error;
  return data;
};

export const getFacilitatorProfileById = async (
  profileId: string,
  client: SupabaseClient<Database>,
) => {
  const { data, error } = await client
    .from('facilitator_profiles')
    .select(
      `
      profile_id,
      bio,
      introduction,
      languages,
      availability,
      is_certified
      `,
    )
    .eq('profile_id', profileId)
    .single();
  if (error) throw error;
  return data;
};
