import { useTranslation } from "react-i18next";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "~/common/components/ui/card";
import { ClockIcon, DoorOpenIcon, NotebookPenIcon } from "lucide-react";

interface SessionInfoCardProps {
  clientName: string;
  clientAvatar?: string;
  subtitle?: string;
  time: string;
  duration?: string;
  isLive?: boolean;
}

export function SessionInfoCard({
  clientName,
  clientAvatar,
  subtitle,
  time,
  duration,
  isLive,
}: SessionInfoCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="relative overflow-hidden">
      {isLive && (
        <div className="absolute top-4 right-4">
          <Badge className="text-[10px] uppercase tracking-wider">
            {t("bookings.live_now")}
          </Badge>
        </div>
      )}
      <CardHeader>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {t("bookings.selected_session")}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Client info */}
        <div className="flex items-center gap-4">
          <Avatar className="size-14 rounded-xl">
            {clientAvatar && <AvatarImage src={clientAvatar} />}
            <AvatarFallback>{clientName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-bold">{clientName}</h3>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <ClockIcon className="size-4 text-muted-foreground" />
            <div>
              <p className="font-semibold">{time}</p>
              {duration && (
                <p className="text-xs text-muted-foreground">{duration}</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="gap-2">
            <DoorOpenIcon className="size-4" />
            {t("bookings.enter_session")}
          </Button>
          <Button variant="secondary" className="gap-2">
            <NotebookPenIcon className="size-4" />
            {t("bookings.notes")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
