import { createClient } from '@supabase/supabase-js';
import type { Database } from 'database.types';

const client = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_PUBLISHABLE_KEY!
);

export default client;
