# 채팅 DB 셋업 계획

이 문서는 채팅(DM/세션)에 필요한 DB 작업만 다룹니다. 앱 코드 구현은 [`chat_app_plan.md`](./chat_app_plan.md), 워크시트 UI는 [`chat_session_frontend_features_plan.md`](./chat_session_frontend_features_plan.md), AI 코파일럿은 [`copilot_implementation_plan.md`](./copilot_implementation_plan.md)를 따릅니다.

## 핵심 결정

- DM은 wemake 방식처럼 `dm_rooms` + `dm_room_members` + `dm_messages` 구조를 사용한다.
- DM/세션 room id는 앱에서 UUID를 만들지 않고 DB `bigint identity`가 만든다.
- 컬럼 이름은 `dm_room_id`, `dm_message_id`, `session_room_id`, `session_message_id`를 사용한다.
- `room_code`와 `crypto.randomUUID()`는 사용하지 않는다.
- 세션 참가자는 `session_rooms.client_id`, `session_rooms.facilitator_id`로 표현한다. 별도 `session_room_members`는 두지 않는다.
- `get_room` RPC는 DM 1:1 방 조회 전용이다.
- 실제 DM 방 생성은 `get_or_create_dm_room` RPC로 처리한다. `dm_rooms`, `dm_room_members` 직접 INSERT는 일반 policy로 열지 않는다.

## 작업 순서 요약

| Step | 담당 | 작업 |
|---|---|---|
| 1 | 에이전트 | `app/features/all-users/chats/schema.ts` 수정 |
| 2 | 사용자 | `npm run db:generate` 실행 후 생성된 migration SQL 검토 |
| 3 | 사용자 | `npm run db:migrate` 실행 |
| 4 | 사용자 | Supabase SQL Editor에서 RPC + view SQL 실행 |
| 5 | 사용자 | Supabase SQL Editor에서 좋아요 trigger SQL 실행 |
| 6 | 사용자 | Supabase SQL Editor에서 RLS policy SQL 실행 |
| 7 | 사용자 | Supabase SQL Editor에서 Storage bucket/policies SQL 실행 |
| 8 | 사용자 | Supabase Dashboard에서 Realtime replication 활성화 |
| 9 | 사용자 | `npm run db:typegen` 실행 |

> 스키마, migration, RPC, view, trigger, RLS를 바꾸면 마지막에 반드시 `npm run db:typegen`까지 실행합니다. `database.types.ts`가 낡은 상태면 `queries.ts`, `mutations.ts`, loader/action 타입이 실제 DB 계약과 어긋납니다.

## 완료 기준

- `database.types.ts`에 `get_room`, `get_or_create_dm_room`, `dm_rooms_list_view`, `session_rooms_list_view`, likes 테이블, `worksheets`가 반영되어야 한다.
- `database.types.ts`에 새 id 컬럼명(`dm_room_id`, `dm_message_id`, `session_room_id`, `session_message_id`)이 반영되어야 한다.
- `get_room`은 두 참가자가 모두 속하고 참가자 수가 정확히 2명인 DM 방만 반환해야 한다.
- RLS는 helper function 없이 작성하되, 채팅 본문/워크시트 같은 private 데이터는 참가자만 읽고 쓸 수 있어야 한다.
- `avatars` Storage bucket은 public이고, 로그인 유저는 자기 폴더(`auth.uid()/...`)에만 이미지 파일을 업로드/수정/삭제할 수 있어야 한다.
- Realtime은 `dm_messages`, `session_messages` INSERT가 켜져 있어야 한다. 좋아요 카운트 실시간 반영이 필요하면 두 메시지 테이블의 UPDATE도 켠다.
- DM 동시 생성 race는 `get_or_create_dm_room` RPC의 advisory lock으로 MVP 수준에서 막는다. 별도 unique pair 컬럼은 두지 않는다.

## Step 1. `chats/schema.ts` 변경

아래는 최종 목표 구조입니다. 현재 파일에 이미 일부 테이블이 있으면 이름과 타입을 이 계약에 맞춥니다.

