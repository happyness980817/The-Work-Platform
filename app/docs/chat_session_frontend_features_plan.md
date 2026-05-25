# 채팅 세션 페이지 프론트엔드 신규 기능 구현 계획

`chat-session-page.tsx`에 추가되는 신규 프론트엔드 기능들 (DM 페이지는 영향 없음).

## 범위 및 원칙

- **이번 단계는 프론트엔드 UI 뼈대만**. 백엔드(DB 저장, 퍼실리테이터-클라이언트 간 연동 등)는 `chat_db_setup_plan.md` / `chat_app_plan.md` 진행 시 함께.
- **클라이언트 화면 위주로 구현**. 퍼실리테이터 측은 확정된 사항만 짧게 명시.
- **i18n 미적용** — 한국어 하드코딩.
- 신규 컴포넌트는 shadcn 우선 사용. 기존 shadcn에 없거나 어색하면 일반 div/button + Tailwind로.

---

## Part 1. AI 코파일럿 패널 접기/펴기 (Facilitator)

기존 `chat-session-page.tsx`의 AI 코파일럿 영역에 **접기/펴기 토글** 추가.

- 패널 상단에 `^` 아이콘 + "접기" 텍스트 버튼
- 클릭 시: 코파일럿 메시지 본문 영역 접힘. 버튼은 `v` (또는 `˅`) 아이콘 + "펴기"로 토글.
- React state `const [isCopilotCollapsed, setIsCopilotCollapsed] = useState(false)` 로 관리.
- 페널티 없음 — 단순 표시/숨김.
- 클라이언트 화면에는 영향 없음 (어차피 코파일럿은 facilitator 전용).

---

## Part 2. The Work 워크시트 오버레이 (Client 메인)

### 2.1 진입점 — 토글 버튼

**위치**: 채팅 헤더("Jane Smith" + "세션 4")의 **구분선 바로 아래**, 채팅 영역 우측 상단.

**모양**: 동그란 (`rounded-full`) 작은 버튼 + `^` 아이콘 (chevron-up, lucide-react `ChevronUpIcon` 추천).

**동작**: 클릭 → 오버레이 박스 열림. 다시 클릭 또는 오버레이의 `X` → 닫힘.

```tsx
const [isWorksheetOpen, setIsWorksheetOpen] = useState(false);

<Button
  variant="outline"
  size="icon"
  className="rounded-full size-9 absolute top-[헤더 구분선 아래쪽 좌표] right-4 z-10"
  onClick={() => setIsWorksheetOpen((prev) => !prev)}
>
  <ChevronUpIcon className="size-4" />
</Button>
```

> 정확한 `top` 값은 헤더 컴포넌트 구조 확인 후 결정.

### 2.2 오버레이 박스 형태

- **위치**: 채팅 영역 내부 우측 상단 (chat 컨테이너 기준 `absolute`).
- **크기**: 가로 = 채팅창 폭의 **약 2/3** (`w-2/3`), 세로 = 채팅창 높이 거의 다 (`h-[calc(100%-헤더높이)]` 또는 `inset-y-[헤더아래]-4`).
- **스타일**: 채팅 위에 떠 있음 (z-index ≥ 토글 버튼). 배경 불투명 (`bg-background`) + 그림자 + 모서리 둥글게.
- **z-index 주의**: 토글 버튼보다 위, 채팅 메시지 위.
- **viewport 단위 X** — 채팅 컨테이너 기준 상대 좌표.

> shadcn `Sheet`는 viewport 풀스크린에 가까워서 이 케이스엔 안 맞음. **shadcn `Card` + 직접 `absolute` 포지셔닝**이 더 적합.

```tsx
{isWorksheetOpen && (
  <Card className="absolute right-2 top-[헤더아래] w-2/3 h-[채팅높이-여백] z-20 shadow-xl flex flex-col">
    {/* 헤더: 제목 + 닫기 X */}
    <div className="flex items-center justify-between border-b p-4">
      <h3 className="font-semibold">{currentTitle}</h3>
      <Button variant="ghost" size="icon" onClick={() => setIsWorksheetOpen(false)}>
        <XIcon className="size-4" />
      </Button>
    </div>
    {/* 콘텐츠 (선택 화면 ↔ 작성 화면 갈아끼움) */}
    <div className="flex-1 overflow-auto p-6">
      {step === 'select' ? <SelectScreen ... /> : <FillScreen ... />}
    </div>
  </Card>
)}
```

### 2.3 콘텐츠 전환 (라우트 이동 없이 state 만으로)

