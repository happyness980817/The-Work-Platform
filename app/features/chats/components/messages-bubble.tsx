import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { cn } from "~/lib/utils";

interface MessageBubbleProps {
  avatarUrl?: string;
  name: string;
  message: string;
  isFromMe: boolean;
  timestamp?: string;
  isDm?: boolean;
}

export function MessageBubble({
  avatarUrl,
  name,
  message,
  isFromMe,
  timestamp,
  isDm,
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        isFromMe ? "items-end self-end" : "items-start self-start",
        "max-w-[80%]",
      )}
    >
      <div
        className={cn("flex items-end gap-3", isFromMe && "flex-row-reverse")}
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
      {timestamp && (
        <span
          className={cn(
            "text-[11px] text-muted-foreground",
            isFromMe ? "mr-12" : "ml-12",
          )}
        >
          {timestamp}
          {isDm && " (DM)"}
        </span>
      )}
    </div>
  );
}
