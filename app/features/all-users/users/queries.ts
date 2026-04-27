import client from '~/supa-client';

export const getUserById = async (profileId: string) => {
  const { data, error } = await client
    .from('profiles')
    .select(
      `
      profile_id,
      name,
      avatar,
      role,
      is_editor
      `
    )
    .eq('profile_id', profileId)
    .single();
  if (error) throw error;
  return data;
};
