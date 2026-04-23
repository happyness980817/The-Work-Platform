import client from '~/supa-client';

export const getFacilitators = async (limit?: number) => {
  let query = client
    .from('facilitator_list_view')
    .select('*')
    .order('created_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
};
