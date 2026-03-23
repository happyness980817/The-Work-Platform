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

`features/` 폴더를 없애고, 역할별 최상위 폴더 → 기능별 하위 폴더 구조로 전환한다.

```
app/
  common/                              ← 비로그인/공통 (현재와 동일)
    components/
      ui/                              ← shadcn 컴포넌트
      navigation.tsx
      footer.tsx
      input-pair.tsx
      timezone-selector.tsx
    layouts/
      site-layout.tsx
    pages/
      home-page.tsx
      about-page.tsx
      facilitators-page.tsx

  all-users/                           ← facilitator/client 공통
    auth/
      components/
      layouts/
        auth-layout.tsx
      pages/
        login-page.tsx
        join-page.tsx
      queries.ts
      mutations.ts
      schema.ts
    bookings/
      components/
        bookings-session-card.tsx
        sessions-list-item-card.tsx
      layouts/
        bookings-layout.tsx
      pages/
        bookings-dashboard-page.tsx
      queries.ts
      mutations.ts
    chats/                             ← 채팅 (공통, role 분기로 처리)
      components/
        messages-bubble.tsx
        message-rooms-card.tsx
        ai-suggestion-card.tsx         ← facilitator 세션에서만 표시
      layouts/
        chat-layout.tsx
        chat-shell-layout.tsx
      pages/
        chats-index-page.tsx
        chat-session-page.tsx          ← AI 제안 패널 포함 (role 분기)
        chat-dm-page.tsx
      queries.ts
      mutations.ts
    platform/                          ← 공개 facilitator 상세/예약
      components/
        facilitator-card.tsx
        facilitator-profile-card.tsx
        time-slot-picker.tsx
      pages/
        facilitator-booking-page.tsx
        facilitator-profile-page.tsx
      queries.ts
    ai/                                ← AI 전용 (OpenAI 연동)
      lib/
        openai-client.ts               ← Assistants API / Responses API 래퍼
    profile/
      pages/
        profile-page.tsx
        settings-page.tsx
      queries.ts
      mutations.ts
    data/
      facilitators.ts


  facilitators/                        ← facilitator 전용
    bookings/
      components/
        booking-request-card.tsx
      pages/
        manage-bookings-page.tsx
        sessions-list.tsx
        availability-page.tsx
      queries.ts
      mutations.ts
      schema.ts
    ai/
      components/
        ai-suggestion-card.tsx
      queries.ts                       ← AI 제안 히스토리 조회
      mutations.ts                     ← generateAiResponse, refineAiResponse
      schema.ts                        ← ai_suggestions, ai_threads 등

  clients/                             ← client 전용
    bookings/
      components/
        client-booking-card.tsx
      pages/
        submit-application-form.tsx
      queries.ts
      mutations.ts
      schema.ts



```
