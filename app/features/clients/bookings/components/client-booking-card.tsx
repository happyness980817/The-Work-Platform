import { useTranslation } from "react-i18next";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import { Card, CardContent } from "~/common/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/common/components/ui/alert-dialog";
import { CalendarIcon } from "lucide-react";

type BookingStatus = "confirmed" | "pending" | "cancelled";

interface ClientBookingCardProps {
  facilitatorName: string;
  facilitatorAvatar?: string;
  requestedDate: string;
  requestedTime: string;
  duration: string;
  status: BookingStatus;
  onCancel?: () => void;
}

const statusConfig: Record<
  BookingStatus,
  { labelKey: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  confirmed: { labelKey: "bookings.status_confirmed", variant: "default" },
  pending:   { labelKey: "bookings.status_pending",   variant: "secondary" },
  cancelled: { labelKey: "bookings.status_cancelled",  variant: "outline" },
};

export function ClientBookingCard({
  facilitatorName,
  facilitatorAvatar,
  requestedDate,
  requestedTime,
  duration,
  status,
  onCancel,
}: ClientBookingCardProps) {
  const { t } = useTranslation();
  const { labelKey, variant } = statusConfig[status];
  const isCancellable = status !== "cancelled";

  return (
    <Card>
      <CardContent className="flex items-center gap-6 p-6">
        <Avatar className="size-12 shrink-0">
          {facilitatorAvatar && <AvatarImage src={facilitatorAvatar} />}
          <AvatarFallback>{facilitatorName.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm">{facilitatorName}</h4>
            <Badge variant={variant} className="text-[10px]">
              {t(labelKey)}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarIcon className="size-3" />
            <span>
              {requestedDate} - {requestedTime} ({duration})
            </span>
          </div>
        </div>

        {isCancellable && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline">
                {t("bookings.cancel_session")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("bookings.cancel_session_title")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t("bookings.cancel_session_description")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("bookings.cancel")}</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={onCancel}>
                  {t("bookings.cancel_session_confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
}
