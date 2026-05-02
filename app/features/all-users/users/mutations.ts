import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'database.types';

export const updateUser = async (
  client: SupabaseClient<Database>,
  {
    id,
    name,
  }: {
    id: string;
    name: string;
  },
) => {
  const { error } = await client
    .from('profiles')
    .update({ name })
    .eq('profile_id', id);
  if (error) throw error;
};

export const updateUserAvatar = async (
  client: SupabaseClient<Database>,
  {
    id,
    avatarUrl,
  }: {
    id: string;
    avatarUrl: string;
  },
) => {
  const { error } = await client
    .from('profiles')
    .update({ avatar: avatarUrl })
    .eq('profile_id', id);
  if (error) throw error;
};

export const updateFacilitatorProfile = async (
  client: SupabaseClient<Database>,
  {
    id,
    bio,
    introduction,
    languages,
  }: {
    id: string;
    bio: string;
    introduction: string;
    languages: string[];
  },
) => {
  const { error } = await client
    .from('facilitator_profiles')
    .update({ bio, introduction, languages })
    .eq('profile_id', id);
  if (error) throw error;
};

export const updatePassword = async (
  client: SupabaseClient<Database>,
  {
    newPassword,
  }: {
    newPassword: string;
  },
) => {
  const { error } = await client.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
};