```ts
import {
  bigint,
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { profiles } from '../users/schema';

export const dmRooms = pgTable('dm_rooms', {
  dm_room_id: bigint({ mode: 'number' })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  created_at: timestamp().notNull().defaultNow(),
});

export const dmRoomMembers = pgTable(
  'dm_room_members',
  {
    dm_room_id: bigint({ mode: 'number' })
      .notNull()
      .references(() => dmRooms.dm_room_id, { onDelete: 'cascade' }),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.profile_id, { onDelete: 'cascade' }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.dm_room_id, table.profile_id] })]
);

export const dmMessages = pgTable('dm_messages', {
  dm_message_id: bigint({ mode: 'number' })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  dm_room_id: bigint({ mode: 'number' })
    .notNull()
    .references(() => dmRooms.dm_room_id, { onDelete: 'cascade' }),
  sender_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, { onDelete: 'cascade' }),
  content: text().notNull(),
  likes: integer().notNull().default(0),
  created_at: timestamp().notNull().defaultNow(),
});

export const sessionRooms = pgTable('session_rooms', {
  session_room_id: bigint({ mode: 'number' })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  client_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, { onDelete: 'cascade' }),
  facilitator_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, { onDelete: 'cascade' }),
  session_number: integer().notNull().default(1),
  is_active: boolean().notNull().default(false),
  openai_conversation_id: text(),
  started_at: timestamp(),
  ended_at: timestamp(),
  created_at: timestamp().notNull().defaultNow(),
});

export const sessionMessages = pgTable('session_messages', {
  session_message_id: bigint({ mode: 'number' })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  session_room_id: bigint({ mode: 'number' })
    .notNull()
    .references(() => sessionRooms.session_room_id, { onDelete: 'cascade' }),
  sender_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, { onDelete: 'cascade' }),
  sender_type: text().notNull().$type<'client' | 'facilitator' | 'ai'>(),
  content: text().notNull(),
  likes: integer().notNull().default(0),
  created_at: timestamp().notNull().defaultNow(),
});

export const dmMessageLikes = pgTable(
  'dm_message_likes',
  {
    dm_message_id: bigint({ mode: 'number' })
      .notNull()
      .references(() => dmMessages.dm_message_id, { onDelete: 'cascade' }),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.profile_id, { onDelete: 'cascade' }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.dm_message_id, table.profile_id] })]
);

export const sessionMessageLikes = pgTable(
  'session_message_likes',
  {
    session_message_id: bigint({ mode: 'number' })
      .notNull()
      .references(() => sessionMessages.session_message_id, {
        onDelete: 'cascade',
      }),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.profile_id, { onDelete: 'cascade' }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.session_message_id, table.profile_id] }),
  ]
);

export const worksheets = pgTable('worksheets', {
  worksheet_id: uuid().primaryKey().defaultRandom(),
  session_room_id: bigint({ mode: 'number' })
    .notNull()
    .references(() => sessionRooms.session_room_id, { onDelete: 'cascade' }),
  client_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, { onDelete: 'cascade' }),
  type: text().notNull().$type<'judge-your-neighbor' | 'when-story-hard'>(),
  data: jsonb().notNull(),
  created_at: timestamp().notNull().defaultNow(),
});
```

> `timestamp()`는 timezone 없이 wemake와 같은 스타일을 유지합니다.
> 기존 `room_id`, `session_id`, `message_id`, `room_code`가 남아 있으면 migration 생성 전에 제거/rename 여부를 확인합니다.

## Step 2. 마이그레이션 생성

스키마 변경 직후 로컬에서:

```bash
npm run db:generate
```

생성된 migration 파일을 반드시 검토합니다. 기존 UUID PK를 bigint identity로 바꾸는 경우, 이미 데이터가 있으면 단순 alter가 아니라 drop/recreate 또는 데이터 이전 전략이 필요합니다. 아직 실제 데이터가 없다면 테이블 재생성이 가장 단순합니다.

## Step 3. 마이그레이션 적용

검토가 끝난 migration만 적용합니다.

```bash
npm run db:migrate
```

