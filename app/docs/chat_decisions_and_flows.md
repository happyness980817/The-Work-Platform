# 채팅 & 코파일럿 결정 사항 / 사용자 흐름

본 문서는 [`chat_db_setup_plan.md`](./chat_db_setup_plan.md), [`chat_app_plan.md`](./chat_app_plan.md), [`chat_session_frontend_features_plan.md`](./chat_session_frontend_features_plan.md), [`copilot_implementation_plan.md`](./copilot_implementation_plan.md) **전체에 공통으로 적용되는 결정과 흐름**을 모은 단일 source of truth입니다.

각 Phase plan은 "자세한 흐름/룰은 본 문서 참조"로 링크만 걸고, 변경 사항이 생기면 **여기만 수정**하는 원칙으로 운영합니다.

---

## 1. 사용자 흐름 (Happy Path)

### 1.1 가입 → 로그인 → 홈

```
1. 비로그인 유저가 /auth/join 진입
2. 이름 / 이메일 / 비밀번호 / 비밀번호 확인 + role(client | facilitator) 입력
   - role은 client/facilitator 탭으로 선택 (hidden input)
3. zod 검증 통과 → supabase.auth.signUp({ email, password, options.data: { name, role } })
4. DB trigger(`handle_new_user`)가 profiles 자동 생성 + role 설정
5. signUp 성공 시 / 로 redirect (이메일 인증 미사용 가정 — MVP 운영 정책)
6. 이미 로그인된 유저가 /auth/login 또는 /auth/join 진입 → auth-layout loader가 / 로 redirect
```

> **MVP 운영 정책**: Supabase Dashboard에서 "Confirm email" 옵션 OFF 가정. ON일 경우 이메일 인증 후 로그인 가능.

### 1.2 Client → Facilitator 프로필 → DM 시작 → 세션 만들기

```
[Client]
1. /facilitators 에서 facilitator 선택 → /facilitators/:id 프로필
2. "DM" 버튼 클릭 → action(intent='send-dm') → getOrCreateDmRoom(otherId=facilitator)
3. /chats/dms/:roomId 로 redirect
4. 일반 메시지 송수신

[Facilitator]
5. /chats/dms/:roomId 진입 → DM 메시지 송수신
6. 우측 상단 또는 dropdown의 "세션 시작" 클릭 → action(intent='create-session')
   - 같은 (facilitator, client) 페어의 최신 세션이 있으면 그쪽으로 redirect
   - 없으면 createSession → 새 세션으로 redirect
7. /chats/sessions/:sessionId 진입
```

### 1.3 세션 진행 (Facilitator 주도)

```
1. facilitator가 "세션 시작" 버튼 클릭 → intent='start-session'
   → session_rooms.is_active=true, started_at=now()
2. client/facilitator 양쪽이 메시지 송수신 (Realtime)
3. facilitator가 입력창 옆 "AI 초안" 버튼 클릭
   → fetch /api/ai/generate (SSE)
   → AI 초안 카드에 스트리밍 표시
4. facilitator가 초안 검토 후 옵션:
   (a) "Use" → 초안 텍스트가 입력창에 채워짐 (자동 전송 X)
   (b) "Edit" → 초안 inline 수정
   (c) refine 입력 → 추가 호출 (parent_draft_id 연결)
   (d) "Regenerate" → 새 root draft
   (e) "Stop" → 진행 중 호출 abort
5. facilitator가 입력창의 텍스트를 검토/수정 후 전송
   → sendSessionMessage (aiDraftId 함께)
   → DB: session_messages INSERT + ai_drafts.used=true + sent_session_message_id 연결
6. 세션 종료: facilitator가 "세션 종료" 클릭
   → session_rooms.is_active=false, ended_at=now()
   → 메시지 송수신과 AI 호출은 종료 후에도 계속 가능 (단순 시간 측정용 토글)
```

### 1.4 Client 워크시트 작성 → Facilitator 조회 → 코파일럿 전송

```
[Client]
1. /chats/sessions/:sessionId 에서 우측 상단 ↓ 토글 → WorksheetOverlay 열림
2. 선택 화면에서 "이웃 판단하기 양식" 또는 "생각이 잘 잡히지 않을 때" Item 클릭 → "사용"
3. 6 페이지 작성 (페이지 넘김에도 state 유지, 닫으면 휘발)
4. 마지막 페이지에서 "전송" 클릭 → intent='save-worksheet'
   → DB: worksheets INSERT (data jsonb에 rich form 저장)

[Facilitator]
5. 같은 세션의 토글 → WorksheetOverlay 열림
6. 선택 화면에서 워크시트 종류 Item 클릭 → "조회"
   → loader/prop으로 getLatestWorksheet(sessionId, type) 결과 전달
7. 작성 화면이 textarea 대신 plain text로 client 답변을 렌더
8. 마지막 페이지에서 "코파일럿 전송" 클릭
   → fetch /api/ai/generate { sessionId, worksheetId }
   → resource route가 worksheets.data를 input context에 prepend
   → AI 초안 카드에 결과 스트리밍 (1.3의 4번 흐름과 동일)
```

