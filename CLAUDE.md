# CLAUDE.md — The Work Platform

## 레퍼런스 프로젝트

이 프로젝트는 [C:\product\web\references\wemake-master](https://github.com/happyness980817/wemake) 프로젝트의 코드 구조와 패턴을 따른다.
새로운 기능을 구현하거나 코드를 수정할 때, wemake의 구조를 먼저 참고한 뒤 동일한 패턴을 적용한다.

---

## 피처 모듈 규칙

각 feature 디렉토리는 wemake와 동일한 내부 구조를 유지한다:

| 파일/폴더      | 역할                                       | 필수       |
| -------------- | ------------------------------------------ | ---------- |
| `pages/`       | 라우트에 매핑되는 페이지 컴포넌트          | O          |
| `components/`  | 피처 전용 재사용 컴포넌트                  | O          |
| `layouts/`     | 피처 전용 레이아웃                         | 선택       |
| `schema.ts`    | Drizzle ORM 테이블 스키마                  | DB 사용 시 |
| `queries.ts`   | 데이터 조회 함수 (SupabaseClient 파라미터) | DB 사용 시 |
| `mutations.ts` | 데이터 변경 함수 (SupabaseClient 파라미터) | DB 사용 시 |
| `constants.ts` | 피처 관련 상수                             | 선택       |

---

## 코드 스타일

### TypeScript

- `interface`를 `type`보다 우선 사용한다.
- `enum` 대신 `map`을 사용한다.
- 함수형, 선언적 프로그래밍 패턴을 사용한다 (class 사용 지양).
- 변수명에 보조 동사를 사용한다 (예: `isLoading`, `hasError`).

### React Router (Framework Mode)

- 페이지 컴포넌트는 `default export`를 사용한다.
- `loader`, `action`, `meta`는 `named export` + `arrow function`을 사용한다.
- `useLoaderData`, `useActionData`는 사용하지 않는다. 대신 `Route.ComponentProps`를 사용한다.
- Route 타입: `import type { Route } from "./+types/...";`
- `json`은 사용하지 않는다. 상태 코드가 필요하면 `data`를 사용하고, 그 외에는 plain object를 반환한다.
- Remix(`@remix-run`)에서 import하지 않는다. 모두 `react-router`에서 import한다.

### UI

- UI 컴포넌트는 반드시 **shadcn/ui**에서 import한다 (Radix UI 직접 import 금지).
- 스타일링은 **Tailwind CSS**를 사용한다.
- 클래스 병합은 `cn()` 유틸리티를 사용한다.

### 데이터

- DB 접근: Supabase 클라이언트를 통해 쿼리한다.
- 모든 쿼리/뮤테이션 함수는 `SupabaseClient<Database>`를 첫 번째 파라미터로 받는다.
- URL 파라미터 등 데이터 검증에는 **Zod**를 사용한다.
- 날짜 처리에는 **Luxon**을 사용한다.

---

## wemake 참조 체크리스트

새로운 기능을 추가할 때 아래를 확인한다:

1. wemake에 동일/유사 기능이 있는지 확인한다
2. 있다면 해당 feature의 디렉토리 구조와 파일 구성을 그대로 따른다
3. queries/mutations 패턴을 동일하게 사용한다
4. 페이지 컴포넌트의 loader/action/meta 패턴을 동일하게 사용한다
5. common 컴포넌트 활용 방식을 동일하게 유지한다

---

## 응답 언어

- 한국어로 답변하며, 항상 존댓말을 사용한다.

## Project Overview

**The Work Platform** — a teletherapy platform inspired by BetterHelp, specialized in Byron Katie's "The Work" (four questions method). An AI copilot (OpenAI Assistants/Responses API) assists facilitators during text-based counseling sessions.

Two user roles: **facilitator** (counselor) and **client** (patient). An `isAdmin` flag on facilitator accounts grants additional permissions (e.g., editing the About page via markdown editor).

````

## Architecture

### AppContext & Role System

`root.tsx` creates an `AppContext` (defined in `types.ts`) and passes it via React Router's `Outlet context`. Pages access it with `useOutletContext<AppContext>()`.

```ts
interface AppContext {
  isLoggedIn: boolean;
  role: "client" | "facilitator";
  isAdmin: boolean; // facilitator + admin privileges (e.g., about page editing)
  name;
  username;
  userId;
  avatar: string;
}
````

Currently using **mock data** in `root.tsx` — no real auth flow yet. Toggle `role` to `"client"` to test client views.

### Role Branching in Pages

Some pages (e.g., `facilitator-manage-page.tsx`) serve both roles by reading `role` from context and conditionally rendering different components (e.g., `BookingRequestCard` for facilitators vs `ClientBookingCard` for clients).

## Conventions

- All user-facing strings go through `t()` from react-i18next. Always add keys to **both** `ko.json` and `en.json`.
- UI components live in `app/common/components/ui/` (shadcn pattern). Feature components are colocated with their feature.
- The About page supports **per-language markdown editing** — content is stored separately for ko/en, switching based on `i18n.language`.
- `@uiw/react-md-editor` must be **lazy-loaded** (`lazy(() => import(...))`) to avoid SSR CSS import errors.
- Facilitator avatar URLs from `features/users/data/facilitators.ts` are reused across components (auth layout IconCloud, facilitator cards, etc.).
