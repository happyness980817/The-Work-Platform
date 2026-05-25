# 채팅 DB 셋업 계획

이 문서는 채팅(DM/세션) 기능에 필요한 **DB 관련 작업만** 다룹니다. 앱 코드 구현은 [`chat_app_plan.md`](./chat_app_plan.md) 참조.

## 작업 순서 요약

| Step | 담당  | 작업                            |
| ---- | ----- | ------------------------------- |
| 1    | 에이전트 | `schema.ts` 수정 (likes 추가)  |
| 2    | 유저    | `npm run db:generate` → `npm run db:migrate` |
| 3    | 유저    | Supabase 대시보드에서 **뷰 2개** SQL 실행 |
| 4    | 유저    | Supabase 대시보드에서 **트리거** SQL 실행 |
| 5    | 유저    | Supabase 대시보드에서 **RLS 정책** SQL 실행 |
| 6    | 유저    | Supabase 대시보드에서 **Realtime Replication** 활성화 |
| 7    | 유저    | `npx supabase gen types typescript --project-id <ID> > database.types.ts` |

---

## Step 1. `chats/schema.ts` 변경 (에이전트)

기존 `dm_messages`, `session_messages` 테이블에 `likes` 컬럼을 추가하고, likes 테이블 2개를 새로 만듭니다.

```ts
// dm_messages 테이블에 likes 컬럼 추가
export const dmMessages = pgTable('dm_messages', {
  // ... 기존 컬럼들
  likes: integer().notNull().default(0), // ← 추가
});

// session_messages 테이블에 likes 컬럼 추가
export const sessionMessages = pgTable('session_messages', {
  // ... 기존 컬럼들
  likes: integer().notNull().default(0), // ← 추가
});

// DM 메시지 좋아요
export const dmMessageLikes = pgTable(
  'dm_message_likes',
  {
    message_id: uuid()
      .notNull()
      .references(() => dmMessages.message_id, { onDelete: 'cascade' }),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.profile_id, { onDelete: 'cascade' }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.message_id, table.profile_id] })]
);

// 세션 메시지 좋아요
export const sessionMessageLikes = pgTable(
  'session_message_likes',
  {
    message_id: uuid()
      .notNull()
      .references(() => sessionMessages.message_id, { onDelete: 'cascade' }),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.profile_id, { onDelete: 'cascade' }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.message_id, table.profile_id] })]
);
```

> `timestamp()`는 timezone 없이 wemake와 동일하게 유지합니다 (MVP).

---

## Step 2. 마이그레이션 (유저 수동)

스키마 변경 직후 터미널에서:

```bash
npm run db:generate    # drizzle-kit이 마이그레이션 SQL 생성
npm run db:migrate     # 생성된 SQL을 DB에 적용
```

> CLAUDE.md 규칙에 따라 에이전트는 직접 실행하지 않습니다.

---

## Step 3. DB 뷰 2개 (유저가 Supabase 대시보드 SQL 에디터에서 실행)

### `dm_rooms_list_view`

```sql
CREATE OR REPLACE VIEW dm_rooms_list_view AS
SELECT
  m1.room_id, m1.profile_id,
  m2.profile_id AS other_profile_id,
  p.name AS other_name, p.avatar AS other_avatar,
  (SELECT content FROM dm_messages WHERE room_id = m1.room_id ORDER BY created_at DESC LIMIT 1) AS last_message,
  (SELECT created_at FROM dm_messages WHERE room_id = m1.room_id ORDER BY created_at DESC LIMIT 1) AS last_message_at
FROM dm_room_members m1
INNER JOIN dm_room_members m2 ON m1.room_id = m2.room_id AND m1.profile_id != m2.profile_id
INNER JOIN profiles p ON p.profile_id = m2.profile_id;
```

### `session_rooms_list_view`

```sql
CREATE OR REPLACE VIEW session_rooms_list_view AS
SELECT
  sr.session_id, sr.room_code, sr.client_id, sr.facilitator_id,
  sr.session_number, sr.is_active, sr.started_at, sr.ended_at, sr.created_at,
  pc.name AS client_name, pc.avatar AS client_avatar,
  pf.name AS facilitator_name, pf.avatar AS facilitator_avatar,
  (SELECT content FROM session_messages WHERE session_id = sr.session_id ORDER BY created_at DESC LIMIT 1) AS last_message,
  (SELECT created_at FROM session_messages WHERE session_id = sr.session_id ORDER BY created_at DESC LIMIT 1) AS last_message_at
FROM session_rooms sr
INNER JOIN profiles pc ON pc.profile_id = sr.client_id
INNER JOIN profiles pf ON pf.profile_id = sr.facilitator_id;
```

---

## Step 4. 좋아요 트리거 (유저가 SQL 에디터에서 실행)

파일로도 보관: `app/sql/triggers/message_like_triggers.sql`

wemake의 `post_upvote_trigger` 패턴 — INSERT → +1, DELETE → -1

