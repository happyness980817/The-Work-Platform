import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import { Separator } from "~/common/components/ui/separator";

interface SessionCardProps {
  sessionNumber: number;
  startDate: string;
  lastMessage: string;
}

export function SessionCard({
  sessionNumber,
  startDate,
  lastMessage,
}: SessionCardProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <div className="w-full h-auto px-5 py-2 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-md font-semibold">
              {t("bookings.session_number", { number: sessionNumber })}
            </span>
            <span className="text-sm text-muted-foreground">{startDate}</span>
          </div>
          {lastMessage && (
            <span className="text-sm text-muted-foreground">{lastMessage}</span>
          )}
        </div>
        <Button variant="link" size="sm" asChild>
          <Link to={`/facilitator/chats/sessions/1`}>
            {t("bookings.enter_session")} &rarr;
          </Link>
        </Button>
      </div>
      <Separator />
    </div>
  );
}
