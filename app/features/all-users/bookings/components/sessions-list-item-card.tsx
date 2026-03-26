import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";

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
      <Button
        variant="secondary"
        className="group w-full h-auto p-0 my-1"
        asChild
      >
        <Link
          to={`/facilitator/chats/sessions/${sessionNumber}`}
          className="flex flex-col items-start w-full px-5 py-1"
        >
          <div className="flex flex-col w-full justify-between">
            <div className="flex items-center py-1 w-full justify-between">
              <span className="text-base font-semibold text-foreground group-hover:underline">
                {t("bookings.session_number", { number: sessionNumber })}
              </span>
              <span className="text-xs text-muted-foreground font-normal">
                {startDate}
              </span>
            </div>
            {lastMessage && (
              <span className="text-sm text-muted-foreground font-normal mt-1 text-left w-full truncate">
                {lastMessage}
              </span>
            )}
          </div>
        </Link>
      </Button>
    </div>
  );
}
