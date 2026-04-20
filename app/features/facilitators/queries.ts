import client from '~/supa-client';

export const getFacilitatorsInfo = async () => {
  const { data, error } = await client.from('facilitator_profiles').select('*');
  if (error) throw error;
  return data;
};
