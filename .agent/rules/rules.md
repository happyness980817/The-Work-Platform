---
trigger: always_on
---

---

## trigger: always_on

# AI-Assisted Counseling MVP (React + shadcn/ui + React Router Framework Mode + Supabase) 프로젝트 규칙

코드 작성시 개발자에게는 항상 존댓말로 답변한다.

## 0. 서비스 목적

- 이 서비스는 상담 중 AI의 도움을 받아 답변 초안을 얻으려는 심리상담사를 위한 보조 도구다.
- 상담의 1차적 책임과 최종 결정권은 항상 인간 상담사에게 있으며 AI는 답변을 추천할 뿐 직접 응답하지 않는다.

## 1. 기술 스택 / 전반

- 프론트엔드는 React 기반으로 구성하며 UI는 shadcn/ui를 기본으로 사용한다.
- 라우팅은 React Router의 framework mode를 사용한다.
- 데이터베이스는 Supabase(Postgres)를 사용한다.
- 데이터베이스 schema 생성을 위해 drizzleORM 을 사용한다.
- 로그인/회원가입을 포함한 인증 기능을 구현한다.
- MVP라도 UX를 해치지 않는 범위에서 사이드바(채팅방 선택)등의 기능을 제공한다.

## 2. 코드 스타일

- 상태 관리는 React Router의 데이터 로딩/액션 패턴을 우선한다.
- UI는 shadcn/ui 컴포넌트를 기반으로 하되, 접근성(키보드 탐색, 포커스)과 일관된 인터랙션을 유지한다.
- 환경변수/키는 절대 하드코딩하지 않는다.
- 리액트 컴포넌트 함수는 default export 를 사용한다.
- loader 및 action 함수는 named export 와 arrow function을 사용한다.

코드 예시:

```import type { Route } from "./+types/category-page";
import { Hero } from "~/common/components/hero";
import { ProductCard } from "../components/product-card";
import ProductPagination from "~/common/components/product-pagination";
import {
  getCategory,
  getProductsByCategory,
  getCategoryPages,
} from "../queries";
import { z } from "zod";
import { data } from "react-router";
import { makeSSRClient } from "~/supa-client";

export const meta = ({ params }: Route.MetaArgs) => {
  return [
    { title: `Developer Tools | WeMake` },
    { name: "description", content: `Browse Developer Tools products` },
  ];
};

const categoryIdSchema = z.coerce.number().int();
const pageSchema = z.coerce.number().int().min(1).optional().default(1);

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const url = new URL(request.url);

  const { success: isCategoryIdValid, data: categoryId } =
    categoryIdSchema.safeParse(params.category);
  if (!isCategoryIdValid) throw new Error("Invalid Category ID");

  const { success: isPageValid, data: page } = pageSchema.safeParse(
    url.searchParams.get("page") ?? undefined
  );
  if (!isPageValid) throw new Error("Invalid page");

  const [category, products, totalPages] = await Promise.all([
    getCategory(client, categoryId),
    getProductsByCategory(client, { categoryId, page }),
    getCategoryPages(client, categoryId),
  ]);
  return data({ category, products, totalPages }, { headers });
};

export default function CategoryPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-10">
      <Hero
        title={loaderData.category.name}
        subtitle={loaderData.category.description}
      />
      <div className="space-y-5 w-full max-w-3xl mx-auto">
        {loaderData.products.map((product) => (
          <ProductCard
            key={product.product_id}
            id={product.product_id}
            name={product.name}
            tagline={product.tagline}
            reviewsCount={product.reviews}
            viewsCount={product.views}
            likesCount={product.likes}
          />
        ))}
      </div>
      <ProductPagination totalPages={loaderData.totalPages} />
    </div>
  );
}
```

## 3. 라우팅 / 서버 구조

- 최신 버전 React Router(framework mode) 기준으로 라우트/레이아웃을 설계한다.
- 공개 라우트(로그인/회원가입)와 보호 라우트(앱 본체)를 명확히 분리한다.
- 인증/권한은 MVP에 필요한 범위에서만 구현하되, 최소한 아래를 제공한다:
  - 회원가입
  - 로그인/로그아웃
  - 세션 유지(새로고침/재접속)
- 서버 사이드가 필요할 경우에도 “인증/AI 호출/실시간” 등 핵심에만 집중하며, 불필요한 서버 레이어를 늘리지 않는다.

## 4. Supabase Realtime / 역할 구조

- 실시간 채팅은 역할 기반(내담자/상담사)을 명확히 유지한다.
- 상담사 전용 AI 패널과 내담자 화면의 노출 범위를 절대 혼동하지 않는다.
- 이벤트/메시지 설계는 단순하게 유지하되, 아래 제품 요구를 지원해야 한다:
  - 사이드바에서 채팅방(세션) 목록을 선택/전환
  - 시작화면(대기실)에서 “현재 온라인인 상담사 목록/상태” 표시
  - 온라인/오프라인/자리비움 등 상태 변화가 실시간으로 반영

