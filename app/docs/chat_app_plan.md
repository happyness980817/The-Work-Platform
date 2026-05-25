# 채팅 앱 코드 구현 계획

이 문서는 채팅(DM/세션) **앱 코드**만 다룹니다. DB 작업은 [`chat_db_setup_plan.md`](./chat_db_setup_plan.md) 참조.

> **선행 조건**: `chat_db_setup_plan.md`의 Step 1~7이 모두 완료되어 있어야 합니다 (스키마/뷰/트리거/RLS/Realtime/타입 재생성).

## 확정된 결정 사항

| 항목                  | 결정                                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| 세션 "시작" vs "생성" | DM/예약 페이지 = **새 session_room 생성**. 세션 페이지 = **기존 세션 활성화** (is_active 토글, 시간 기록) |
| 세션 start/end의 의미 | **기능상 변화 없음** — 단순 시간 측정 (요금 책정용 인프라). 메시지 전송과 AI 호출은 언제든 가능          |
| room_code             | UUID (`crypto.randomUUID()`)                                                                             |
| session_number        | `(facilitator_id, client_id)` 페어 기준 `MAX + 1`                                                       |
| DM ↔ 세션 관계        | **무관계** (독립 entity. DM에서 세션 만들어도 추적 FK 없음)                                              |
| 좋아요 정책           | 누구든 누구 메시지에든 가능. 자기 메시지도 OK. 카운트만 표시 (누가 눌렀는지는 안 보임)                   |
| 메시지 페이지네이션   | MVP에서는 **전체 로드** (무한 스크롤 없음)                                                              |

---

## Part A. 백엔드 — `chats/queries.ts` + `chats/mutations.ts`

위치: `app/features/all-users/chats/queries.ts`, `app/features/all-users/chats/mutations.ts`

모든 함수의 첫 번째 파라미터는 `client: SupabaseClient<Database>`.

### queries.ts

- `getDmRooms(client, userId)` — `dm_rooms_list_view`에서 본인이 속한 row
- `getSessionRooms(client, userId)` — `session_rooms_list_view`에서 client_id 또는 facilitator_id가 본인
- `getDmMessages(client, roomId, userId)` — 권한 확인 후 메시지 + 본인의 like 여부
- `getDmRecipient(client, roomId, userId)` — DM 상대 프로필
- `getSessionMessages(client, sessionId, userId)` — 메시지 + 본인의 like 여부
- `getSessionById(client, sessionId)` — 단건 조회
- `getSessionParticipant(client, sessionId, userId)` — 본인이 client인지 facilitator인지

### mutations.ts

- `getOrCreateDmRoom(client, { selfId, otherId })` — 양방향 unique. 이미 있으면 그 room_id 반환
- `sendDmMessage(client, { roomId, senderId, content })`
- `sendSessionMessage(client, { sessionId, senderId, senderType, content, aiDraftId? })`
  - **`aiDraftId` 선택 파라미터**: 값 있으면 메시지 insert 후 `ai_drafts.sent_message_id`/`used` 업데이트 (copilot plan에서 사용)
- `getLatestSessionRoom(client, { clientId, facilitatorId })` *(query)* — 이 페어의 가장 최근 `session_rooms` (`created_at DESC LIMIT 1`), 없으면 `null`
- `createSession(client, { clientId, facilitatorId })`
  - `room_code = crypto.randomUUID()`
  - `session_number = (이 페어의 max session_number) + 1`
- `startSession(client, sessionId, userId)` — facilitator 권한 확인 → `is_active=true, started_at=now()`
- `endSession(client, sessionId, userId)` — facilitator 권한 확인 → `is_active=false, ended_at=now()`
- `toggleDmMessageLike(client, { messageId, userId, liked })` — true=INSERT, false=DELETE
- `toggleSessionMessageLike(client, { messageId, userId, liked })` — true=INSERT, false=DELETE

---

## Part B. 프론트엔드

### B1. `chat-layout.tsx`

**loader**:
```
makeSSRClient → getLoggedInUserId → getDmRooms + getSessionRooms
```

**UI**:
- 사이드바 날짜: `luxon` → 오늘/어제/M월 d일
- mock 데이터 전부 제거
- 세션 그룹핑: facilitator 화면은 `client_id`로 묶어서 표시, client 화면은 flat list

---

### B2. `chat-dm-page.tsx`

