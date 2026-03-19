import { useTranslation } from "react-i18next";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import { Card, CardContent } from "~/common/components/ui/card";
import { CalendarIcon } from "lucide-react";

interface BookingRequestCardProps {
  clientName: string;
  clientAvatar?: string;
  requestedDate: string;
  requestedTime: string;
  duration: string;
  tag?: string;
  tagVariant?: "default" | "secondary";
  onAccept?: () => void;
  onDecline?: () => void;
}

export function BookingRequestCard({
  clientName,
  clientAvatar,
  requestedDate,
  requestedTime,
  duration,
  tag,
  tagVariant = "default",
  onAccept,
  onDecline,
}: BookingRequestCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="flex items-center gap-6 p-6">
        <Avatar className="size-12 shrink-0">
          {clientAvatar && <AvatarImage src={clientAvatar} />}
          <AvatarFallback>{clientName.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm">{clientName}</h4>
            {tag && (
              <Badge variant={tagVariant} className="text-[10px]">
                {tag}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarIcon className="size-3" />
            <span>
              {requestedDate} - {requestedTime} ({duration})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" onClick={onAccept}>
            {t("bookings.accept")}
          </Button>
          <Button size="sm" variant="outline" onClick={onDecline}>
            {t("bookings.decline")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
