import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { cn } from "~/lib/utils";
import {
  SparklesIcon,
  LanguagesIcon,
  FileTextIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { Button } from "~/common/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/common/components/ui/context-menu";

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
  const [isLiked, setIsLiked] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);

  const translatedMessage = `[${t("chat.translated")}] ${message}`;

  const bubbleContent = (
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
              ? "rounded-tr-none bg-primary text-primary-foreground shadow-sm"
              : "rounded-tl-none bg-card text-card-foreground shadow-sm border",
          )}
        >
          <p>{isTranslated ? translatedMessage : message}</p>
        </div>
      </div>
      <div
        className={cn("flex items-center gap-2", isFromMe ? "mr-12" : "ml-12")}
      >
        {isLiked && (
          <span className="flex items-center gap-0.5 text-primary">
            <ThumbsUpIcon className="size-3 fill-primary" />
          </span>
        )}
        {timestamp && (
          <span className="text-[12px] text-muted-foreground">{timestamp}</span>
        )}
        {onGenerateAi && (
          <Button
            variant="ghost"
            onClick={onGenerateAi}
            className="text-[12px] font-semibold text-muted-foreground hover:text-primary h-auto p-0"
          >
            <SparklesIcon className="size-3" />
            {t("chat.generate_ai")}
          </Button>
        )}
      </div>
    </div>
  );

  if (isFromMe) {
    return bubbleContent;
  }

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{bubbleContent}</ContextMenuTrigger>

        <ContextMenuContent className="w-48">
          {!isTranslated ? (
            <ContextMenuItem onClick={() => setIsTranslated(true)}>
              <LanguagesIcon className="size-4 mr-2" />
              {t("chat.context.translate")}
            </ContextMenuItem>
          ) : (
            <ContextMenuItem onClick={() => setIsTranslated(false)}>
              <FileTextIcon className="size-4 mr-2" />
              {t("chat.context.original")}
            </ContextMenuItem>
          )}
          <ContextMenuItem onClick={() => setIsLiked((prev) => !prev)}>
            <ThumbsUpIcon
              className={cn(
                "size-4 mr-2",
                isLiked && "fill-primary text-primary",
              )}
            />
            {isLiked ? t("chat.context.unlike") : t("chat.context.like")}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
}