이 단계 직후에는 DB table만 바뀐 상태입니다. 이후 RPC/view/trigger/RLS/Storage/Realtime까지 끝낸 다음 마지막에 typegen을 실행합니다.

## Step 4. RPC + DB view

SQL 파일 저장 위치:

- `app/sql/functions/get_room.sql`: `get_room` RPC
- `app/sql/functions/get_or_create_dm_room.sql`: DM 방 생성 RPC
- `app/sql/views/dm_rooms_list_view.sql`: DM 목록 view
- `app/sql/views/session_rooms_list_view.sql`: 세션 목록 view

위 파일들은 wemake처럼 SQL을 보관하기 위한 위치입니다. 실제 적용은 Supabase SQL Editor에 파일 내용을 붙여넣어 실행합니다.

### `get_room` RPC

```sql
CREATE OR REPLACE FUNCTION public.get_room(from_user_id uuid, to_user_id uuid)
RETURNS TABLE(dm_room_id bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT drm.dm_room_id
  FROM public.dm_room_members drm
  WHERE drm.profile_id IN (from_user_id, to_user_id)
  GROUP BY drm.dm_room_id
  HAVING COUNT(DISTINCT drm.profile_id) = 2
     AND (
       SELECT COUNT(*)
       FROM public.dm_room_members members
       WHERE members.dm_room_id = drm.dm_room_id
     ) = 2
  LIMIT 1;
$$;
```

### `get_or_create_dm_room` RPC

```sql
CREATE OR REPLACE FUNCTION public.get_or_create_dm_room(other_user_id uuid)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  self_id uuid := auth.uid();
  existing_dm_room_id bigint;
  new_dm_room_id bigint;
BEGIN
  IF self_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF other_user_id IS NULL OR other_user_id = self_id THEN
    RAISE EXCEPTION 'Invalid DM recipient';
  END IF;

  PERFORM pg_advisory_xact_lock(
    hashtextextended(
      LEAST(self_id::text, other_user_id::text) || ':' ||
      GREATEST(self_id::text, other_user_id::text),
      0
    )
  );

  SELECT room.dm_room_id
  INTO existing_dm_room_id
  FROM public.get_room(self_id, other_user_id) AS room
  LIMIT 1;

  IF existing_dm_room_id IS NOT NULL THEN
    RETURN existing_dm_room_id;
  END IF;

  INSERT INTO public.dm_rooms DEFAULT VALUES
  RETURNING dm_room_id INTO new_dm_room_id;

  INSERT INTO public.dm_room_members (dm_room_id, profile_id)
  VALUES
    (new_dm_room_id, self_id),
    (new_dm_room_id, other_user_id);

  RETURN new_dm_room_id;
END;
$$;

REVOKE ALL ON FUNCTION public.get_or_create_dm_room(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_or_create_dm_room(uuid) TO authenticated;
```

### `dm_rooms_list_view`

```sql
CREATE OR REPLACE VIEW public.dm_rooms_list_view
WITH (security_invoker = true) AS
SELECT
  r.dm_room_id,
  me.profile_id,
  other.profile_id AS other_profile_id,
  p.name AS other_name,
  p.avatar AS other_avatar,
  (
    SELECT content
    FROM public.dm_messages
    WHERE dm_room_id = r.dm_room_id
    ORDER BY created_at DESC
    LIMIT 1
  ) AS last_message,
  (
    SELECT created_at
    FROM public.dm_messages
    WHERE dm_room_id = r.dm_room_id
    ORDER BY created_at DESC
    LIMIT 1
  ) AS last_message_at
FROM public.dm_rooms r
INNER JOIN public.dm_room_members me
  ON me.dm_room_id = r.dm_room_id AND me.profile_id = auth.uid()
INNER JOIN public.dm_room_members other
  ON other.dm_room_id = r.dm_room_id AND other.profile_id <> auth.uid()
INNER JOIN public.profiles p ON p.profile_id = other.profile_id;
```

### `session_rooms_list_view`

