import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import type { AppContext } from "~/types";
import { Button } from "~/common/components/ui/button";
import { Calendar } from "~/common/components/ui/calendar";
import { Separator } from "~/common/components/ui/separator";
import { Checkbox } from "~/common/components/ui/checkbox";
import {
  NativeSelect,
  NativeSelectOption,
} from "~/common/components/ui/native-select";
import {
  SaveIcon,
  PlusIcon,
  Trash2Icon,
  CalendarOffIcon,
  CheckIcon,
  XIcon,
  PencilIcon,
} from "lucide-react";
import { DateTime } from "luxon";
import { cn } from "~/lib/utils";
import TimeSlotPicker from "~/features/all-users/platform/components/time-slot-picker";
import TimezoneSelector from "~/common/components/timezone-selector";

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
type Day = (typeof DAYS)[number];

type TimeRange = { start: string; end: string };
type DaySchedule = { enabled: boolean; ranges: TimeRange[] };

const HOURS = Array.from(
  { length: 24 },
  (_, i) => `${String(i).padStart(2, "0")}:00`,
);

function buildInitialWeekly(): Record<Day, DaySchedule> {
  const def: TimeRange[] = [{ start: "09:00", end: "17:00" }];
  return {
    mon: { enabled: true, ranges: [...def] },
    tue: { enabled: true, ranges: [...def] },
    wed: { enabled: true, ranges: [...def] },
    thu: { enabled: true, ranges: [...def] },
    fri: { enabled: true, ranges: [...def] },
    sat: { enabled: false, ranges: [] },
    sun: { enabled: false, ranges: [] },
  };
}

function rangesToSlots(ranges: TimeRange[]): string[] {
  const slots: string[] = [];
  for (const r of ranges) {
    const s = parseInt(r.start.split(":")[0], 10);
    const e = parseInt(r.end.split(":")[0], 10);
    for (let h = s; h < e; h++) {
      slots.push(`${String(h).padStart(2, "0")}:00`);
    }
  }
  return slots;
}