```ts
type WorksheetType = 'judge-your-neighbor' | 'when-story-hard';
type Step = 'select' | 'fill';

const [step, setStep] = useState<Step>('select');
const [worksheetType, setWorksheetType] = useState<WorksheetType | null>(null);
const [pageIndex, setPageIndex] = useState(0);            // 0~5
const [answers, setAnswers] = useState<string[]>(Array(6).fill(''));
```

**박스 닫기 시 모든 state 초기화** → 메모리에서 사라짐 (localStorage X, DB X).

```ts
const handleClose = () => {
  setIsWorksheetOpen(false);
  setStep('select');
  setWorksheetType(null);
  setPageIndex(0);
  setAnswers(Array(6).fill(''));
};
```

**작성 중 워크시트 종류 바꾸고 싶을 때** = 박스 닫고 다시 열기 (그러면 자동으로 선택 화면부터).

### 2.4 선택 화면 (`step === 'select'`)

shadcn **Item** 컴포넌트로 **3개의 항목** 나열.

| 항목 | 설명 | 선택 시 |
|---|---|---|
| 이웃 판단하기 양식 | 스트레스 상황에 대한 판단을 짧고 솔직하게 적어보는 양식 | 6 페이지 작성 화면 (`step='fill'`) |
| 생각이 잘 잡히지 않을 때 | 불편함의 원인이 잘 떠오르지 않을 때 6가지 관점에서 끄집어내는 연습 | 6 페이지 작성 화면 (`step='fill'`) |
| **감정 목록** | The Work Q3/Q4 답변 시 참고하는 **감정 단어 레퍼런스 리스트** | Accordion 화면 (`step='emotions'`) |

```ts
type WorksheetType = 'judge-your-neighbor' | 'when-story-hard' | 'emotions-list';
type Step = 'select' | 'fill' | 'emotions';
```

> **퍼실리테이터 화면**에서는 각 Item에 `사용` 외 `내용 확인하기`, `코파일럿으로 전송` 버튼이 추가로 노출 (구체 동작은 백엔드 단계에서 정의). 감정 목록은 작성하는 워크시트가 아니라 레퍼런스이므로 퍼실리테이터 추가 동작 불필요.

### 2.5 작성 화면 (`step === 'fill'`)

각 워크시트는 6 페이지. 한 번에 한 페이지 노출.

**구조**:
```
┌─────────────────────────────────────────┐
│ [헤더: 제목 + X]                          │
├─────────────────────────────────────────┤
│ ### N번 페이지: 페이지 부제              │
│                                          │
│ (PDF 안내문/예시 거의 그대로 — 길게 가이드) │
│                                          │
│ ┌───────────────────────────────────┐  │
│ │ <textarea>                        │  │
│ │  …                                │  │
│ └───────────────────────────────────┘  │
│                                          │
│  ←   ● ● ● ● ● ●   →                    │
│       (현재 페이지 dot 강조)             │
│                                          │
│  [(마지막 페이지에서) 저장 / 완료]        │
└─────────────────────────────────────────┘
```

**페이지네이션**:
- 좌측 `←`, 우측 `→` 버튼 + 중앙 dot indicator (`●` 6개, 현재 페이지 강조)
- 첫 페이지에선 `←` 숨김, 마지막 페이지에선 `→` 숨김 (disabled 가 아니라 `display: none`)
- shadcn **Carousel** 검토 권장 — embla-carousel 기반으로 dot/화살표 기본 제공. 단, 자유로운 textarea 입력 + 페이지 이동 시 답변 보존이 깔끔히 되도록 페이지 콘텐츠는 state(`answers[pageIndex]`) 로 직접 관리하고, Carousel은 슬라이드 UI만 사용. 복잡해지면 단순 `←→ + dots` 직접 구현이 더 깔끔.

```ts
const handlePrev = () => setPageIndex((i) => Math.max(0, i - 1));
const handleNext = () => setPageIndex((i) => Math.min(5, i + 1));
const handleChange = (value: string) => {
  setAnswers((prev) => {
    const next = [...prev];
    next[pageIndex] = value;
    return next;
  });
};
// 페이지 넘김 시에도 answers state는 유지 → 자동으로 텍스트 복원
```

**Textarea**: shadcn `Textarea`. 충분히 큰 높이 (예: `min-h-[280px]`). resize-y 정도 허용.

### 2.6 페이지별 안내문 (PDF 거의 그대로)

각 워크시트의 각 페이지에는 PDF 안내문/예시를 거의 그대로 표시 (textarea 위에).

#### 워크시트 A: 이웃 판단하기 양식 (Judge-Your-Neighbor)

