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
  FlagIcon,
} from "lucide-react";
import { Button } from "~/common/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "~/common/components/ui/context-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/common/components/ui/alert-dialog";
import { Textarea } from "~/common/components/ui/textarea";

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
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const translatedMessage = `[${t("chat.translated")}] ${message}`;

  const handleReport = () => {
    // TODO: 실제 신고 API 연동
    setReportOpen(false);
    setReportReason("");
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={cn(
              "flex flex-col gap-1",
              isFromMe ? "items-end self-end" : "items-start self-start",
              "max-w-[80%]",
            )}
          >
            <div
              className={cn(
                "flex items-start gap-3",
                isFromMe && "flex-row-reverse",
              )}
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
              className={cn(
                "flex items-center gap-2",
                isFromMe ? "mr-12" : "ml-12",
              )}
            >
              {isLiked && (
                <span className="flex items-center gap-0.5 text-primary">
                  <ThumbsUpIcon className="size-3 fill-primary" />
                </span>
              )}
              {timestamp && (
                <span className="text-[12px] text-muted-foreground">
                  {timestamp}
                </span>
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
        </ContextMenuTrigger>

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
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => setReportOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <FlagIcon className="size-4 mr-2" />
            {t("chat.context.report")}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <AlertDialog open={reportOpen} onOpenChange={setReportOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("chat.report.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("chat.report.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder={t("chat.report.placeholder")}
              className="min-h-[100px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {t("chat.report.notice")}
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("chat.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReport}
              disabled={reportReason.trim().length === 0}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("chat.context.report")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
