import { useTranslation } from "react-i18next";
import { CalendarCheckIcon } from "lucide-react";

export default function FacilitatorManagePage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          {t("nav.manage_bookings")}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("bookings.manage_description")}
        </p>
      </div>

      <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed border-border bg-card">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center size-16 rounded-full bg-muted mb-4">
            <CalendarCheckIcon className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">{t("bookings.no_upcoming")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("bookings.no_upcoming_description")}
          </p>
        </div>
      </div>
    </div>
  );
}
