import { createClient } from '@supabase/supabase-js';
import type { MergeDeep, SetNonNullable, SetFieldType } from 'type-fest';
import type { Database as SupabaseDatabase } from 'database.types';

export type Database = MergeDeep<
  SupabaseDatabase,
  {
    public: {
      Views: {
        facilitator_list_view: {
          Row: SetFieldType<
            SetNonNullable<
              SupabaseDatabase['public']['Views']['facilitator_list_view']['Row']
            >,
            // 진짜로 null 일 수 있는 컬럼들은 다시 nullable 로 복원
            'avatar' | 'bio' | 'introduction' | 'availability',
            string | null
          > & {
            // jsonb → string[] 로 덮어쓰기
            languages: string[];
          };
        };
      };
    };
  }
>;

const client = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_PUBLISHABLE_KEY!
);

export default client;
