import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";

interface SessionCardProps {
  sessionNumber: number;
  startDate: string;
}

export function SessionCard({ sessionNumber, startDate }: SessionCardProps) {
  const { t } = useTranslation();

  return (
    <Button
      variant="ghost"
      className="w-full h-auto px-5 py-2 flex flex-col items-start gap-0"
      asChild
    >
      <Link to={`/facilitator/chats/sessions/1`}>
        <span className="font-semibold text-lg">
          {t("bookings.session_number", { number: sessionNumber })}
        </span>
        <span className="text-sm text-muted-foreground no-underline">
          {startDate}
        </span>
      </Link>
    </Button>
  );
}
