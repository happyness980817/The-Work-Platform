import { GlobeIcon, ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

const TIMEZONES = [
  { value: "Asia/Seoul", label: "Korea Standard Time (KST)", offset: "UTC+9" },
  { value: "America/New_York", label: "Eastern Time (ET)", offset: "UTC-5" },
  {
    value: "America/Los_Angeles",
    label: "Pacific Time (PT)",
    offset: "UTC-8",
  },
];

interface TimezoneSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TimezoneSelector({
  value,
  onChange,
}: TimezoneSelectorProps) {
  const selectedTz = TIMEZONES.find((tz) => tz.value === value);
  const { t } = useTranslation();
  return (
    <div className="flex flex-col">
      <p className="text-sm font-medium mb-2">
        {t("facilitator.booking.timezone")}
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium transition-colors">
          <GlobeIcon className="size-3.5" />
          {selectedTz?.label || "Select Timezone"}
          <ChevronDownIcon className="size-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {TIMEZONES.map((tz) => (
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