```sql
CREATE OR REPLACE VIEW public.session_rooms_list_view
WITH (security_invoker = true) AS
SELECT
  sr.session_room_id,
  sr.client_id,
  sr.facilitator_id,
  sr.session_number,
  sr.is_active,
  sr.started_at,
  sr.ended_at,
  sr.created_at,
  pc.name AS client_name,
  pc.avatar AS client_avatar,
  pf.name AS facilitator_name,
  pf.avatar AS facilitator_avatar,
  (
    SELECT content
    FROM public.session_messages
    WHERE session_room_id = sr.session_room_id
    ORDER BY created_at DESC
    LIMIT 1
  ) AS last_message,
  (
    SELECT created_at
    FROM public.session_messages
    WHERE session_room_id = sr.session_room_id
    ORDER BY created_at DESC
    LIMIT 1
  ) AS last_message_at
FROM public.session_rooms sr
INNER JOIN public.profiles pc ON pc.profile_id = sr.client_id
INNER JOIN public.profiles pf ON pf.profile_id = sr.facilitator_id;
```

## Step 5. 좋아요 trigger

SQL 파일 저장 위치:

- `app/sql/triggers/message_like_triggers.sql`: DM/세션 메시지 좋아요 count trigger

```sql
CREATE OR REPLACE FUNCTION public.handle_dm_message_like()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.dm_messages
  SET likes = likes + 1
  WHERE dm_message_id = NEW.dm_message_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS dm_message_like_trigger ON public.dm_message_likes;
CREATE TRIGGER dm_message_like_trigger
AFTER INSERT ON public.dm_message_likes
FOR EACH ROW EXECUTE FUNCTION public.handle_dm_message_like();

CREATE OR REPLACE FUNCTION public.handle_dm_message_unlike()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.dm_messages
  SET likes = likes - 1
  WHERE dm_message_id = OLD.dm_message_id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS dm_message_unlike_trigger ON public.dm_message_likes;
CREATE TRIGGER dm_message_unlike_trigger
AFTER DELETE ON public.dm_message_likes
FOR EACH ROW EXECUTE FUNCTION public.handle_dm_message_unlike();

CREATE OR REPLACE FUNCTION public.handle_session_message_like()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.session_messages
  SET likes = likes + 1
  WHERE session_message_id = NEW.session_message_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS session_message_like_trigger ON public.session_message_likes;
CREATE TRIGGER session_message_like_trigger
AFTER INSERT ON public.session_message_likes
FOR EACH ROW EXECUTE FUNCTION public.handle_session_message_like();

CREATE OR REPLACE FUNCTION public.handle_session_message_unlike()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.session_messages
  SET likes = likes - 1
  WHERE session_message_id = OLD.session_message_id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS session_message_unlike_trigger ON public.session_message_likes;
CREATE TRIGGER session_message_unlike_trigger
AFTER DELETE ON public.session_message_likes
FOR EACH ROW EXECUTE FUNCTION public.handle_session_message_unlike();
```

## Step 6. RLS policy

SQL 파일 저장 위치:

- `app/sql/policies/chat_rls_policies.sql`: DM/세션/좋아요/워크시트 RLS policies

WEMAKE보다 약간 더 안전한 중간안입니다. 별도 RLS helper function은 두지 않지만, 채팅 본문/세션/워크시트는 참가자만 접근할 수 있게 `EXISTS` 조건을 둡니다.

DM 방 생성은 `get_or_create_dm_room` RPC가 담당하므로 `dm_rooms`, `dm_room_members` 직접 INSERT policy는 만들지 않습니다.

RLS에서 policy가 없는 동작은 기본적으로 차단됩니다. 따라서 아래 표에 `차단`으로 적힌 동작은 별도 policy를 만들지 않습니다.
각 SQL 블록 안의 `-- SELECT policy`, `-- INSERT policy` 같은 주석은 Supabase Table Editor의 policy 동작 구분과 같은 의미입니다.

