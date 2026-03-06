import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CalendarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  GlobeIcon,
} from "lucide-react";
import { Calendar } from "~/common/components/ui/calendar";
import { Card } from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "~/common/components/ui/toggle-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { Separator } from "~/common/components/ui/separator";
import { DateTime } from "luxon";

const mockTimeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:30 PM",
  "04:30 PM",
];

const timezones = [
  {
    value: "Asia/Seoul",
    label: "Korea Standard Time (KST)",
    offset: "UTC+9",
  },
  { value: "America/New_York", label: "Eastern Time (ET)", offset: "UTC-5" },
  {
    value: "America/Los_Angeles",
    label: "Pacific Time (PT)",
    offset: "UTC-8",
  },
];

export default function ClFacilitatorPage() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedTimezone, setSelectedTimezone] = useState("Asia/Seoul");

  const formatSelectedDate = (date: Date | undefined) => {
    if (!date) return "";
    return DateTime.fromJSDate(date).toFormat("EEEE, MMM d");
  };

  const formatTimeRange = (time: string) => {
    if (!time) return "";
    const start = DateTime.fromFormat(time, "hh:mm a");

    if (!start.isValid) return time;

    const end = start.plus({ minutes: 55 });
    return `${start.toFormat("hh:mm a")} - ${end.toFormat("hh:mm a")}`;
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold">{t("facilitator.booking.title")}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t("facilitator.booking.subtitle")}
        </p>
      </div>
      <Separator />

      <div className="grow flex flex-col md:flex-row">
        <div className="w-full md:w-auto p-6 flex flex-col items-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={{ before: new Date() }}
          />
        </div>
        <Separator className="md:hidden" />
        <Separator orientation="vertical" className="hidden md:block" />

        <div className="grow p-6 flex flex-col max-h-[500px] overflow-y-auto">
          <h3 className="font-semibold mb-4">
            {selectedDate
              ? formatSelectedDate(selectedDate)
              : t("facilitator.booking.selectDate")}
          </h3>
          <div className="pb-4">
            <p className="text-xs font-medium mb-1.5">
              {t("facilitator.booking.timezone")}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 text-xs font-medium hover:text-primary transition-colors">
                <GlobeIcon className="size-3.5" />
                {timezones.find((tz) => tz.value === selectedTimezone)?.label}
                <ChevronDownIcon className="size-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {timezones.map((tz) => (
                  <DropdownMenuItem
                    key={tz.value}
                    onClick={() => setSelectedTimezone(tz.value)}
                    className="flex items-center justify-between gap-4"
                  >
                    <span>{tz.label}</span>
                    <span className="text-muted-foreground text-xs">
                      {tz.offset}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              {t("facilitator.booking.timezoneHint")}
            </p>
          </div>
          <Separator />
          <ToggleGroup
            type="single"
            value={selectedTime}
            onValueChange={setSelectedTime}
            spacing={1}
            className="mt-4 flex flex-col gap-2.5 w-full"
          >
            {mockTimeSlots.map((slot) => (
              <ToggleGroupItem
                key={slot}
                value={slot}
                className={cn(
                  "w-full justify-between px-4 py-3 rounded-md border h-auto",
                  "data-[state=off]:bg-background data-[state=off]:border-border",
                  "data-[state=off]:hover:border-primary data-[state=off]:hover:ring-1 data-[state=off]:hover:ring-primary",
                  "data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary",
                )}
              >
                <span className="font-medium text-sm">{slot}</span>
                {selectedTime === slot && (
                  <CheckCircleIcon className="size-4 text-primary" />
                )}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      {selectedDate && selectedTime && (
        <>
          <Separator />
          <div className="p-4 bg-muted/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-background p-2 rounded-lg border">
                <CalendarIcon className="size-5 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold">
                  {formatSelectedDate(selectedDate)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTimeRange(selectedTime)}
                </p>
              </div>
            </div>
            <Button className="w-full sm:w-auto gap-2">
              {t("facilitator.booking.request")}
              <ArrowRightIcon className="size-4" />
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
