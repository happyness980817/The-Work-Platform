# The Work Platform

### Routes

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
