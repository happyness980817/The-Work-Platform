import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { cn } from "~/lib/utils";
import { SparklesIcon } from "lucide-react";
import { Button } from "~/common/components/ui/button";
import { useTranslation } from "react-i18next";

interface MessageBubbleProps {
  avatarUrl?: string;
  name: string;
  message: string;
  isFromMe: boolean;
  timestamp?: string;
  onGenerateAi?: () => void;
}

export function MessageBubble({
  avatarUrl,
  name,
  message,
  isFromMe,
  timestamp,
  onGenerateAi,
}: MessageBubbleProps) {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        isFromMe ? "items-end self-end" : "items-start self-start",
        "max-w-[80%]",
      )}
    >
      <div
        className={cn("flex items-start gap-3", isFromMe && "flex-row-reverse")}
      >
        <Avatar className="size-8 shrink-0 ring-2 ring-background">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div
          className={cn(
            "rounded-2xl px-5 py-3 text-sm leading-relaxed",
            isFromMe
              ? "rounded-tr-sm bg-primary text-primary-foreground shadow-sm"
              : "rounded-tl-sm bg-card text-card-foreground shadow-sm border",
          )}
        >
          <p>{message}</p>
        </div>
      </div>
      <div
        className={cn("flex items-center gap-2", isFromMe ? "mr-12" : "ml-12")}
      >
        {timestamp && (
          <span className="text-[11px] text-muted-foreground">{timestamp}</span>
        )}
        {onGenerateAi && (
          <Button
            variant="ghost"
            onClick={onGenerateAi}
            className="text-[11px] text-muted-foreground hover:text-primary h-auto p-0"
          >
            <SparklesIcon className="size-3" />
            {t("chat.generate_ai")}
          </Button>
        )}
      </div>
    </div>
  );
}