| 테이블 | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `dm_rooms` | 방 멤버만 허용 | 차단. `get_or_create_dm_room` RPC만 생성 | 차단 | 차단 |
| `dm_room_members` | 로그인 유저 허용 | 차단. `get_or_create_dm_room` RPC만 생성 | 차단 | 차단 |
| `dm_messages` | 방 멤버만 허용 | 방 멤버 + `sender_id = auth.uid()` | 차단 | 차단 |
| `session_rooms` | 세션 참가자만 허용 | facilitator 본인만 허용 | facilitator 본인만 허용 | 차단 |
| `session_messages` | 세션 참가자만 허용 | 세션 참가자 + `sender_id = auth.uid()` | 차단 | 차단 |
| `dm_message_likes` | 메시지 방 멤버만 허용 | 메시지 방 멤버 + `profile_id = auth.uid()` | 차단 | 자기 like만 삭제 |
| `session_message_likes` | 세션 참가자만 허용 | 세션 참가자 + `profile_id = auth.uid()` | 차단 | 자기 like만 삭제 |
| `worksheets` | 세션 참가자만 허용 | client 본인만 허용 | 차단 | 차단 |

이 문서의 이전 draft에 있던 broad policy를 이미 실행했다면 먼저 제거합니다.

```sql
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.dm_rooms;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.dm_rooms;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.dm_room_members;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.dm_room_members;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.dm_messages;
DROP POLICY IF EXISTS "Enable insert for users based on sender_id" ON public.dm_messages;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.session_rooms;
DROP POLICY IF EXISTS "Enable insert for users based on facilitator_id" ON public.session_rooms;
DROP POLICY IF EXISTS "Enable update for users based on facilitator_id" ON public.session_rooms;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.session_messages;
DROP POLICY IF EXISTS "Enable insert for users based on sender_id" ON public.session_messages;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.dm_message_likes;
DROP POLICY IF EXISTS "Enable insert for users based on profile_id" ON public.dm_message_likes;
DROP POLICY IF EXISTS "Enable delete for users based on profile_id" ON public.dm_message_likes;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.session_message_likes;
DROP POLICY IF EXISTS "Enable insert for users based on profile_id" ON public.session_message_likes;
DROP POLICY IF EXISTS "Enable delete for users based on profile_id" ON public.session_message_likes;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.worksheets;
DROP POLICY IF EXISTS "Enable insert for users based on client_id" ON public.worksheets;
```

### `dm_rooms`

```sql
ALTER TABLE public.dm_rooms ENABLE ROW LEVEL SECURITY;

-- SELECT policy
DROP POLICY IF EXISTS "members can view their dm rooms" ON public.dm_rooms;
CREATE POLICY "members can view their dm rooms"
  ON public.dm_rooms FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.dm_room_members drm
      WHERE drm.dm_room_id = dm_rooms.dm_room_id
        AND drm.profile_id = auth.uid()
    )
  );
```

### `dm_room_members`

```sql
ALTER TABLE public.dm_room_members ENABLE ROW LEVEL SECURITY;

-- SELECT policy
DROP POLICY IF EXISTS "authenticated users can view dm room members" ON public.dm_room_members;
CREATE POLICY "authenticated users can view dm room members"
  ON public.dm_room_members FOR SELECT
  TO authenticated
  USING (true);
```

> `dm_room_members` SELECT는 DM 목록 view가 상대 프로필을 찾을 수 있도록 넓게 둡니다. INSERT는 열지 않습니다. 새 DM 방과 멤버 2 rows 생성은 `get_or_create_dm_room` RPC에서만 처리합니다.

### `dm_messages`

```sql
ALTER TABLE public.dm_messages ENABLE ROW LEVEL SECURITY;

-- SELECT policy
DROP POLICY IF EXISTS "members can view dm messages" ON public.dm_messages;
CREATE POLICY "members can view dm messages"
  ON public.dm_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.dm_room_members drm
      WHERE drm.dm_room_id = dm_messages.dm_room_id
        AND drm.profile_id = auth.uid()
    )
  );

-- INSERT policy
DROP POLICY IF EXISTS "members can send dm messages" ON public.dm_messages;
CREATE POLICY "members can send dm messages"
  ON public.dm_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.dm_room_members drm
      WHERE drm.dm_room_id = dm_messages.dm_room_id
        AND drm.profile_id = auth.uid()
    )
  );
```

