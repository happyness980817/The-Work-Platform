import { useState, useRef, useEffect } from "react";
import { Button } from "~/common/components/ui/button";
import { Card } from "~/common/components/ui/card";
import { Textarea } from "~/common/components/ui/textarea";
import { Separator } from "~/common/components/ui/separator";
import {
  RefreshCwIcon,
  SparklesIcon,
  ArrowUpIcon,
  PenLineIcon,
} from "lucide-react";

interface AiSuggestionCardProps {
  suggestion: string;
  onUse?: (text: string) => void;
  onRegenerate?: () => void;
  onRefine?: (instruction: string) => void;
}

export function AiSuggestionCard({
  suggestion,
  onUse,
  onRegenerate,
  onRefine,
}: AiSuggestionCardProps) {
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
    <Card className="overflow-hidden shadow-sm py-0 gap-0">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="text-primary font-bold text-sm flex items-center gap-1">
            <SparklesIcon className="size-4" />
            <span>AI COPILOT</span>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={onRegenerate}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-xs"
            title="Regenerate"
          >
            <RefreshCwIcon className="size-3.5" />
            <span>Regenerate</span>
          </button>
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
                  Cancel
                </Button>
                <Button size="sm" onClick={() => setIsEditing(false)}>
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
                <Button size="sm" onClick={() => onUse?.(editedText)}>
                  Use
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-accent/30 rounded-md border px-3 py-2 transition-all focus-within:ring-1 focus-within:ring-ring">
            <PenLineIcon className="size-4 text-muted-foreground mr-2 shrink-0" />
            <input
              className="w-full bg-transparent border-none p-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
              placeholder="Refine suggestion (e.g., 'Make it more empathetic')"
              type="text"
              value={refineText}
              onChange={(e) => setRefineText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRefineSubmit();
              }}
            />
            <button
              onClick={handleRefineSubmit}
              className="text-primary hover:text-primary/80 p-0.5 ml-1 rounded"
            >
              <ArrowUpIcon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
