import client from '~/supa-client';

export const getFacilitators = async () => {
  const { data, error } = await client
    .from('profiles')
    .select(`
      profile_id,
      name,
      avatar,
      facilitator_profiles (
        bio,
        languages
      )
    `)
    .eq('role', 'facilitator');

  if (error) throw error;
  return data ?? [];
};