### `session_rooms`

```sql
ALTER TABLE public.session_rooms ENABLE ROW LEVEL SECURITY;

-- SELECT policy
DROP POLICY IF EXISTS "participants can view their sessions" ON public.session_rooms;
CREATE POLICY "participants can view their sessions"
  ON public.session_rooms FOR SELECT
  TO authenticated
  USING (client_id = auth.uid() OR facilitator_id = auth.uid());

-- INSERT policy
DROP POLICY IF EXISTS "facilitators can create sessions" ON public.session_rooms;
CREATE POLICY "facilitators can create sessions"
  ON public.session_rooms FOR INSERT
  TO authenticated
  WITH CHECK (facilitator_id = auth.uid());

-- UPDATE policy
DROP POLICY IF EXISTS "facilitators can update their sessions" ON public.session_rooms;
CREATE POLICY "facilitators can update their sessions"
  ON public.session_rooms FOR UPDATE
  TO authenticated
  USING (facilitator_id = auth.uid())
  WITH CHECK (facilitator_id = auth.uid());
```

### `session_messages`

```sql
ALTER TABLE public.session_messages ENABLE ROW LEVEL SECURITY;

-- SELECT policy
DROP POLICY IF EXISTS "participants can view session messages" ON public.session_messages;
CREATE POLICY "participants can view session messages"
  ON public.session_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.session_rooms sr
      WHERE sr.session_room_id = session_messages.session_room_id
        AND (sr.client_id = auth.uid() OR sr.facilitator_id = auth.uid())
    )
  );

-- INSERT policy
DROP POLICY IF EXISTS "participants can send session messages" ON public.session_messages;
CREATE POLICY "participants can send session messages"
  ON public.session_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.session_rooms sr
      WHERE sr.session_room_id = session_messages.session_room_id
        AND (
          (sr.client_id = auth.uid() AND session_messages.sender_type = 'client')
          OR (
            sr.facilitator_id = auth.uid()
            AND session_messages.sender_type IN ('facilitator', 'ai')
          )
        )
    )
  );
```

> `sender_type`은 DB policy가 아니라 `sendSessionMessage` mutation에서 `session_rooms.client_id/facilitator_id`를 조회해 서버가 결정합니다.

### `dm_message_likes` / `session_message_likes`

```sql
ALTER TABLE public.dm_message_likes ENABLE ROW LEVEL SECURITY;

-- SELECT policy
DROP POLICY IF EXISTS "members can view dm message likes" ON public.dm_message_likes;
CREATE POLICY "members can view dm message likes"
  ON public.dm_message_likes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.dm_messages dm
      INNER JOIN public.dm_room_members drm
        ON drm.dm_room_id = dm.dm_room_id
      WHERE dm.dm_message_id = dm_message_likes.dm_message_id
        AND drm.profile_id = auth.uid()
    )
  );

-- INSERT policy
DROP POLICY IF EXISTS "members can like dm messages" ON public.dm_message_likes;
CREATE POLICY "members can like dm messages"
  ON public.dm_message_likes FOR INSERT
  TO authenticated
  WITH CHECK (
    profile_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.dm_messages dm
      INNER JOIN public.dm_room_members drm
        ON drm.dm_room_id = dm.dm_room_id
      WHERE dm.dm_message_id = dm_message_likes.dm_message_id
        AND drm.profile_id = auth.uid()
    )
  );

-- DELETE policy
DROP POLICY IF EXISTS "users can delete their own dm message likes" ON public.dm_message_likes;
CREATE POLICY "users can delete their own dm message likes"
  ON public.dm_message_likes FOR DELETE
  TO authenticated
  USING (profile_id = auth.uid());

ALTER TABLE public.session_message_likes ENABLE ROW LEVEL SECURITY;

-- SELECT policy
DROP POLICY IF EXISTS "participants can view session message likes" ON public.session_message_likes;
CREATE POLICY "participants can view session message likes"
  ON public.session_message_likes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.session_messages sm
      INNER JOIN public.session_rooms sr
        ON sr.session_room_id = sm.session_room_id
      WHERE sm.session_message_id = session_message_likes.session_message_id
        AND (sr.client_id = auth.uid() OR sr.facilitator_id = auth.uid())
    )
  );

-- INSERT policy
DROP POLICY IF EXISTS "participants can like session messages" ON public.session_message_likes;
CREATE POLICY "participants can like session messages"
  ON public.session_message_likes FOR INSERT
  TO authenticated
  WITH CHECK (
    profile_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.session_messages sm
      INNER JOIN public.session_rooms sr
        ON sr.session_room_id = sm.session_room_id
      WHERE sm.session_message_id = session_message_likes.session_message_id
        AND (sr.client_id = auth.uid() OR sr.facilitator_id = auth.uid())
    )
  );

-- DELETE policy
DROP POLICY IF EXISTS "users can delete their own session message likes" ON public.session_message_likes;
CREATE POLICY "users can delete their own session message likes"
  ON public.session_message_likes FOR DELETE
  TO authenticated
  USING (profile_id = auth.uid());
```