function getDayFromDate(date: Date): Day {
  const map: Day[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return map[date.getDay()];
}

export default function AvailabilityPage() {
  const { t } = useTranslation();
  const appContext = useOutletContext<AppContext>();

  const [weekly, setWeekly] = useState(buildInitialWeekly);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState("Asia/Seoul");

  const [overrideDate, setOverrideDate] = useState<Date | undefined>(undefined);
  const [exceptionSlots, setExceptionSlots] = useState<string[]>([]);
  const [confirmedExceptions, setConfirmedExceptions] = useState<
    Record<string, string[]>
  >({});

  const handleToggleDay = (day: Day) => {
    setWeekly((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        ranges: prev[day].enabled ? [] : [{ start: "09:00", end: "17:00" }],
      },
    }));
  };

  const handleAddRange = (day: Day) => {
    setWeekly((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        ranges: [...prev[day].ranges, { start: "09:00", end: "17:00" }],
      },
    }));
  };

  const handleRemoveRange = (day: Day, idx: number) => {
    setWeekly((prev) => {
      const next = [...prev[day].ranges];
      next.splice(idx, 1);
      return {
        ...prev,
        [day]: { ...prev[day], enabled: next.length > 0, ranges: next },
      };
    });
  };

  const handleRangeChange = (
    day: Day,
    idx: number,
    field: "start" | "end",
    value: string,
  ) => {
    setWeekly((prev) => {
      const next = [...prev[day].ranges];
      next[idx] = { ...next[idx], [field]: value };
      return { ...prev, [day]: { ...prev[day], ranges: next } };
    });
  };

  const overrideDay: Day | null = overrideDate
    ? getDayFromDate(overrideDate)
    : null;

  const overrideDateKey = overrideDate
    ? DateTime.fromJSDate(overrideDate).toISODate()
    : null;

  const weeklyDefaultSlots: string[] = overrideDay
    ? rangesToSlots(weekly[overrideDay].ranges)
    : [];

  const handleDateSelect = (date: Date | undefined) => {
    setOverrideDate(date);
    setExceptionSlots([]);
  };

  const handleConfirmExceptions = () => {
    if (!overrideDateKey || exceptionSlots.length === 0) return;
    setConfirmedExceptions((prev) => ({
      ...prev,
      [overrideDateKey]: [
        ...new Set([...(prev[overrideDateKey] ?? []), ...exceptionSlots]),
      ],
    }));
    setExceptionSlots([]);
  };

  const handleRemoveConfirmedException = (dateKey: string) => {
    setConfirmedExceptions((prev) => {
      const next = { ...prev };
      delete next[dateKey];
      return next;
    });
  };

  const formatOverrideDate = (date: Date | undefined) => {
    if (!date) return "";
    return DateTime.fromJSDate(date).toFormat("EEEE, MMM d");
  };

  const formatDateKey = (key: string) => {
    return DateTime.fromISO(key).toFormat("MMM d, yyyy (EEEE)");
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          {t("nav.availability")}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("bookings.availability_description")}
        </p>
      </div>

      <div className="mb-2">
        <TimezoneSelector
          value={selectedTimezone}
          onChange={setSelectedTimezone}
        />
      </div>

      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              {t("bookings.weekly_schedule")}
            </h2>
            <p className="text-muted-foreground text-sm">
              {t("bookings.weekly_schedule_description")}
            </p>
          </div>
          <Button
            variant={isEditing ? "default" : "outline"}
            className="gap-2"
            onClick={() => setIsEditing((v) => !v)}
          >
            {isEditing ? (
              <>
                <SaveIcon className="size-4" />
                {t("bookings.save_changes")}
              </>
            ) : (
              <>
                <PencilIcon className="size-4" />
                {t("bookings.edit_schedule")}
              </>
            )}
          </Button>
        </div>

        <div className="space-y-3">
          {DAYS.map((day) => {
            const sched = weekly[day];
            const on = sched.enabled;

            return (
              <div
                key={day}
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border shadow-sm transition-all",
                  on
                    ? "bg-card border-border hover:border-primary/30"
                    : "bg-muted/30 border-dashed border-border",
                )}
              >
                <div className="flex items-center gap-4 min-w-[140px]">
                  <Checkbox
                    checked={on}
                    onCheckedChange={() => handleToggleDay(day)}
                    id={`day-${day}`}
                    className="h-5 w-5"
                    disabled={!isEditing}
                  />
                  <label
                    htmlFor={`day-${day}`}
                    className={cn(
                      "font-semibold capitalize cursor-pointer",
                      on ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {t(`days.${day}`)}
                  </label>
                </div>

                {on ? (
                  <div className="flex flex-1 flex-col gap-3">
                    {sched.ranges.map((range, ri) => (
                      <div
                        key={ri}
                        className="flex items-center gap-2 max-w-md"
                      >
                        <NativeSelect
                          value={range.start}
                          disabled={!isEditing}
                          onChange={(e) =>
                            handleRangeChange(
                              day,
                              ri,
                              "start",
                              e.currentTarget.value,
                            )
                          }
                        >
                          {HOURS.map((h) => (
                            <NativeSelectOption key={h} value={h}>
                              {h}
                            </NativeSelectOption>
                          ))}
                        </NativeSelect>
                        <span className="text-muted-foreground">—</span>
                        <NativeSelect
                          value={range.end}
                          disabled={!isEditing}
                          onChange={(e) =>
                            handleRangeChange(
                              day,
                              ri,
                              "end",
                              e.currentTarget.value,
                            )
                          }
                        >
                          {HOURS.map((h) => (
                            <NativeSelectOption key={h} value={h}>
                              {h}
                            </NativeSelectOption>
                          ))}
                        </NativeSelect>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-auto text-muted-foreground hover:text-destructive shrink-0"
                          disabled={!isEditing}
                          onClick={() => handleRemoveRange(day, ri)}
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-primary h-8 px-2 w-fit"
                      disabled={!isEditing}
                      onClick={() => handleAddRange(day)}
                    >
                      <PlusIcon className="size-4 mr-1.5" />
                      <span className="text-xs">
                        {t("bookings.add_time_range")}
                      </span>
                    </Button>
                  </div>
                ) : (
                  <span className="text-muted-foreground/60 text-sm italic">
                    {t("bookings.unavailable")}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <Separator />

      <section className="pb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">
            {t("bookings.date_overrides")}
          </h2>
          <p className="text-muted-foreground text-sm">
            {t("bookings.date_overrides_description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="bg-card rounded-2xl border p-6 shadow-sm">
            <Calendar
              mode="single"
              selected={overrideDate}
              onSelect={handleDateSelect}
              disabled={{ before: new Date() }}
            />
          </div>

          <div className="bg-card rounded-2xl border p-6 shadow-sm max-h-[500px] overflow-y-auto">
            {overrideDate ? (
              <>
                <h3 className="font-bold mb-2">
                  {formatOverrideDate(overrideDate)}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {t("bookings.click_slot_exception")}
                </p>
                {weeklyDefaultSlots.length > 0 ? (
                  <TimeSlotPicker
                    type="multiple"
                    slots={weeklyDefaultSlots}
                    selectedSlots={exceptionSlots}
                    onSelectMultiple={setExceptionSlots}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {t("bookings.no_slots_unavailable")}
                  </p>
                )}
              </>
            ) : (
              <div className="h-full min-h-[250px] flex items-center justify-center text-center text-muted-foreground">
                <p className="text-sm">{t("bookings.select_date_to_view")}</p>
              </div>
            )}
          </div>
        </div>

        {exceptionSlots.length > 0 && overrideDate && (
          <div className="mt-6 bg-destructive/5 border border-destructive/20 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-destructive/10 p-2 rounded-lg">
                  <CalendarOffIcon className="size-5 text-destructive" />
                </div>
                <div>
                  <h4 className="font-bold">
                    {formatOverrideDate(overrideDate)} —{" "}
                    {t("bookings.exception")}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {t("bookings.slots_blocked", {
                      count: exceptionSlots.length,
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExceptionSlots([])}
                >
                  <XIcon className="size-4 mr-1" />
                  {t("bookings.cancel")}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleConfirmExceptions}
                >
                  <CheckIcon className="size-4 mr-1" />
                  {t("bookings.confirm_exceptions")}
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {exceptionSlots.sort().map((slot) => {
                const hour = parseInt(slot.split(":")[0], 10);
                const next = `${String(hour + 1).padStart(2, "0")}:00`;
                return (
                  <span
                    key={slot}
                    className="text-xs font-medium bg-destructive/10 text-destructive px-3 py-1.5 rounded-full"
                  >
                    {slot} ~ {next}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {Object.keys(confirmedExceptions).length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="font-bold text-sm text-muted-foreground">
              {t("bookings.confirmed_exceptions")}
            </h4>
            {Object.entries(confirmedExceptions).map(([dateKey, slots]) => (
              <div
                key={dateKey}
                className="flex items-center justify-between bg-card rounded-xl border p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-destructive/10 p-2 rounded-lg">
                    <CalendarOffIcon className="size-4 text-destructive" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {formatDateKey(dateKey)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("bookings.slots_blocked", { count: slots.length })}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemoveConfirmedException(dateKey)}
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
