import { useTranslation } from "react-i18next";
import { Button } from "~/common/components/ui/button";

interface SessionCardProps {
  sessionNumber: number;
  date: string;
}

export function SessionCard({ sessionNumber, date }: SessionCardProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4 px-5 py-3 rounded-lg justify-between border border-transparent hover:border-border bg-muted/30 hover:bg-muted/50 transition-all">
      <div className="flex flex-col justify-center">
        <p className="text-sm font-semibold">
          {t("bookings.session_number", { number: sessionNumber })}
        </p>
        <p className="text-xs text-muted-foreground font-medium">{date}</p>
      </div>
      <Button size="sm" variant="secondary">
        {t("bookings.enter_session")}
      </Button>
    </div>
  );
}