### 1.5 감정 목록 (양 측 동일)

```
1. WorksheetOverlay 열기 → 선택 화면의 "감정 목록" Item 클릭 → "사용"
2. Accordion 9 카테고리 펼침
3. 단어 클릭 → navigator.clipboard.writeText(word) + toast("복사되었습니다")
4. 워크시트 작성 textarea나 채팅 입력창에 붙여넣기 → 평소처럼 진행
5. DB 저장 / 클릭 기록 없음 (순수 reference)
```

---

## 2. 데이터 휘발 vs 영속화 종합표

| 항목 | 저장 여부 | 위치 | 메모 |
|---|---|---|---|
| client 메시지 | ✅ DB | `session_messages` | sender_type='client' (서버 결정) |
| facilitator 메시지 (직접 작성) | ✅ DB | `session_messages` | sender_type='facilitator' |
| facilitator 메시지 (AI 초안 기반) | ✅ DB | `session_messages` + `ai_drafts.sent_session_message_id` 연결 | sender_type='ai' |
| DM 메시지 | ✅ DB | `dm_messages` | — |
| AI 초안 (원본 / 첫 생성) | ✅ DB | `ai_drafts` (parent_draft_id=NULL) | fine-tuning용 — Use 안 해도 저장 |
| AI 초안 (refine 시도들) | ✅ DB | `ai_drafts` (parent_draft_id로 체인) | 모든 시도 저장 |
| AI 초안 — 작성/스트리밍 중 텍스트 | ❌ 메모리 only | React state | 페이지 떠나면 휘발 |
| AI 초안 — `used` 플래그 | ✅ DB | `ai_drafts.used` | "Use" 후 실제 메시지 전송 시 true |
| AI 초안 — 채택 매핑 | ✅ DB | `ai_drafts.sent_session_message_id` | 전송된 메시지 id |
| OpenAI conversation id | ✅ DB | `session_rooms.openai_conversation_id` | 세션당 1개 |
| 워크시트 (client 작성 완료본) | ✅ DB | `worksheets.data` (rich JSON) | type별 N개 가능 |
| 워크시트 (작성 중) | ❌ 메모리 only | `WorksheetOverlay` state | 닫으면 휘발 (localStorage X) |
| 워크시트 (facilitator 조회) | (읽기만) | `worksheets` SELECT | 수정 불가 |
| 감정 목록 클릭 기록 | ❌ 저장 안 함 | — | 순수 reference |
| 메시지 좋아요 (누가 눌렀는지) | ✅ DB | `dm_message_likes` / `session_message_likes` | UI엔 카운트만 노출 |
| 좋아요 카운트 | ✅ DB | 메시지 테이블의 `likes` 컬럼 | 트리거가 채움 |
| 메시지 입력창 텍스트 | ❌ 메모리 only | React state | 페이지 이동 시 휘발 |
| AI 코파일럿 패널 접기/펴기 상태 | ❌ 메모리 only | `AiSuggestionCard` state | 새로고침 시 펼침으로 리셋 |
| 사이드바 펼침/접힘 (있다면) | ❌ 메모리 only | UI state | — |

---

## 3. 권한 / 접근 매트릭스

| 화면 / 자원 | 비로그인 | client | facilitator | 비참가자 |
|---|---|---|---|---|
| `/auth/login`, `/auth/join` | ✅ | redirect → `/` | redirect → `/` | — |
| `/auth/logout` | redirect → `/` | ✅ | ✅ | — |
| `/`, `/facilitators` | ✅ | ✅ | ✅ | — |
| `/facilitators/:id` | ✅ (보기만) | ✅ + DM/예약 가능 | ✅ + DM 가능 | — |
| `/chats` (사이드바) | redirect → login | ✅ (본인 방만) | ✅ (본인 방만) | — |
| `/chats/dms/:roomId` | redirect → login | ✅ (멤버일 때) | ✅ (멤버일 때) | 404 또는 redirect |
| `/chats/sessions/:id` | redirect → login | ✅ (client_id == 본인) | ✅ (facilitator_id == 본인) | 404 또는 redirect |
| DM 생성 | — | ✅ (intent='send-dm') | ✅ | — |
| 세션 생성 | — | ❌ | ✅ (intent='create-session' in DM) | — |
| `start-session` / `end-session` | — | ❌ | ✅ (본인 세션만) | — |
| 메시지 전송 | — | ✅ (본인 멤버 방) | ✅ (본인 멤버 방) | RLS 거부 |
| 좋아요 토글 | — | ✅ (본인 멤버 방의 메시지) | ✅ (본인 멤버 방의 메시지) | RLS 거부 |
| 워크시트 작성 / 저장 | — | ✅ (본인 세션) | ❌ | — |
| 워크시트 조회 | — | ✅ (본인 작성) | ✅ (담당 세션) | RLS 거부 |
| AI 초안 생성 (`/api/ai/generate`) | — | ❌ | ✅ (담당 세션만) | 거부 |
| `ai_drafts` SELECT | — | ❌ (RLS) | ✅ (본인 draft만) | 거부 |
| 감정 목록 사용 | — | ✅ | ✅ | — |

