```
features/
  auth/                    (로그인/회원가입 — 공통, 탭으로 분기)
  facilitators/            ← facilitator 전용 전부
    components/
    layouts/
    pages/
      bookings/            (manage, availability, sessions)
      chats/               (session-page, dm-page)
      profile/             (profile, settings)
  clients/                 ← client 전용 전부
    components/
    layouts/
    pages/
      bookings/            (manage, submit-application)
      chats/               (client-chat-page)
      profile/             (profile, settings)
  platform/                ← 비로그인/공통 (facilitator 목록, 상세, about)
    components/
    pages/
```
