# AI 코파일럿 구현 계획

이 문서는 세션 채팅 위에 붙는 AI 코파일럿 기능만 다룹니다. 기본 채팅은 [`chat_app_plan.md`](./chat_app_plan.md), DB 공통 셋업은 [`chat_db_setup_plan.md`](./chat_db_setup_plan.md), 워크시트 UI는 [`chat_session_frontend_features_plan.md`](./chat_session_frontend_features_plan.md)를 따릅니다.

> **흐름/엣지 케이스/데이터 휘발 정책**: AI 초안 fine-tuning 보존 룰, 50개 soft warning, 워크시트 컨텍스트 누적 등 결정 사항은 [`chat_decisions_and_flows.md`](./chat_decisions_and_flows.md)에 정리. 본 plan은 코파일럿 인프라/SSE 계약에 집중.

> 선행 조건: Phase 1~5 완료. 특히 `session_rooms`, `session_messages`, `worksheets`, `sendSessionMessage(..., aiDraftId?)`, 세션 페이지 loader/action/Realtime이 동작해야 합니다.

## Phase 범위

| Phase | 범위 |
|---|---|
| 6 | AI 인프라: env, `ai_drafts` schema/RLS, OpenAI server helper, `/api/ai/generate` resource route |
| 7 | 세션 페이지 AI UI 통합, SSE 스트리밍, draft 사용/수정/전송 연결 |

## 확정 결정

- AI 코파일럿은 `session_rooms` 1개를 하나의 대화 단위로 본다.
- AI 호출은 facilitator만 가능하다.
- session start/end 상태와 무관하게 AI 호출은 가능하다.
- AI 초안은 client에게 노출하지 않는다. `ai_drafts`는 facilitator 본인만 조회/수정 가능해야 한다.
- "Use"는 자동 전송이 아니라 입력창 채우기다. facilitator가 검토/수정 후 직접 전송한다.
- 입력창 영역에는 "AI 초안" 버튼 하나만 둔다. 메시지마다 생성 버튼을 두지 않는다.
- 동시 AI 생성은 막는다. 생성 중 재요청 시 안내만 표시한다.
- 최근 메시지 50개 이상이면 새 세션 권장 soft warning을 표시하되 차단하지 않는다.
- 모델명은 계획서에 고정하지 않는다. 구현은 `OPENAI_MODEL` env 또는 프로젝트 설정값을 사용한다.
- OpenAI API 사용 방식은 구현 시점의 공식 문서와 설치된 SDK 버전에 맞춘다.

## 구현 원칙

- OpenAI client와 API key는 서버 전용 파일에서만 사용한다.
- route 타입, auth helper, SSR client, UI 컴포넌트는 현재 코드베이스 패턴을 따른다.
- 클라이언트가 보낸 `facilitatorId`, `senderId`, `senderType`은 신뢰하지 않는다. `auth.uid()`와 DB row로 검증한다.
- Resource route는 request-response가 아니라 `fetch` + `ReadableStream` 기반 SSE로 처리한다.
- `ai_drafts`는 fine-tuning/export를 염두에 두고 원본, refine, 최종 전송 연결을 보존한다.
- 각 Phase 완료 후 `database.types.ts`와 타입 체크 결과를 확인한다.

## Phase 6: AI 인프라

### Env

- `.env`: `OPENAI_API_KEY`, `OPENAI_MODEL` 추가.
- `.env.sample`: 같은 키를 예시값으로 추가.
- `OPENAI_MODEL` 미설정 시 fallback은 **`gpt-5.4-nano`** (CLAUDE.md OpenAI 사용 섹션 기준).
- API key가 없는 경우 resource route는 명확한 서버 에러를 반환한다.

### Schema: `ai_drafts`

위치 힌트: `app/features/facilitators/ai/schema.ts`

필수 컬럼:

- `draft_id`: uuid PK.
- `session_room_id`: `session_rooms.session_room_id` FK.
- `facilitator_id`: `profiles.profile_id` FK.
- `parent_draft_id`: nullable self FK. refine chain 표현.
- `refine_instruction`: nullable text.
- `content`: text, AI가 생성한 초안.
- `used`: boolean default false.
- `sent_session_message_id`: nullable `session_messages.session_message_id` FK. 실제 전송된 메시지와 연결.
- `created_at`: timestamp.

### RLS

- facilitator는 자기 `ai_drafts`만 SELECT 가능.
- facilitator는 본인이 담당하는 `session_rooms`에 대해서만 INSERT 가능.
- facilitator는 자기 `ai_drafts`만 UPDATE 가능.
- client에게는 `ai_drafts` SELECT 정책을 주지 않는다.

### Server Helper

위치 힌트: `app/lib/openai.server.ts`

- OpenAI client를 서버 전용으로 생성한다.
- The Work facilitator용 system/developer instructions를 한 곳에 둔다.
- 모델명은 `process.env.OPENAI_MODEL` 또는 프로젝트 설정값에서 읽는다.
- `.server.ts` 또는 기존 서버 전용 패턴을 따라 클라이언트 번들에 포함되지 않게 한다.

### Resource Route: `/api/ai/generate`

입력:

- `sessionId`: 필수.
- `refineInstruction`: 선택.
- `parentDraftId`: 선택.
- `worksheetId`: 선택.

권한:

- `auth.uid()`가 `session_rooms.facilitator_id`와 일치해야 한다.
- `parentDraftId`가 있으면 같은 facilitator의 draft여야 한다.
- `worksheetId`가 있으면 해당 session의 worksheet이고 facilitator가 세션 참가자여야 한다.

