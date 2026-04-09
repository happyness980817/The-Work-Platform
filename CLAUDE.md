# CLAUDE.md — The Work Platform

# The Work Platform — 프로젝트 규칙

한국어로 답변하며, 항상 존댓말을 사용한다.

## 서비스 개요

Byron Katie의 "The Work"(네 가지 질문) 기반 텔레테라피 플랫폼. AI 코파일럿(OpenAI Responses API)이 텍스트 상담 중 facilitator를 보조한다.

- 역할: **facilitator**(상담사) / **client**(내담자). facilitator에 `isAdmin` 플래그가 있으면 추가 권한(About 페이지 마크다운 편집 등).
- AI는 상담사에게 답변 초안/추천만 제공하며, 내담자에게 자동 전송하거나 직접 대화를 주도하지 않는다.
- 상담의 최종 결정권은 항상 인간 상담사에게 있다.

## 레퍼런스 프로젝트

`references/wemake-master` 프로젝트의 코드 구조와 패턴을 따른다. 새 기능 구현 시 wemake에 동일/유사 기능이 있는지 먼저 확인하고, 있으면 디렉토리 구조·파일 구성·queries/mutations/loader/action/meta 패턴을 동일하게 적용한다.

## 기술 스택

- **프론트엔드**: React + shadcn/ui + Tailwind CSS
- **라우팅**: React Router (framework mode)
- **DB**: Supabase (Postgres) + Drizzle ORM (스키마)
- **AI**: OpenAI `openai` Node SDK — Responses API, 기본 모델 `gpt-5.2`, 서버에서만 호출
- **검증**: Zod (URL 파라미터 등)
- **날짜**: Luxon
- **i18n**: react-i18next — 모든 사용자 노출 문자열은 `t()` 사용, `ko.json`/`en.json` 양쪽에 키 추가
- 환경변수/키는 절대 하드코딩하지 않는다

## 피처 모듈 구조

각 feature 디렉토리는 wemake와 동일한 내부 구조를 유지한다:

| 파일/폴더      | 역할                                                      | 필수       |
| -------------- | --------------------------------------------------------- | ---------- |
| `pages/`       | 라우트에 매핑되는 페이지 컴포넌트                         | O          |
| `components/`  | 피처 전용 재사용 컴포넌트                                 | O          |
| `layouts/`     | 피처 전용 레이아웃                                        | 선택       |
| `schema.ts`    | Drizzle ORM 테이블 스키마                                 | DB 사용 시 |
| `queries.ts`   | 데이터 조회 함수 (`SupabaseClient<Database>` 첫 파라미터) | DB 사용 시 |
| `mutations.ts` | 데이터 변경 함수 (`SupabaseClient<Database>` 첫 파라미터) | DB 사용 시 |
| `constants.ts` | 피처 관련 상수                                            | 선택       |

## 코드 스타일

### TypeScript

- `interface`를 `type`보다 우선 사용
- `enum` 대신 `map` 사용
- 함수형·선언적 프로그래밍 (class 지양)
- 변수명에 보조 동사 사용 (예: `isLoading`, `hasError`)

### React Router (Framework Mode)

- 페이지 컴포넌트: `default export`
- `loader`, `action`, `meta`: `named export` + `arrow function`
- `useLoaderData`/`useActionData` 사용 금지 → `Route.ComponentProps` 사용
- Route 타입: `import type { Route } from "./+types/...";`
- `json` 사용 금지 → 상태 코드 필요 시 `data`, 그 외 plain object 반환
- `@remix-run` import 금지 → 모두 `react-router`에서 import

### UI

- UI 컴포넌트는 shadcn/ui에서 import (Radix UI 직접 import 금지)
- 스타일링은 Tailwind CSS, 클래스 병합은 `cn()` 유틸리티
- `@uiw/react-md-editor`는 SSR CSS 오류 방지를 위해 `lazy(() => import(...))` 필수

## 아키텍처

### AppContext & 역할 시스템

`root.tsx`에서 `AppContext`(`types.ts` 정의)를 생성, `Outlet context`로 전달. 페이지에서 `useOutletContext<AppContext>()`로 접근.

```ts
interface AppContext {
  isLoggedIn: boolean;
  role: "client" | "facilitator";
  isAdmin: boolean;
  name: string;
  username: string;
  userId: string;
  avatar: string;
}
```

일부 페이지(예: `facilitator-manage-page.tsx`)는 `role`을 읽어 역할별로 다른 컴포넌트를 조건부 렌더링한다.

### 라우팅

- 공개 라우트(로그인/회원가입)와 보호 라우트(앱 본체) 명확히 분리
- 인증: 회원가입, 로그인/로그아웃, 세션 유지(새로고침/재접속) 제공

### 실시간 채팅 (Supabase Realtime)

- 역할 기반(client/facilitator) 명확히 유지
- 상담사 전용 AI 패널 ↔ 내담자 화면 노출 범위 절대 혼동 금지
- 사이드바 채팅방 목록 선택/전환, 온라인 상담사 목록 실시간 반영

## OpenAI 사용

- 서버에서만 호출: `new OpenAI({ apiKey: process.env.OPENAI_API_KEY })`
- Responses API, 모델 `gpt-5.4-nano`, developer 프롬프트에 'The Work' 네 가지 질문 철학 반영
- AI 초안은 상담사 화면에서만 표시, 내담자 화면 노출 절대 불가
- 공식 문서: [Text](https://platform.openai.com/docs/guides/text) · [Responses API](https://platform.openai.com/docs/api-reference/responses) · [Conversation State](https://platform.openai.com/docs/guides/conversation-state?api-mode=responses)

## DB 스키마 (최소 저장)

- **사용자**: id, 역할(client/facilitator), 표시 이름, 생성 시각
- **세션(채팅방)**: room code, 생성 시각, 참여자, OpenAI conversation ID
- **메시지**: 소속 세션, 발신자(client/counselor/ai), 텍스트, 전송 시각

## DB 마이그레이션 규칙

- 에이전트는 Supabase MCP로 직접 테이블을 생성/수정/삭제하지 않는다
- 스키마 변경 시 `schema.ts` 파일만 수정하고, 사용자가 직접 `npm run db:generate` → `npm run db:migrate`를 실행한다
- 마이그레이션 파일 경로: `app/sql/migrations/`

## 핵심 흐름

세션 선택/입장 → 실시간 채팅 → AI 초안 생성 → 상담사 검토/수정 → 최종 메시지 전송 (전송된 메시지만 내담자에게 표시)

## MVP 범위

- **포함**: 로그인/회원가입, 시작화면(상담사 목록), 사이드바 채팅방 선택/전환, 실시간 채팅, AI 초안 생성/수정/전송
- **제외**: 결제, 관리자 대시보드, 복잡한 권한 시스템, AI 자동 응답, 장기 치료 계획, 공식 진단, 다자간 회의, 메시지 읽음 표시, 온라인/오프라인 등 사용자 접속 상태 표시
