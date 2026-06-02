# 채팅 앱 코드 구현 계획

이 문서는 채팅(DM/세션) 앱 코드 구현만 다룹니다. DB 작업은 [`chat_db_setup_plan.md`](./chat_db_setup_plan.md), 워크시트 UI는 [`chat_session_frontend_features_plan.md`](./chat_session_frontend_features_plan.md), AI 코파일럿은 [`copilot_implementation_plan.md`](./copilot_implementation_plan.md)를 따릅니다.

> 선행 조건: `chat_db_setup_plan.md` Step 1~8 완료. 스키마, 뷰, RPC, 트리거, RLS, Storage, Realtime, `database.types.ts`가 현재 DB와 맞아야 합니다.

## Phase 범위

| Phase | 범위 |
|---|---|
| 2 | `chats/queries.ts`, `chats/mutations.ts` 백엔드 함수 |
| 3 | 채팅 레이아웃, 사이드바, DM 페이지, luxon 날짜 표시 |
| 4 | 세션 채팅 페이지, 워크시트 저장/조회 연결. AI 제외 |
| 5 | 퍼실리테이터 프로필 페이지의 DM 진입점 |

## 확정 결정

- DM은 wemake 방식: `dm_rooms` + `dm_room_members` + `dm_messages`, 기존 1:1 방 조회는 `get_room` RPC.
- DM room id와 session room id는 wemake처럼 DB가 만드는 `bigint identity`를 사용한다.
- 컬럼 이름은 충돌을 줄이기 위해 `dm_room_id`, `dm_message_id`, `session_room_id`, `session_message_id`로 분리한다.
- `room_code`와 앱 코드의 `crypto.randomUUID()`는 사용하지 않는다.
- DM과 세션은 독립 entity다. DM에서 세션을 만들어도 추적 FK는 두지 않는다.
- 새 `session_rooms` 생성은 DM 페이지에서 facilitator만 가능하다.
- 세션 페이지의 start/end는 기존 세션의 `is_active`, `started_at`, `ended_at`만 갱신한다.
- `session_number`는 `(facilitator_id, client_id)` 페어 기준 `MAX + 1`.
- 메시지 좋아요는 자기 메시지를 포함해 누구 메시지에도 가능하다. UI에는 카운트와 내 like 여부만 표시한다.
- MVP에서는 메시지를 전체 로드한다. 페이지네이션/무한 스크롤은 제외한다.

## 구현 원칙

- 파일명, route 타입, loader/action 시그니처, SSR client/auth helper는 현재 코드베이스 패턴을 따른다.
- 이 문서는 기능 계약만 고정한다. 실제 구현 위치와 컴포넌트 구조는 기존 코드를 읽고 맞춘다.
- 클라이언트가 넘긴 권한성 값은 신뢰하지 않는다. `senderId`, `clientId`, `senderType` 등은 `auth.uid()`와 DB row 대조로 서버에서 결정한다.
- 각 Phase 완료 전 `database.types.ts`와 실제 DB 계약이 맞는지 확인한다.
- loader/action 타입 에러를 남기지 않는다.

## Phase 2: 백엔드 함수

위치: `app/features/all-users/chats/queries.ts`, `app/features/all-users/chats/mutations.ts`

모든 함수의 첫 번째 파라미터는 `client: SupabaseClient<Database>`.

### Queries

- `getDmRooms(client, { userId })`: `dm_rooms_list_view`에서 본인이 속한 DM 목록 조회.
- `getSessionRooms(client, { userId })`: `session_rooms_list_view`에서 본인이 client 또는 facilitator인 세션 조회.
- `getDmMessages(client, { dmRoomId, userId })`: 방 멤버 권한 확인 후 메시지와 내 like 여부 조회.
- `getDmRecipient(client, { dmRoomId, userId })`: DM 상대 프로필 조회.
- `getSessionMessages(client, { sessionRoomId, userId })`: 세션 참가 권한 확인 후 메시지와 내 like 여부 조회.
- `getSessionById(client, { sessionRoomId })`: 세션 단건 조회.
- `getSessionParticipant(client, { sessionRoomId, userId })`: 본인이 `client`, `facilitator`, 또는 비참가자인지 판별.
- `getLatestSessionRoom(client, { clientId, facilitatorId })`: 해당 페어의 최신 세션 조회. 없으면 `null`.
- `getLatestWorksheet(client, { sessionRoomId, type })`: 해당 세션/type의 최신 worksheet 조회. 없으면 `null`.

### Mutations

- `getOrCreateDmRoom(client, { otherId })`
  - `auth.uid()`로 self id 결정.
  - `get_room(from_user_id: selfId, to_user_id: otherId)` RPC 조회.
  - 기존 방이 있으면 `dm_room_id` 반환.
  - 없으면 `dm_rooms` 생성 후 `dm_room_members`에 self/other 2 rows 추가.
  - 생성된 `dm_room_id` 반환.
- `sendDmMessage(client, { dmRoomId, content })`
  - sender는 `auth.uid()`로 결정.
  - `dm_room_members` 기준으로 sender가 방 멤버인지 확인 후 insert.
