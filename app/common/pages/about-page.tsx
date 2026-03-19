import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import ReactMarkdown from "react-markdown";
import type { AppContext } from "~/types";
import { Button } from "~/common/components/ui/button";
import { SaveIcon, PencilIcon } from "lucide-react";

const MDEditor = lazy(() => import("@uiw/react-md-editor"));

const DEFAULT_CONTENT = `# About Us

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
`;

export default function AboutPage() {
  const { t } = useTranslation();
  const { isAdmin } = useOutletContext<AppContext>();

  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [saved, setSaved] = useState(DEFAULT_CONTENT);
  const [isEditing, setIsEditing] = useState(false);

  const isDirty = content !== saved;

  function handleSave() {
    setSaved(content);
    setIsEditing(false);
  }

  function handleDiscard() {
    setContent(saved);
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
              onChange={(val) => setContent(val ?? "")}
              height={600}
              preview="live"
            />
          </div>
        </Suspense>
      ) : (
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <ReactMarkdown>{saved}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