## 5. OpenAI 사용 방식

- OpenAI 호출은 서버에서만 수행하며, 프론트엔드에서 직접 호출하지 않는다.
- OpenAI SDK는 공식 `openai` Node SDK를 사용하고, API는 Responses API를 사용한다.
- `new OpenAI({ apiKey: process.env.OPENAI_API_KEY })` 형태를 유지한다.
- Responses API 호출 시 기본 모델은 `gpt-5.2`이며, instructions/developer 프롬프트에는 바이런 케이티의 ‘The Work’ 네 가지 질문 철학을 반영한다.
- AI는 “상담사에게 초안/추천”만 제공하며, 내담자에게 자동 전송하거나 AI가 직접 대화를 주도하지 않는다.

## 6. DB / Supabase 지침

- 데이터베이스는 Supabase(Postgres)를 사용한다.
- DB 접근은 Supabase 클라이언트/SQL 기반으로 단순하게 유지한다.
- 메시지/세션 데이터는 분석과 개선을 위해 세션 단위로 저장한다.
- 최소한 아래 정보는 영구 저장한다:
  - 사용자: id, 역할(내담자/상담사), 표시 이름, 생성 시각
  - 세션(채팅방): room code(또는 고유 식별자), 생성 시각, 참여자(내담자/상담사), OpenAI conversation ID
  - 메시지: 소속 세션, 발신자(client/counselor/ai), 텍스트, 전송 시각, 내담자 노출 여부(예: AI 초안)
  - 상담사 온라인 상태: 상담사 id, 상태(online/away/offline 등), 마지막 업데이트 시각
- Supabase는 DB(및 필요한 최소 기능)로만 사용하며, 도입 범위를 불필요하게 넓히지 않는다.

## 7. 프론트엔드 / UI

- shadcn/ui를 기본으로 하고, 라우트 레이아웃은 다음을 충족한다:
  - 시작화면(대기실): 온라인 상담사 목록/상태, 빠른 시작/방 참여 진입점
  - 앱 본체: 좌측 사이드바(채팅방 목록/선택), 메인 채팅 영역
  - 상담사 화면: 메인 채팅 + 우측 AI 보조 패널의 2열 구조 유지
- 내담자/상담사 화면은 기본 레이아웃 일관성을 유지하되, 상담사 전용 기능(AI 패널/AI 히스토리)은 상담사에게만 보이게 한다.

## 8. MVP 범위 관리

- 이 프로젝트는 AI 보조 심리상담 MVP이므로 비즈니스 가설 검증에 필요한 최소 기능만 구현한다.
- 단, 현재 MVP 범위에는 아래 기능이 포함된다:
  - 로그인/회원가입
  - 시작화면(온라인 상담사 등)
  - 사이드바 기반의 채팅방 선택/전환
- 결제, 관리자 대시보드, 과도하게 복잡한 권한 시스템은 도입하지 않는다.
- 기능 제안/구현 시 기존 핵심 흐름(세션 선택/입장 → 채팅 → AI 초안 생성/수정 → 최종 메시지 전송)을 해치지 않는다.

## 9. 핵심 기능

- 사용자는 회원가입/로그인 후 앱에 진입한다.
- 시작화면(대기실)에서 온라인 상담사(및 상태)를 확인하고 세션을 생성/선택할 수 있다.
- 앱 본체는 사이드바에서 채팅방(세션) 목록을 선택/전환할 수 있다.
- 내담자 메시지는 양측에 실시간으로 표시되며, 상담사 측 AI 초안 생성 입력으로 활용될 수 있다.
- AI가 생성한 답변 초안은 상담사 화면에서만 보이며 내담자 화면에는 절대 노출되지 않는다.
- AI 답변은 자동 전송되지 않고 상담사가 초안을 검토해 수정 지시를 내리거나 최종 답변으로 전송해야 한다.
- 최종 답변으로 전송된 메시지만 내담자 화면의 본 채팅에 기록되며, AI 초안 및 수정 과정은 상담사 전용 히스토리로만 남는다.

## 10. Non-Goals

- AI가 내담자와 직접 대화하거나 상담사 승인 없이 자동 응답하는 기능은 구현하지 않는다.
- 장기 치료 계획 수립, 공식 진단, 법률/재정 자문 등은 서비스 목적 범위를 벗어난다.
- 다자간 회의, 다양한 역할, 관리자 대시보드 등 복잡한 워크플로우는 MVP 단계에서 제외한다.

## 11. 공식 문서 참조

- https://platform.openai.com/docs/guides/text
- https://platform.openai.com/docs/api-reference/responses
- https://platform.openai.com/docs/guides/conversation-state?api-mode=responses
- Responses API 관련 코드는 최신 공식 문서를 근거로 작성하며, 확실하지 않은 내용은 생성하지 않는다.