| 페이지 | 부제 | 안내문 (textarea 상단에 표시) |
|---|---|---|
| 1 | 누가/왜 화나게 하나요 | "그 상황에서, 그 때, 그 곳에서 누가 당신을 (화나게 하나요, 혼란스럽게 하나요, 실망시키나요?) 그 이유는 무엇인가요?"<br>형식: `나는 ___(이름)___은(는) ___(감정)___ 때문에 화가 난다 (슬프다, 혼란스럽다, 두렵다, 기타). 왜냐하면 ___하기 때문이다.`<br>예: "나는 폴 때문에 화가 난다. 왜냐하면 그는 내가 하는 말마다 트집을 잡기 때문이다." |
| 2 | 어떻게 바뀌길 원하나요 | "그 상황에서 당신은 그 사람(들)이 어떻게 바뀌기를 원하나요? 당신은 그 사람(들)이 무엇을 하기를 원하나요?"<br>형식: `나는 ___이(가) ___하기를 원한다.`<br>예: "나는 폴이 자기의 잘못을 알고 뉘우치기를 원한다." |
| 3 | 어떻게 해야 하나요 | "그 상황에서 그 사람(들)한테 충고해주고 싶은 것은 무엇인가요?"<br>형식: `___은(는) ___해야 한다 (하지 말아야 한다).`<br>예: "폴은 거짓말을 하지 말아야 한다." |
| 4 | 무엇이 필요한가요 | "그 상황에서 당신이 행복해지려면 그 사람이 무슨 생각을 하고, 어떤 말을 하고, 무엇을 느끼고, 무엇을 할 필요가 있나요?"<br>형식: `___은(는) ___할 필요가 있다.`<br>예: "폴은 내 말을 잘 들어줄 필요가 있다." |
| 5 | 그 사람을 어떻게 생각하나요 | "당신은 그 상황에서 그 사람을 어떻게 생각하나요? 목록을 만들어 보세요."<br>형식: `___은(는) ___이다 (하다).`<br>예: "폴은 편파적이고, 건방지고, 시끄럽고, 정직하지 않고, 무례하다." |
| 6 | 두 번 다시는 | "당신이 그 상황에서 또는 그 상황에 대해 다시는 경험하고 싶지 않은 점은 무엇인가요?"<br>형식: `나는 앞으로 다시는 ___하고 싶지 않다.`<br>예: "폴의 고마움도 모르고 무례한 행동들을 다시는 보고 싶지 않다." |

#### 워크시트 B: 생각이 잘 잡히지 않을 때 (When the Story is Hard to Find)

