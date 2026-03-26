import { useMemo } from "react";
import { DateTime } from "luxon";
import { GlobeIcon, ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

const TIMEZONE_IANA = [
  "Asia/Seoul",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
] as const;

function formatOffset(zone: string): string {
  const dt = DateTime.now().setZone(zone);
  return dt.toFormat("'UTC'ZZ"); // e.g. "UTC+09:00"
}

function formatLabel(zone: string): string {
  const dt = DateTime.now().setZone(zone);
  return `${zone.replace(/_/g, " ")} (${dt.offsetNameShort})`;
}

interface TimezoneSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TimezoneSelector({
  value,
  onChange,
}: TimezoneSelectorProps) {
  const { t } = useTranslation();

  const timezones = useMemo(
    () =>
      TIMEZONE_IANA.map((zone) => ({
        value: zone,
        label: formatLabel(zone),
        offset: formatOffset(zone),
      })),
    [],
  );

  const selectedTz = timezones.find((tz) => tz.value === value);

  return (
    <div className="flex flex-col">
      <p className="text-sm font-medium mb-2">
        {t("facilitator.booking.timezone")}
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium transition-colors">
          <GlobeIcon className="size-3.5" />
          {selectedTz?.label || t("facilitator.booking.select_timezone")}
          <ChevronDownIcon className="size-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto">
          {timezones.map((tz) => (
            <DropdownMenuItem
              key={tz.value}
              onClick={() => onChange(tz.value)}
              className="flex items-center justify-between gap-4 cursor-pointer"
            >
              <span>{tz.label}</span>
              <span className="text-muted-foreground text-xs">{tz.offset}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