url 파리미터 등의 데이터 검증을 위해 zod 를 사용한다.
날짜 작업을 위해 luxon 을 사용한다.

코드 예시:

```
import type { Route } from "./+types/product-reviews-page";
import { Button } from "~/common/components/ui/button";
import { Dialog, DialogTrigger } from "~/common/components/ui/dialog";
import { ReviewCard } from "~/features/products/components/review-card";
import CreateReviewDialog from "~/features/products/components/create-review-dialog";
import { useOutletContext } from "react-router";
import { getReviews } from "../queries";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import z from "zod";
import { createProductReview } from "../mutations";
import { useState, useEffect } from "react";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Product Reviews | Wemake" },
    { name: "description", content: "Product reviews page" },
  ];
};

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const reviews = await getReviews(client, Number(params.productId));
  return { reviews };
};

const formSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  review: z.string().min(1).max(1000),
});

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const formData = await request.formData();
  const { success, error, data } = formSchema.safeParse(
    Object.fromEntries(formData),
  );
  if (!success) {
    return {
      formErrors: z.flattenError(error).fieldErrors,
    };
  }
  await createProductReview(client, {
    productId: params.productId,
    rating: data.rating,
    review: data.review,
    userId,
  });
  return {
    ok: true,
  };
};

export default function ProductReviewsPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { review_count } = useOutletContext<{ review_count: string }>();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (actionData?.ok) {
      setOpen(false);
    }
  }, [actionData]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="space-y-10 max-w-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {review_count} {review_count === "1" ? "Review" : "Reviews"}
          </h2>
          <DialogTrigger asChild>
            <Button variant="secondary">Write a review</Button>
          </DialogTrigger>
        </div>
        <div className="space-y-20">
          {loaderData.reviews.map((review) => (
            <ReviewCard
              key={review.review_id}
              authorName={review.user.name}
              username={review.user.username}
              avatarURL={review.user.avatar}
              rating={review.rating}
              content={review.review}
              timestamp={review.created_at}
            />
          ))}
        </div>
      </div>
      <CreateReviewDialog />
    </Dialog>
  );
}
```

drizzle 스키마 예시:

```
import { DateTime } from "luxon";
import { PAGE_SIZE } from "./constants";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const productColumns = `
  product_id,
  name,
  tagline,
  likes:stats->>likes,
  views:stats->>views,
  reviews:stats->>reviews
`;

export const getProductsByDateRange = async (
  client: SupabaseClient<Database>,
  {
    startDate,
    endDate,
    limit,
    page = 1,
  }: {
    startDate: DateTime;
    endDate: DateTime;
    limit: number;
    page?: number;
  },
) => {
  const { data, error } = await client
    .from("products")
    .select(productColumns)
    .order("stats->>likes", { ascending: false })
    .gte("created_at", startDate.toISO())
    .lte("created_at", endDate.toISO())
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (error) throw error;
  return data;
};

export const getProductsPagesByDateRange = async (
  client: SupabaseClient<Database>,
  {
    startDate,
    endDate,
  }: {
    startDate: DateTime;
    endDate: DateTime;
  },
) => {
  const { count, error } = await client
    .from("products")
    .select(`product_id`, { count: "exact", head: true })
    .gte("created_at", startDate.toISO())
    .lte("created_at", endDate.toISO());
  if (error) throw error;
  if (count) return Math.ceil(count / PAGE_SIZE); // 올림
  return 1;
};

export const getAllTimeProducts = async (
  client: SupabaseClient<Database>,
  {
    limit,
    page = 1,
  }: {
    limit: number;
    page?: number;
  },
) => {
  const { data, error } = await client
    .from("products")
    .select(productColumns)
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  if (error) throw error;
  return data;
};

export const getAllTimeProductsPages = async (
  client: SupabaseClient<Database>,
  { limit }: { limit: number },
) => {
  const { count, error } = await client
    .from("products")
    .select(`product_id`, { count: "exact", head: true });
  if (error) throw error;
  if (count) return Math.ceil(count / limit);
  return 1;
};

export const getCategories = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client
    .from("categories")
    .select(`category_id, name, description`);
  if (error) throw error;
  return data;
};

export const getCategory = async (
  client: SupabaseClient<Database>,
  categoryId: number,
) => {
  const { data, error } = await client
    .from("categories")
    .select(`category_id, name, description`)
    .eq("category_id", categoryId)
    .single();
  if (error) throw error;
  return data;
};

export const getProductsByCategory = async (
  client: SupabaseClient<Database>,
  {
    categoryId,
    page,
  }: {
    categoryId: number;
    page: number;
  },
) => {
  const { data, error } = await client
    .from("products")
    .select(productColumns)
    .eq("category_id", categoryId)
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (error) throw error;
  return data;
};

export const
```
