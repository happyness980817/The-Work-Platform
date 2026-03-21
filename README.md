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

## Refactoring Plan (2026.03.21)

```

features/
  auth/
    components/
    layouts/
    pages/
    queries.ts          ← 로그인/회원가입 쿼리
    mutations.ts
    schema.ts

  facilitators/          ← facilitator 전용 전부 통합
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
    queries.ts           ← facilitator 세션/예약 조회
    mutations.ts         ← 예약 수락/거절 등
    schema.ts

  clients/               ← client 전용
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
    facilitator/         ← facilitator 채팅
      pages/
    client/              ← client 채팅
      pages/
    components/          ← 공통 채팅 컴포넌트 (bubble 등)
    queries.ts
    mutations.ts

  platform/              ← 비로그인/공통 (목록, 상세, about)
    components/
    pages/
    queries.ts


```