- `sendSessionMessage(client, { sessionRoomId, content, aiDraftId? })`
  - sender는 `auth.uid()`로 결정.
  - `session_rooms.client_id/facilitator_id` 대조로 `sender_type` 결정.
  - `aiDraftId`가 있으면 메시지 insert 후 `ai_drafts.sent_session_message_id`, `used` 갱신.
- `createSession(client, { clientId, facilitatorId })`
  - facilitator는 `auth.uid()`와 일치해야 한다.
  - `session_room_id`는 DB identity가 생성한다.
  - `session_number = pair max + 1`.
- `startSession(client, { sessionRoomId })`: facilitator 권한 확인 후 `is_active=true`, `started_at=now()`.
- `endSession(client, { sessionRoomId })`: facilitator 권한 확인 후 `is_active=false`, `ended_at=now()`.
- `toggleDmMessageLike(client, { dmMessageId, liked })`: `auth.uid()` 기준 insert/delete.
- `toggleSessionMessageLike(client, { sessionMessageId, liked })`: `auth.uid()` 기준 insert/delete.
- `createWorksheet(client, { sessionRoomId, type, data })`: client 권한 확인 후 `client_id=auth.uid()`로 insert.

## Phase 3: 레이아웃과 DM

### Chat Layout

- loader: SSR client 생성 -> 로그인 유저 확인 -> DM 목록과 세션 목록 조회.
- mock 데이터 제거.
- 사이드바 날짜는 `luxon`으로 오늘/어제/M월 d일 형태 표시.
- facilitator 화면의 세션 목록은 `client_id` 기준 그룹핑.
- client 화면의 세션 목록은 flat list.

### DM Page

- route: `/chats/dms/:dmRoomId`
- loader: DM 메시지와 상대 프로필 조회.
- `intent='message'`: DM 메시지 전송.
- `intent='create-session'`: facilitator만 실행.
  - 같은 client/facilitator 페어의 최신 세션이 있으면 그 세션으로 redirect.
  - 없으면 세션 생성 후 새 세션으로 redirect.
- `intent='toggle-like'`: `useFetcher.submit`로 좋아요 토글.
- Realtime: `dm_messages` INSERT 구독, 현재 `dm_room_id`만 반영.
- `shouldRevalidate`: 다른 DM으로 이동할 때만 true.

## Phase 4: 세션 채팅과 워크시트

### Session Page

- route: `/chats/sessions/:sessionRoomId`
- loader: 세션 단건, 세션 메시지, 참가자 역할 조회.
- `intent='message'`: 세션 메시지 전송.
- `intent='start-session'`: facilitator만 세션 시작.
- `intent='end-session'`: facilitator만 세션 종료.
- `intent='toggle-like'`: `useFetcher.submit`로 좋아요 토글.
- `intent='save-worksheet'`: client만 worksheet 저장.
- Realtime: `session_messages` INSERT 구독, 현재 `session_room_id`만 반영.
- `shouldRevalidate`: 다른 세션으로 이동할 때만 true.

### Worksheet 연결

- client의 `WorksheetOverlay.handleSaveOrComplete`는 `intent='save-worksheet'` action으로 연결.
- form data는 `{ type, data }`; `data`는 JSON string.
- facilitator의 "조회" 흐름은 `getLatestWorksheet` 결과를 받아 plain text로 렌더링.
- worksheet UI 자체의 상세 구조는 `chat_session_frontend_features_plan.md`를 따른다.

## Phase 5: 퍼실리테이터 프로필 DM 진입점

위치 힌트: `app/features/all-users/platform/pages/public-facilitator-profile-page.tsx`

- 기존 DM 버튼을 action으로 연결.
- `intent='send-dm'`: `getOrCreateDmRoom({ otherId: facilitatorId })`.
- 성공 시 `/chats/dms/${dmRoomId}`로 redirect.

## 좋아요 UI 계약

- 좋아요 토글은 `useFetcher.submit`을 사용한다.
- `<fetcher.Form>` 래퍼와 hidden input은 필수 아님.
- optimistic UI는 `fetcher.formData`를 기준으로 처리한다.
- DB composite PK `(dm_message_id, profile_id)`, `(session_message_id, profile_id)`가 중복 like를 막는다.
- 카운트 증감은 DB trigger가 처리한다.

## 완료 기준

- Phase별 loader/action이 현재 route 타입과 맞는다.
- mock 데이터가 실제 query 결과로 대체됐다.
- DM/세션 메시지 전송 후 현재 방에서는 Realtime으로 반영된다.
- 다른 방/세션으로 이동할 때만 revalidation이 발생한다.
- 모든 mutation은 `auth.uid()` 기반 권한 확인을 거친다.
- `npm run typecheck` 또는 현재 프로젝트에서 통과 가능한 범위의 타입 체크 결과를 확인한다.

## 작업 순서

1. Phase 2: `queries.ts`, `mutations.ts` 작성.
2. Phase 3: chat layout loader, sidebar 데이터, DM page loader/action/Realtime 연결.
3. Phase 3: luxon 날짜 표시 적용.
4. Phase 4: session page loader/action/Realtime 연결.
5. Phase 4: worksheet 저장/조회 연결.
6. Phase 5: 퍼실리테이터 프로필의 DM 진입 action 연결.
7. 이후 Phase 6~7은 `copilot_implementation_plan.md`로 진행.
