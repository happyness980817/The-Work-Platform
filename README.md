# The Work Platform

## Routes

```
공개 (인증 불필요):

├── "/" : home-page.tsx
├── "/about" : about-page.tsx
├── "/auth"
│         ├── "/login" : login-page.tsx
│         ├── "/signup/client" : client-signup-page.tsx
│         └── "/signup/facilitator" : facilitator-signup-page.tsx
│         └── "/logout" : logout-page.tsx

client login:

├── "/facilitators" : facilitators-page.tsx
│         └── "/:facilitatorId" : facilitator-profile-page.tsx (프로필 + 캘린더 예약)
├── "/my"
│         ├── "/bookings" : client-bookings-page.tsx
│         ├── "/profile" : profile-page.tsx
│         ├── "/settings" : settings-page.tsx
│         └── "/messages" : messages-page.tsx
│                   └── "/:conversationId" : conversation-page.tsx

facilitator login:

├── "/facilitators/:facilitatorId" : 본인 ID → /my/profile 리다이렉트, 타인 → 읽기 전용 (예약 버튼 숨김)
├── "/my"
│         ├── "/bookings" : facilitator-bookings-page.tsx
│         ├── "/profile" : profile-page.tsx
│         ├── "/settings" : settings-page.tsx
│         └── "/messages" : messages-page.tsx
│                   └── "/:conversationId" : conversation-page.tsx (+ AI 보조 패널)

```

## Refactoring Plan (2026.03.23)

```
features/
  auth/
    components/
    layouts/
    pages/
    queries.ts
    mutations.ts
    schema.ts

  facilitators/
    components/
      session-info-card.tsx
      booking-request-card.tsx
      session-card.tsx
    layouts/
      bookings-layout.tsx
    pages/
      manage-page.tsx
      sessions-page.tsx
      availability-page.tsx
      settings-page.tsx
      profile-page.tsx
    queries.ts
    mutations.ts
    schema.ts

  clients/
    components/
      client-booking-card.tsx
    pages/
      manage-page.tsx
      settings-page.tsx
      profile-page.tsx
    queries.ts
    mutations.ts
    schema.ts

  chats/
    facilitator/
      pages/
        session-page.tsx      ← AI 제안 버튼이 여기에 붙음
        dm-page.tsx
    client/
      pages/
        chat-page.tsx
    components/
      messages-bubble.tsx
      message-rooms-card.tsx
    layouts/
      chat-layout.tsx
      chat-shell-layout.tsx
    queries.ts                ← 메시지/룸 조회
    mutations.ts              ← 메시지 전송

  ai/                         ← AI 전용 (OpenAI 연동)
    components/
      ai-suggestion-card.tsx
    lib/
      openai-client.ts        ← Assistants API / Responses API 래퍼
    queries.ts                ← AI 제안 히스토리 조회
    mutations.ts              ← generateAiResponse, refineAiResponse
    schema.ts                 ← ai_suggestions, ai_threads 등

  platform/
    components/
      facilitator-card.tsx
      facilitator-profile-card.tsx
      time-slot-picker.tsx
    pages/
      facilitators-page.tsx
      facilitator-profile-page.tsx
    queries.ts


```