**loader**: `getDmMessages(dmId, userId)` + `getDmRecipient(dmId, userId)`

**action** (intent 분기):
- `intent='message'` → `sendDmMessage`
- `intent='create-session'` (facilitator만) → 이 페어의 기존 세션룸 조회:
  - **없으면** `createSession` → `redirect(/chats/sessions/${newSessionId})`
  - **있으면** `created_at DESC LIMIT 1`로 **가장 최근 세션룸**을 골라 `redirect`
- `intent='toggle-like'` → `toggleDmMessageLike` (**useFetcher.submit** 사용 — 페이지 전환 없이)

**Realtime**:
```
postgres_changes INSERT on dm_messages WHERE room_id=eq.${dmId}
```

**shouldRevalidate**: `currentParams.dmId !== nextParams.dmId`일 때만 (다른 DM으로 전환 시에만 reload, 같은 방 내 메시지는 Realtime이 처리)

---

### B3. `chat-session-page.tsx`

**loader**: `getSessionById` + `getSessionMessages` + `getSessionParticipant`

**action** (intent 분기):
- `intent='message'` → `sendSessionMessage`
- `intent='start-session'` (facilitator만) → `startSession`
- `intent='end-session'` (facilitator만) → `endSession`
- `intent='toggle-like'` → `toggleSessionMessageLike` (**useFetcher.submit**)

**Realtime**:
```
postgres_changes INSERT on session_messages WHERE session_id=eq.${sessionId}
```

**shouldRevalidate**: `currentParams.sessionId !== nextParams.sessionId`

> AI 코파일럿 통합 (AI 초안 버튼, 스트리밍, 50개 soft warning 등)은 [`copilot_implementation_plan.md`](./copilot_implementation_plan.md) 참조

---

### B4. 퍼실리테이터 프로필 페이지 — DM 진입점

위치: `app/features/all-users/platform/pages/public-facilitator-profile-page.tsx`

**action** 추가:
```
intent='send-dm' → getOrCreateDmRoom({ selfId: userId, otherId: facilitatorId })
                 → redirect(/chats/dms/${roomId})
```

기존 "DM" 버튼이 이 action을 트리거하도록 연결.

---

## Part C. 좋아요 (useFetcher.submit 패턴)

DB 셋업(스키마, 트리거, RLS)은 `chat_db_setup_plan.md`에서 이미 완료된 상태입니다. 여기선 프론트엔드 동작만 정의합니다.

```tsx
// MessageBubble 내부
const fetcher = useFetcher();
const isLiked = fetcher.formData
  ? fetcher.formData.get('liked') === 'true' // optimistic UI
  : initialIsLiked;

const handleToggleLike = () => {
  fetcher.submit(
    { intent: 'toggle-like', messageId, liked: String(!isLiked) },
    { method: 'post' }
  );
};

<Button
  variant="ghost"
  size="icon"
  onClick={handleToggleLike}
  disabled={fetcher.state !== 'idle'}
>
  <ThumbsUpIcon className={cn('size-4', isLiked && 'fill-current')} />
</Button>;
```

- `fetcher.submit(data, options)` 프로그래매틱 호출 — `<input type="hidden">` 불필요
- shadcn `<Button>` 단독 사용. `<fetcher.Form>` 래퍼 불필요
- `toggleDmMessageLike` / `toggleSessionMessageLike`: liked=true → INSERT, liked=false → DELETE
- 트리거가 자동으로 `dm_messages.likes` / `session_messages.likes` 증감
- composite PK `(message_id, profile_id)` → DB 레벨 중복 방지
- 메시지 조회 시 본인 like 여부를 함께 select (loader에서)

---

## 작업 순서

`chat_db_setup_plan.md`의 모든 단계 완료 후:

1. `chats/queries.ts` + `chats/mutations.ts` 작성 (likes 포함)
2. `chat-layout.tsx` loader + mock 제거
3. `chat-dm-page.tsx` loader + action + Realtime + likes (useFetcher.submit)
4. `chat-session-page.tsx` loader + action + Realtime + likes (useFetcher.submit) — **AI 통합 제외**
5. 퍼실리테이터 프로필 페이지에 `intent='send-dm'` action 추가
6. luxon 날짜 유틸 사이드바 전체 적용

이후 [`copilot_implementation_plan.md`](./copilot_implementation_plan.md)로 진행.