컨텍스트:

- 기존 conversation id가 있으면 재사용한다.
- 없으면 최근 `session_messages`를 시간순으로 넣어 새 conversation을 만들고 `session_rooms.openai_conversation_id`에 저장한다.
- 일반 생성은 최신 client 메시지 중심으로 요청한다.
- refine은 `refineInstruction`과 `parentDraftId`를 포함한다.
- worksheet 생성은 worksheet `data`를 context에 포함한다.

SSE 이벤트 계약:

- 응답 헤더: `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`
- 이벤트 와이어 포맷 (각 이벤트는 `\n\n` 으로 종료):

```
event: delta
data: {"token":"안"}

event: delta
data: {"token":"녕"}

event: done
data: {"draftId":"01234567-...","content":"안녕하세요."}

```

- 에러 발생 시:

```
event: error
data: {"message":"..."}

```

- 클라이언트 측 파싱은 `ReadableStream` reader + 줄 단위 버퍼링으로 처리. `data:` prefix를 떼고 JSON.parse.

완료 시:

- 전체 응답 text를 `ai_drafts`에 INSERT한다.
- `parent_draft_id`, `refine_instruction`을 요청에 맞게 저장한다.
- `done` 이벤트로 `draftId`와 `content`를 보낸다.

## Phase 7: 세션 페이지 통합

### UI 상태

- AI 생성 중 여부.
- 현재 초안 content.
- 현재 `draftId`.
- 에러 메시지.
- abort controller.
- controlled message input.

> **이미 구현된 UI 컴포넌트**: `AiSuggestionCard` (포함: 헤더의 접기/펴기 토글, Edit/Use/Cancel/Save/Regenerate/Stop 버튼, refine 입력창). Phase 7은 이 컴포넌트를 그대로 사용하면서 mock data를 실제 SSE 스트리밍과 연결한다. 컴포넌트 구조 변경 X. 자세한 UI 결정은 [`chat_session_frontend_features_plan.md`](./chat_session_frontend_features_plan.md) Part 1 참조.

### Generate / Refine / Stop

- "AI 초안" 버튼은 `/api/ai/generate`를 `fetch`로 호출한다.
- stream `delta`를 받을 때마다 초안 카드에 이어 붙인다.
- `done`을 받으면 `draftId`를 저장한다.
- refine은 `refineInstruction`과 현재 `draftId`를 함께 보낸다.
- regenerate는 새 root draft로 본다.
- stop은 abort controller로 현재 요청을 중단한다.
- 생성 중 중복 요청은 차단하고 안내한다.

### Use / Send

- "Use"는 AI 초안을 메시지 입력창에 채운다.
- 메시지 전송 시 현재 입력값이 AI 초안을 기반으로 한 경우 `aiDraftId`를 함께 보낸다.
- `sendSessionMessage`는 메시지 insert 후 해당 `ai_drafts.used=true`, `sent_session_message_id=newMessageId`로 갱신한다.
- draft 갱신은 `facilitator_id = auth.uid()` 조건을 만족해야 한다.

### Worksheet -> Copilot

- facilitator가 worksheet overlay에서 "코파일럿 전송"을 누르면 `/api/ai/generate`에 `sessionId`, `worksheetId`를 보낸다.
- resource route는 worksheet `data`를 읽어 AI 입력 context에 포함한다.
- 결과는 일반 AI 초안과 같은 카드/Use/refine 흐름을 탄다.

### 50개 Soft Warning

- `session_messages.length >= 50`이면 shadcn Alert로 새 세션 시작 권장을 표시한다.
- AI 생성 자체는 차단하지 않는다.

## Fine-tuning 데이터 계약

- 채택된 draft: `ai_drafts.used=true`이고 `sent_session_message_id`가 존재한다.
- reject된 draft: `used=false`.
- refine chain은 `parent_draft_id`로 복원한다.
- facilitator가 수정해 전송한 최종 문장은 `session_messages.content`와 `ai_drafts.content` diff로 분석한다.

## 완료 기준

- `ai_drafts` schema, migration, RLS, `database.types.ts`가 반영됐다.
- client 계정으로 `ai_drafts`를 조회할 수 없다.
- facilitator만 `/api/ai/generate`를 호출할 수 있다.
- SSE `delta`, `done`, `error`가 UI에서 처리된다.
- 생성 중 중복 요청과 stop 동작이 처리된다.
- "Use"는 입력창만 채우고 자동 전송하지 않는다.
- `aiDraftId`가 포함된 세션 메시지 전송 후 `ai_drafts.used`와 `sent_session_message_id`가 갱신된다.
- worksheet에서 보낸 context로 AI 초안을 생성할 수 있다.
- 타입 체크 또는 현재 프로젝트에서 통과 가능한 범위의 검증 결과를 확인한다.

## 작업 순서

1. Phase 6: `.env`, `.env.sample`에 OpenAI 설정 추가.
2. Phase 6: `ai_drafts` schema 작성.
3. Phase 6: migration, RLS, typegen 적용.
4. Phase 6: OpenAI server helper 작성.
5. Phase 6: `/api/ai/generate` resource route 작성.
6. Phase 7: 세션 페이지에 AI 초안 카드와 SSE stream 연결.
7. Phase 7: Use/refine/regenerate/stop 처리.
8. Phase 7: `sendSessionMessage(..., aiDraftId?)` draft 갱신 연결 확인.
9. Phase 7: worksheet -> copilot 전송 흐름 연결.
