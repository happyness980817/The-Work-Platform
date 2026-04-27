import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '~/supa-client';

export const getFacilitators = async (
  client: SupabaseClient<Database>,
  limit?: number
) => {
  let query = client
    .from('facilitator_list_view')
    .select('*')
    .order('created_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
};

export const getFacilitatorById = async (
  client: SupabaseClient<Database>,
  facilitatorId: string
) => {
  const { data, error } = await client
    .from('facilitator_list_view')
    .select('*')
    .eq('profile_id', facilitatorId)
    .single();
  if (error) throw error;
  return data;
};
