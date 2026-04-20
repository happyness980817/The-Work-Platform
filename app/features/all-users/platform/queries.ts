import client from '~/supa-client';

export const getFacilitators = async (limit?: number) => {
  let query = client
    .from('profiles')
    .select(
      `
      profile_id,
      name,
      avatar,
      facilitator_profiles (
        bio,
        languages
      )
    `
    )
    .eq('role', 'facilitator')
    .order('created_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
};