| 페이지 | 부제 | 안내문 |
|---|---|---|
| 1 | 상황을 묘사하기 | "여기에는 상황을 '사실'처럼 보이는 형태로 적습니다.<br>예: '그녀는 점심 약속에 나타나지 않았고, 식당에서 나를 기다리게 했고, 전화도 하지 않았다.'<br>이런 '사실'들을 **because** 뒤의 빈칸에 적습니다.<br>그다음 해당되는 감정(슬픔, 분노 등)에 동그라미를 칩니다.<br>그리고 **and it means that** 뒤에는 그 '사실'에 대한 **나의 해석**을 적습니다. 가능한 한 최악의 생각까지 포함해 보세요.<br>예: '그녀는 더 이상 나를 사랑하지 않는다.' 또는 '그녀는 다른 사람을 만나고 있다.'" |
| 2 | 원한다 (I want …) | "'I want ___ (나는 ___를 원한다)'라는 생각이 떠오르면 적습니다.<br>만약 잘 떠오르지 않으면, '이 상황이나 사람이 어떻게 바뀌면 완벽해질까?'를 떠올려 보세요. 상황이 완벽하려면 무엇이 필요한가요?<br>여기서는 '신처럼' 완벽을 설계해도 됩니다.<br>예: '무슨 일이 있어도 늘 제시간에 나타나길 원한다', '그녀가 항상 무엇을 하는지 정확히 알고 싶다'.<br>거의 다 채웠을 때, 스스로에게 묻습니다: '내가 진짜 원하는 걸 썼나?' 아니라면 맨 아래에 진짜 원하는 것을 적습니다." |
| 3 | 해야 한다 (should/shouldn't) | "'누구누구는 ~해야 한다 / 하면 안 된다' 형태의 생각을 적습니다.<br>만약 '해야 한다'가 잘 떠오르지 않으면, 이 상황에서 정의감과 질서가 회복되려면 무엇이 필요할지 생각해봅니다. '옳게' 만들기 위해 필요한 모든 should를 적습니다." |
| 4 | 필요하다 (I need …) | "이 상황을 내 편안함과 안전감에 맞추기 위해 필요한 조건들을 적습니다.<br>행복한 삶을 위한 요구조건을 적고, '원래 이래야 한다'는 기준에 맞추기 위해 무엇을 조정해야 하는지 적습니다.<br>예: '나는 그녀가 나를 사랑해주길 필요로 한다', '나는 내 일에서 성공할 필요가 있다.'<br>몇 문장을 쓴 다음에는, 내 모든 필요가 채워지면 결국 내가 '무엇을 갖게 되는지'를 자문해보고, 그 답을 맨 아래에 적는 것도 도움이 됩니다." |
| 5 | 가차없는 평가 (judge) | "사람이나 상황에 대한 **가차없는 평가**를 적습니다. 이 불편한 상황을 통해 그들의 특성이 어떻게 보였는지, 그 성질들을 목록으로 씁니다." |
| 6 | 두 번 다시는 (never again) | "다시는 겪고 싶지 않은 그 상황의 측면을 적습니다.<br>내가 '결코 다시는 살고 싶지 않다'고 맹세하거나 바라게 되는 그 부분을 씁니다." |

> 위 안내문들은 컴포넌트 안 상수로 하드코딩 (i18n 미적용). 두 워크시트 각각의 page metadata는 별도 파일(예: `worksheets.constants.ts`)로 분리 추천.

### 2.7 감정 목록 화면 (`step === 'emotions'`)

The Work Q3/Q4 답변 작성 시 단어가 잘 떠오르지 않을 때 참고하는 **레퍼런스 리스트**. 워크시트가 아니므로 작성/저장 X. 단어 클릭 → 클립보드 복사만.

**구조**: shadcn **Accordion** (`type="multiple"`, 다중 펼침 허용)

```
▶ 분노 (ANGRY)
▶ 우울 (DEPRESSED)
▼ 혼란 (CONFUSED)
   [길을 잃은] [혼란스러운] [방향 감각을 잃은] [어찌할 바를 모르는] ...
▶ 무력 (HELPLESS)
▶ 무관심 (INDIFFERENT)
▶ 두려움 (AFRAID)
▶ 상처 (HURT)
▶ 슬픔 (SAD)
▶ 판단 (JUDGMENTAL)
```

#### 카테고리 (9개, 부정 감정만)

| Key | 한국어 라벨 |
|---|---|
| `angry` | 분노 |
| `depressed` | 우울 |
| `confused` | 혼란 |
| `helpless` | 무력 |
| `indifferent` | 무관심 |
| `afraid` | 두려움 |
| `hurt` | 상처 |
| `sad` | 슬픔 |
| `judgmental` | 판단 |

> 단어 분류는 원본 PDF (Emotions_List_Ltr.pdf) 기준 그대로 유지.
> 한국어 단어 리스트는 사용자가 별도 파일로 제공 예정. 본 plan에는 단어 데이터 포함 X.

#### 단어 표시 — 클릭 = 복사

shadcn **Badge** (또는 `Button variant="ghost" size="sm"`) 스타일로 각 단어를 작은 chip 형태로 표시. 한 카테고리 안에서 `flex flex-wrap gap-2`로 배열.

```tsx
<Badge
  variant="outline"
  className="cursor-pointer hover:bg-accent transition-colors"
  onClick={() => handleCopyWord(word)}
>
  {word}
</Badge>
```

```ts
const handleCopyWord = async (word: string) => {
  await navigator.clipboard.writeText(word);
  toast.success("복사되었습니다");
};
```

#### Sonner Toast 설정

- shadcn 설치: `npx shadcn@latest add sonner`
- `root.tsx`의 `<App>` 또는 `<Layout>` 안에 `<Toaster position="bottom-center" richColors />` 한 번만 마운트
- 컴포넌트에서 `import { toast } from "sonner"` 후 `toast.success("복사되었습니다")`

#### 데이터 파일 분리

감정 단어 리스트는 별도 파일로:

```
app/features/all-users/chats/components/emotions.constants.ts
```

```ts
export interface EmotionCategory {
  key: string;
  label: string;      // 한국어 (예: "분노")
  englishLabel: string; // 원본 (예: "ANGRY") — Accordion 트리거에 부제로 표시
  words: string[];
}

export const EMOTION_CATEGORIES: EmotionCategory[] = [
  { key: 'angry', label: '분노', englishLabel: 'ANGRY', words: [/* 사용자 제공 */] },
  // ...8개 더
];
```

#### 차이점 정리 (작성 화면과 비교)

| | 작성 화면 (fill) | 감정 목록 (emotions) |
|---|---|---|
| step | `'fill'` | `'emotions'` |
| 페이지네이션 | ✅ 6 페이지 | ❌ 없음 (Accordion으로 한 화면) |
| 답변 state | `answers: string[]` 사용 | ❌ 작성 X |
| 저장 버튼 | ✅ 마지막 페이지 | ❌ 없음 |
| 뒤로가기 (선택 화면) | ✅ | ✅ (동일) |

### 2.8 마지막 페이지 — 저장/완료 버튼 (TODO)

- 6번 페이지 하단에 `[저장]` 또는 `[완료]` 버튼 노출.
- **이번 단계에서는 클릭 시 동작 = TODO 주석**. 백엔드 단계에서 다음 동작 연결:
  - `answers` 배열을 JSON 형태로 mutation 호출 (`createWorksheet(client, { sessionId, type, answers })`)
  - 성공 시 박스 닫기 + state 초기화
  - 실패 시 toast 에러

```ts
const handleSaveOrComplete = async () => {
  // TODO(backend): worksheet 저장 mutation 호출
  // const json = { type: worksheetType, answers };
  // await fetcher.submit({ intent: 'save-worksheet', payload: JSON.stringify(json) }, { method: 'post' });
  handleClose(); // 일단 닫기만
};
```

---

## Part 3. 백엔드 연결 시점 메모 (이번 구현 X, 계획만)

`chat_app_plan.md` 진행 시 함께 반영해야 할 사항:

- **새 mutation** `createWorksheet(client, { sessionId, profileId, type, answers })`
- **새 query** `getWorksheetsBySession(client, sessionId)` (퍼실리테이터 "내용 확인하기" 용)
- **새 테이블** `worksheets` (별도 schema 결정):
  - `worksheet_id` uuid PK
  - `session_id` uuid FK → session_rooms
  - `client_id` uuid FK → profiles (작성자)
  - `type` text — `'judge-your-neighbor' | 'when-story-hard'` (감정 목록은 작성 X, 저장 대상 아님)
  - `answers` jsonb — `string[]` 길이 6
  - `created_at` timestamp
- **RLS**: 본인이 작성자이거나 세션 참여 facilitator만 SELECT 가능. INSERT는 본인만 (client_id = auth.uid()).
- **퍼실리테이터 "코파일럿으로 전송"**: 워크시트 JSON을 `/api/ai/generate`의 `refineInstruction`처럼 컨텍스트로 추가하는 형태 — `copilot_implementation_plan.md` 보강 필요.

---

## 사용할 shadcn 컴포넌트

| 컴포넌트     | 용도                                              |
| ------------ | ------------------------------------------------- |
| `Button`     | 토글, 사용, 페이지네이션 화살표, 닫기, 저장       |
| `Card`       | 오버레이 박스 컨테이너                            |
| `Item`       | 선택 화면의 워크시트 카드 3개                     |
| `Textarea`   | 작성 input                                        |
| `Accordion`  | 감정 목록 (9개 카테고리)                          |
| `Badge`      | 감정 목록 단어 chip (클릭 시 복사)                |
| `Sonner` (toast) | 복사 알림 — `root.tsx`에 `<Toaster position="bottom-center" />` |

설치 필요:
```bash
npx shadcn@latest add accordion
npx shadcn@latest add sonner
npx shadcn@latest add badge   # 이미 있을 수도 있음 — 확인 후 설치
```

아이콘: lucide-react `ChevronUpIcon`, `ChevronDownIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `ArrowLeftIcon`.

---

## 작업 순서

1. **Part 1**: AI 코파일럿 패널 접기/펴기 토글 추가 (facilitator 보일 때만)
2. **Part 2.1–2.2**: 토글 버튼 + 오버레이 박스 뼈대 (열고/닫기만)
3. **Part 2.3**: 선택 화면 (shadcn Item 3개 — 워크시트 2 + 감정 목록 1)
4. **Part 2.4–2.5**: 작성 화면 + textarea + 페이지네이션 + state 보존
5. **Part 2.6**: 두 워크시트 안내문 상수 분리 (`worksheets.constants.ts`)
6. **Part 2.7**: 감정 목록 화면 — Accordion + Badge 클릭 복사 + Sonner toast (단어 데이터는 별도 파일 `emotions.constants.ts`로 분리, 사용자 제공)
7. **Part 2.8**: 저장/완료 버튼 자리 + TODO 주석
8. **퍼실리테이터**: 선택 화면에 추가 버튼 자리만 표시 (`사용`/`내용 확인하기`/`코파일럿으로 전송`) — 동작은 백엔드 단계