> **404 vs redirect 정책**: 권한 없는 방에 접근 시도 시 loader가 `redirect("/chats")` 처리 (404보다 부드러움).

---

## 4. 엣지 케이스 결정 사항

### 4.1 "새 세션" dropdown menu (chat-session-page 우측 상단)
- facilitator 전용
- **동작**: 현재 보고 있는 세션의 client와의 **새 session_rooms 생성** (intent='create-session'과 동일 로직) → 새 세션으로 redirect
- 같은 페어의 기존 세션은 그대로 둠 (sidebar 세션 목록에 모두 누적)
- 한 client와 N개 세션 가능

### 4.2 세션 종료 후 메시지 전송 가능 여부
- ✅ 가능 (`is_active`는 단순 시간 측정용 토글이지 기능 게이트가 아님)
- AI 호출도 가능

### 4.3 빈 세션 (메시지 0개) 처리
- 자동 삭제 X. 그대로 둠. sidebar에 표시되긴 하나 last_message는 NULL.

### 4.4 같은 세션에 워크시트 여러 개 작성 가능 여부
- ✅ 가능 (type별 N개)
- facilitator의 "조회"는 `getLatestWorksheet(sessionId, type)`으로 **가장 최근 1개**만 보여줌
- 과거 워크시트도 DB엔 남아 있음 (fine-tuning 데이터 보존)

### 4.5 같은 type 워크시트 재작성 시 이전 것 처리
- 이전 것 그대로 DB 남김 (overwrite/delete 안 함)
- 사용자가 작성 의도하지 않은 워크시트는 닫기 = 휘발이라 DB 도달 안 함

### 4.6 회원가입 후 자동 로그인 / 이메일 인증
- MVP 정책: Supabase "Confirm email" OFF 가정 → signUp 직후 세션 발급되어 즉시 / 로 redirect
- ON이면 이메일 인증 안내 화면 별도 필요 (MVP 범위 밖)

### 4.7 facilitator가 로그아웃하면 client의 세션 표시
- client 사이드바에는 facilitator 이름 + 정보가 표시되는 채로 유지 (online 표시 X — MVP 범위 밖)
- 실시간 입장/퇴장 표시 없음

### 4.8 AI 호출이 50개 메시지 이상 누적된 세션에서
- soft warning Alert: "이 세션이 길어졌습니다. 새 세션 시작을 권장합니다."
- 호출 차단 X — facilitator가 무시하고 계속 호출 가능
- 차단되는 건 동시 호출(이미 생성 중) 뿐

### 4.9 워크시트의 박스 닫기 (X / 토글 다시 클릭)
- React state 전부 초기화 → 작성 중이던 내용은 모두 휘발
- localStorage 백업 X

### 4.10 AI 코파일럿 패널 접기 / 펴기
- facilitator 화면에서 `AiSuggestionCard` 상단의 "접기" / "펴기" 토글
- 접으면 본문 + Stop / Regenerate 버튼도 함께 숨김
- 새로고침 시 펼침 상태로 리셋 (저장 X)

### 4.11 DM에서 facilitator가 세션 만들기 vs 세션 페이지에서 새 세션
- 둘 다 같은 mutation 호출 (`createSession`)
- DM의 "세션 시작" = 기존 세션 있으면 그쪽으로 redirect, 없으면 신규
- 세션 페이지의 "새 세션" dropdown = 무조건 신규 (4.1)

### 4.12 client가 자기 메시지에 좋아요
- ✅ 허용. 룰을 단순하게 유지.

### 4.13 좋아요 누른 유저 표시
- UI에는 카운트만 표시 (누가 눌렀는지 노출 X)
- DB에는 `(dm_message_id, profile_id)` 또는 `(session_message_id, profile_id)` composite로 누가 눌렀는지 저장됨 (composite PK로 중복 방지)

### 4.14 AI 초안의 fine-tuning 데이터 가치 보존
- Use 안 한 draft도 `used=false`로 저장 (refine 시도 + reject한 것 모두)
- regenerate 시 새 root draft (parent_draft_id=NULL)
- refine 시 parent_draft_id로 체인 → 시도 전체 복원 가능
- 최종 전송 시 `sent_session_message_id` 연결 → "어떤 초안이 어떻게 수정되어 전송됐는지" 추적

### 4.15 워크시트 코파일럿 전송 후 conversation에 누적
- worksheet `data`가 OpenAI conversation에 prepend
- `store: true`로 호출하므로 이후 일반 메시지 응답에도 워크시트 컨텍스트가 영향
- 새 세션 시작 시 새 conversation → 워크시트 컨텍스트 초기화

---

## 5. 문서 운영 원칙

- **결정 사항 변경 시 본 문서를 먼저 수정**한 뒤, 영향받는 Phase plan에서 링크를 통해 참조.
- 본 문서의 표/리스트 항목은 Phase plan에 중복 작성하지 않음 (DRY).
- 새 시나리오나 엣지 케이스를 발견하면 위 섹션 4에 추가.
- 권한 / 접근 매트릭스(섹션 3)는 RLS 정책 / loader redirect 결정의 기준.
