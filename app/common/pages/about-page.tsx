import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import ReactMarkdown from "react-markdown";
import type { AppContext } from "~/types";
import { Button } from "~/common/components/ui/button";
import { SaveIcon, PencilIcon } from "lucide-react";

const MDEditor = lazy(() => import("@uiw/react-md-editor"));

const DEFAULT_CONTENT: Record<string, string> = {
  en: `# About Us

Welcome to **The Work Platform** — a space dedicated to peace of mind through inquiry.

## Our Mission

We connect individuals with experienced facilitators who guide them through *The Work* of Byron Katie — a simple yet profound method of self-inquiry that helps identify and question stressful thoughts.

## How It Works

1. **Book a session** with a certified facilitator
2. **Explore your thoughts** through guided inquiry
3. **Find clarity** and a new perspective

## Our Facilitators

Our facilitators are trained and certified practitioners who are passionate about helping others find freedom from painful thoughts.

> "The Work is not about positive thinking. It's about true thinking." — Byron Katie

---

Have questions? [Contact us](#) or explore our [facilitator directory](/facilitators).
`,
  ko: `# 서비스 소개

**The Work Platform**에 오신 것을 환영합니다 — 탐구를 통해 마음의 평화를 찾는 공간입니다.

## 우리의 미션

저희는 Byron Katie의 *The Work* — 스트레스를 유발하는 생각을 찾아내고 질문하는 간단하면서도 심오한 자기탐구 방법 — 을 안내하는 경험 있는 퍼실리테이터와 개인을 연결합니다.

## 이용 방법

1. 인증된 퍼실리테이터와 **세션 예약**
2. 안내된 탐구를 통해 **자신의 생각 탐색**
3. **명료함**과 새로운 관점 발견

## 우리의 퍼실리테이터

저희 퍼실리테이터는 훈련되고 인증된 전문가로, 다른 사람들이 고통스러운 생각에서 자유로워질 수 있도록 돕는 일에 열정을 가지고 있습니다.

> "The Work은 긍정적 사고에 관한 것이 아닙니다. 진실한 사고에 관한 것입니다." — Byron Katie

---

궁금한 점이 있으신가요? [문의하기](#) 또는 [퍼실리테이터 목록](/facilitators)을 확인하세요.
`,
};

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const { isAdmin } = useOutletContext<AppContext>();

  const lang = i18n.language.startsWith("ko") ? "ko" : "en";

  const [contents, setContents] = useState<Record<string, string>>(DEFAULT_CONTENT);
  const [saved, setSaved] = useState<Record<string, string>>(DEFAULT_CONTENT);
  const [isEditing, setIsEditing] = useState(false);

  const content = contents[lang] ?? "";
  const savedContent = saved[lang] ?? "";
  const isDirty = content !== savedContent;

  function handleSave() {
    setSaved({ ...contents });
    setIsEditing(false);
  }

  function handleDiscard() {
    setContents({ ...saved });
    setIsEditing(false);
  }

  return (
    <div
      className={`flex flex-col w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-4 ${isEditing ? "max-w-7xl" : "max-w-4xl"}`}
    >
      {/* Admin toolbar — only visible to admin */}
      {isAdmin && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-dashed px-4 py-2">
          <p className="text-muted-foreground text-sm">
            {t("about.admin_hint")}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            {isEditing ? (
              <>
                <Button variant="ghost" size="sm" onClick={handleDiscard}>
                  {t("about.discard")}
                </Button>
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={handleSave}
                  disabled={!isDirty}
                >
                  <SaveIcon className="size-4" />
                  {t("about.save")}
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => setIsEditing(true)}
              >
                <PencilIcon className="size-4" />
                {t("about.edit")}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Editor or Viewer */}
      {isAdmin && isEditing ? (
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[600px] rounded-lg border bg-card">
              <p className="text-muted-foreground text-sm">Loading editor...</p>
            </div>
          }
        >
          <div data-color-mode="auto">
            <MDEditor
              value={content}
              onChange={(val) => setContents((prev) => ({ ...prev, [lang]: val ?? "" }))}
              height={600}
              preview="live"
            />
          </div>
        </Suspense>
      ) : (
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <ReactMarkdown>{savedContent}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
