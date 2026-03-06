import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/common/components/ui/button";
import { Card } from "~/common/components/ui/card";
import { Input } from "~/common/components/ui/input";
import { Textarea } from "~/common/components/ui/textarea";
import { Separator } from "~/common/components/ui/separator";
import {
  RefreshCwIcon,
  SparklesIcon,
  ArrowUpIcon,
  PenLineIcon,
  SquareIcon,
} from "lucide-react";

interface AiSuggestionCardProps {
  suggestion: string;
  onUse?: (text: string) => void;
  onRegenerate?: () => void;
  onStop?: () => void;
  onRefine?: (instruction: string) => void;
}

export function AiSuggestionCard({
  suggestion,
  onUse,
  onRegenerate,
  onStop,
  onRefine,
}: AiSuggestionCardProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(suggestion);
  const [refineText, setRefineText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditedText(suggestion);
    setIsEditing(false);
  }, [suggestion]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length,
      );
    }
  }, [isEditing]);

  const handleRefineSubmit = () => {
    if (refineText.trim()) {
      onRefine?.(refineText.trim());
      setRefineText("");
    }
  };

  return (
    <Card className="overflow-hidden shadow-sm p-0 gap-0">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="text-primary font-bold text-sm flex items-center gap-1">
            <SparklesIcon className="size-4" />
            <span>{t("chat.ai_copilot")}</span>
          </div>
        </div>
        <div className="flex gap-1 items-center">
          <Button
            variant="ghost"
            size="xs"
            onClick={onStop}
            className="text-muted-foreground"
          >
            <SquareIcon className="size-3" />
            {t("chat.stop")}
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={onRegenerate}
            className="text-muted-foreground"
          >
            <RefreshCwIcon className="size-3" />
            {t("chat.regenerate")}
          </Button>
        </div>
      </div>
      <Separator />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {isEditing ? (
            <Textarea
              ref={textareaRef}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="flex-1 min-h-20 text-sm leading-relaxed resize-none"
            />
          ) : (
            <div className="bg-accent/50 rounded-lg p-3 border shadow-sm flex-1">
              <p className="text-sm leading-relaxed italic opacity-90">
                {editedText}
              </p>
            </div>
          )}
          <div className="flex gap-2 shrink-0">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditedText(suggestion);
                    setIsEditing(false);
                  }}
                >
                  {t("chat.cancel")}
                </Button>
                <Button size="sm" onClick={() => setIsEditing(false)}>
                  {t("chat.save")}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  {t("chat.edit")}
                </Button>
                <Button size="sm" onClick={() => onUse?.(editedText)}>
                  {t("chat.use")}
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-accent/30 rounded-md border px-3 py-2 transition-all focus-within:ring-1 focus-within:ring-ring">
            <PenLineIcon className="size-4 text-muted-foreground mr-2 shrink-0" />
            <Input
              className="flex-1 border-0 shadow-none focus-visible:ring-0 bg-transparent h-auto p-0"
              placeholder={t("chat.refine_placeholder")}
              value={refineText}
              onChange={(e) => setRefineText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRefineSubmit();
              }}
            />
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleRefineSubmit}
              className="text-primary ml-1"
            >
              <ArrowUpIcon className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