### `worksheets`

```sql
ALTER TABLE public.worksheets ENABLE ROW LEVEL SECURITY;

-- SELECT policy
DROP POLICY IF EXISTS "session participants can view worksheets" ON public.worksheets;
CREATE POLICY "session participants can view worksheets"
  ON public.worksheets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.session_rooms sr
      WHERE sr.session_room_id = worksheets.session_room_id
        AND (sr.client_id = auth.uid() OR sr.facilitator_id = auth.uid())
    )
  );

-- INSERT policy
DROP POLICY IF EXISTS "clients can create worksheets for their sessions" ON public.worksheets;
CREATE POLICY "clients can create worksheets for their sessions"
  ON public.worksheets FOR INSERT
  TO authenticated
  WITH CHECK (
    client_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.session_rooms sr
      WHERE sr.session_room_id = worksheets.session_room_id
        AND sr.client_id = auth.uid()
    )
  );
```

> UPDATE/DELETE policy는 MVP 범위 밖입니다. facilitator는 SELECT만 가능하고 작성/수정은 하지 않습니다.

## Step 7. Storage bucket 설정

아바타 업로드는 `avatars` bucket의 public URL을 `profiles.avatar`에 저장하는 방식입니다. object path 첫 segment는 로그인 유저 id여야 합니다.

```sql
INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880,
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ]
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "public can read avatars" ON storage.objects;
CREATE POLICY "public can read avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "users can upload their own avatars" ON storage.objects;
CREATE POLICY "users can upload their own avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "users can update their own avatars" ON storage.objects;
CREATE POLICY "users can update their own avatars"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "users can delete their own avatars" ON storage.objects;
CREATE POLICY "users can delete their own avatars"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

업로드 경로 예시: `${auth.uid()}/${Date.now()}-avatar.webp`.

## Step 8. Realtime Replication 활성화

Supabase Dashboard -> Database -> Replication -> `supabase_realtime` publication에서 아래 테이블을 켭니다.

- `dm_messages`
- `session_messages`

좋아요 카운트까지 실시간 반영하려면 `dm_messages`, `session_messages`의 UPDATE 이벤트도 포함합니다.

## Step 9. 타입 재생성

스키마 변경, migration 적용, Supabase SQL Editor 작업이 끝나면 타입을 재생성합니다.

```bash
npm run db:typegen
```

또는:

```bash
npx supabase gen types typescript --project-id <PROJECT_ID> > database.types.ts
```

이후 `database.types.ts`에 새 id 컬럼명(`dm_room_id`, `session_room_id` 등), likes 테이블, views, RPC가 반영됐는지 확인합니다.

## 전체 실행 순서

```bash
npm run db:generate
# 생성된 app/sql/migrations/*.sql 검토
npm run db:migrate
# Supabase SQL Editor에서 RPC/view/trigger/RLS/Storage SQL 실행
# Supabase Dashboard에서 Realtime 설정
npm run db:typegen
```
