import {
  createBrowserClient,
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr';
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

const browserClient = createBrowserClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_PUBLISHABLE_KEY!
);

export const makeSSRClient = (request: Request) => {
  const headers = new Headers();
  const serverSideClient = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          const cookies = parseCookieHeader(
            request.headers.get('Cookie') ?? ''
          );
          return cookies.map(({ name, value }) => ({
            name,
            value: value ?? '',
          }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            headers.append(
              'Set-Cookie',
              serializeCookieHeader(name, value, options)
            );
          });
        },
      },
    }
  );
  return {
    client: serverSideClient,
    headers,
  };
};

export default browserClient;