```sql
-- ── DM 메시지 좋아요 ──

CREATE FUNCTION public.handle_dm_message_like()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY definer SET search_path = '' AS $$
BEGIN
  UPDATE public.dm_messages SET likes = likes + 1 WHERE message_id = NEW.message_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER dm_message_like_trigger
AFTER INSERT ON public.dm_message_likes
FOR EACH ROW EXECUTE FUNCTION public.handle_dm_message_like();

CREATE FUNCTION public.handle_dm_message_unlike()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY definer SET search_path = '' AS $$
BEGIN
  UPDATE public.dm_messages SET likes = likes - 1 WHERE message_id = OLD.message_id;
  RETURN OLD;
END;
$$;

CREATE TRIGGER dm_message_unlike_trigger
AFTER DELETE ON public.dm_message_likes
FOR EACH ROW EXECUTE FUNCTION public.handle_dm_message_unlike();

-- ── 세션 메시지 좋아요 ──

CREATE FUNCTION public.handle_session_message_like()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY definer SET search_path = '' AS $$
BEGIN
  UPDATE public.session_messages SET likes = likes + 1 WHERE message_id = NEW.message_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER session_message_like_trigger
AFTER INSERT ON public.session_message_likes
FOR EACH ROW EXECUTE FUNCTION public.handle_session_message_like();

CREATE FUNCTION public.handle_session_message_unlike()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY definer SET search_path = '' AS $$
BEGIN
  UPDATE public.session_messages SET likes = likes - 1 WHERE message_id = OLD.message_id;
  RETURN OLD;
END;
$$;

CREATE TRIGGER session_message_unlike_trigger
AFTER DELETE ON public.session_message_likes
FOR EACH ROW EXECUTE FUNCTION public.handle_session_message_unlike();
```

---

## Step 5. RLS 정책 (유저가 SQL 에디터에서 실행)

> **중요**: Supabase Realtime은 RLS를 따릅니다. RLS를 안 깔면 다른 유저 메시지도 구독되는 보안 사고가 발생합니다.

파일로도 보관 권장: `app/sql/policies/chat_rls.sql`

### dm_rooms

```sql
ALTER TABLE public.dm_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members can view their dm rooms"
  ON public.dm_rooms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.dm_room_members
      WHERE room_id = dm_rooms.room_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "authenticated users can create dm rooms"
  ON public.dm_rooms FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
```

### dm_room_members

```sql
ALTER TABLE public.dm_room_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can view members of rooms they belong to"
  ON public.dm_room_members FOR SELECT
  USING (
    profile_id = auth.uid()
    OR room_id IN (
      SELECT room_id FROM public.dm_room_members WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "users can insert their own membership"
  ON public.dm_room_members FOR INSERT
  WITH CHECK (profile_id = auth.uid());
```

### dm_messages

```sql
ALTER TABLE public.dm_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members can view dm messages in their rooms"
  ON public.dm_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.dm_room_members
      WHERE room_id = dm_messages.room_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "members can send dm messages in their rooms"
  ON public.dm_messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.dm_room_members
      WHERE room_id = dm_messages.room_id AND profile_id = auth.uid()
    )
  );
```

### session_rooms

```sql
ALTER TABLE public.session_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "participants can view their sessions"
  ON public.session_rooms FOR SELECT
  USING (client_id = auth.uid() OR facilitator_id = auth.uid());

CREATE POLICY "facilitators can create sessions"
  ON public.session_rooms FOR INSERT
  WITH CHECK (facilitator_id = auth.uid());

CREATE POLICY "facilitators can update their sessions"
  ON public.session_rooms FOR UPDATE
  USING (facilitator_id = auth.uid());
```

### session_messages

```sql
ALTER TABLE public.session_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "participants can view session messages"
  ON public.session_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.session_rooms
      WHERE session_id = session_messages.session_id
      AND (client_id = auth.uid() OR facilitator_id = auth.uid())
    )
  );

CREATE POLICY "participants can send session messages"
  ON public.session_messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.session_rooms
      WHERE session_id = session_messages.session_id
      AND (client_id = auth.uid() OR facilitator_id = auth.uid())
    )
  );
```

### dm_message_likes / session_message_likes

```sql
ALTER TABLE public.dm_message_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members can view dm message likes"
  ON public.dm_message_likes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.dm_messages dm
      INNER JOIN public.dm_room_members m ON m.room_id = dm.room_id
      WHERE dm.message_id = dm_message_likes.message_id AND m.profile_id = auth.uid()
    )
  );

CREATE POLICY "users can toggle their own dm message likes (insert)"
  ON public.dm_message_likes FOR INSERT
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "users can toggle their own dm message likes (delete)"
  ON public.dm_message_likes FOR DELETE
  USING (profile_id = auth.uid());


ALTER TABLE public.session_message_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "participants can view session message likes"
  ON public.session_message_likes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.session_messages sm
      INNER JOIN public.session_rooms sr ON sr.session_id = sm.session_id
      WHERE sm.message_id = session_message_likes.message_id
      AND (sr.client_id = auth.uid() OR sr.facilitator_id = auth.uid())
    )
  );

CREATE POLICY "users can toggle their own session message likes (insert)"
  ON public.session_message_likes FOR INSERT
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "users can toggle their own session message likes (delete)"
  ON public.session_message_likes FOR DELETE
  USING (profile_id = auth.uid());
```

> `ai_drafts` 테이블 및 그 RLS는 `copilot_implementation_plan.md`에서 정의됩니다.

---

## Step 6. Realtime Replication 활성화 (유저가 Supabase 대시보드에서)

Supabase Dashboard → **Database → Replication** → `supabase_realtime` publication →

- ✅ `dm_messages`
- ✅ `session_messages`

체크박스로 활성화하시면 됩니다. (좋아요 카운트도 실시간 반영하고 싶다면 `dm_messages`, `session_messages`의 UPDATE도 자동 포함됨)

---

## Step 7. 타입 재생성 (유저 수동)

```bash
npx supabase gen types typescript --project-id <PROJECT_ID> > database.types.ts
```

이후 `app/supa-client.ts`의 `Database` 타입이 새 컬럼(`likes`)과 새 테이블(`dm_message_likes`, `session_message_likes`), 그리고 두 뷰를 알아챕니다.

> 이 단계가 끝나면 [`chat_app_plan.md`](./chat_app_plan.md)로 넘어가서 앱 코드 작성을 시작합니다.
