import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/common/components/ui/breadcrumb";
import { Link } from "react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import type { AppContext } from "~/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/common/components/ui/tabs";
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
import TimeSlotPicker from "~/features/platform/components/time-slot-picker";
import TimezoneSelector from "~/common/components/timezone-selector";

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
type Day = (typeof DAYS)[number];

type TimeRange = { start: string; end: string };
type DaySchedule = { enabled: boolean; ranges: TimeRange[] };

/** 00:00 ~ 23:00, 1시간 간격 */
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

/** ranges → 1시간 슬롯 배열 ("09:00", "10:00", …) */
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

export default function FacilitatorBookingsPage() {
  const { t } = useTranslation();
  const appContext = useOutletContext<AppContext>();

  const [activeTab, setActiveTab] = useState("upcoming");
  const [weekly, setWeekly] = useState(buildInitialWeekly);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState("Asia/Seoul");

  const [overrideDate, setOverrideDate] = useState<Date | undefined>(undefined);
  const [exceptionSlots, setExceptionSlots] = useState<string[]>([]);
  const [confirmedExceptions, setConfirmedExceptions] = useState<
    Record<string, string[]>
  >({});

  // ── Weekly handlers ──
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

  // ── Override helpers ──
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
    <div className="flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/my/bookings">{t("nav.bookings")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {activeTab === "upcoming" ? "예약 관리" : "상담 시간 설정"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          {t("nav.bookings")}
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 mt-4 grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="upcoming">예약 관리</TabsTrigger>
            <TabsTrigger value="availability">상담 시간 설정</TabsTrigger>
          </TabsList>

          <div className="mb-2">
            <TimezoneSelector
              value={selectedTimezone}
              onChange={setSelectedTimezone}
            />
          </div>

          <TabsContent value="upcoming">
            <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed border-border bg-card">
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <h3 className="mt-4 text-lg font-semibold">
                  진행 예정인 상담이 없습니다
                </h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  새로운 상담 예약이 들어오면 이곳에 표시됩니다.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="availability" className="space-y-10">
            {/* ────── Weekly Schedule (fa-schedule-3 스타일) ────── */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    Set Available Hours (Weekly)
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Define your recurring working hours for each day of the
                    week.
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
                      Save Changes
                    </>
                  ) : (
                    <>
                      <PencilIcon className="size-4" />
                      Edit Schedule
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
                            <span className="text-xs">Add time range</span>
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/60 text-sm italic">
                          Unavailable
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <Separator />

            {/* ────── Date Overrides (Calendar 좌 + TimeSlotPicker 우) ────── */}
            <section className="pb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1">Date Overrides</h2>
                <p className="text-muted-foreground text-sm">
                  Select a date to view available time slots based on your
                  weekly schedule.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Calendar */}
                <div className="bg-card rounded-2xl border p-6 shadow-sm">
                  <Calendar
                    mode="single"
                    selected={overrideDate}
                    onSelect={handleDateSelect}
                    disabled={{ before: new Date() }}
                  />
                </div>

                {/* TimeSlotPicker — 일정 있는 시간대만 표시, 클릭 시 빨갛게 */}
                <div className="bg-card rounded-2xl border p-6 shadow-sm max-h-[500px] overflow-y-auto">
                  {overrideDate ? (
                    <>
                      <h3 className="font-bold mb-2">
                        {formatOverrideDate(overrideDate)}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        Click a time slot to mark it as an exception for this
                        date.
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
                          No available slots — this day is marked as unavailable
                          in your weekly schedule.
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="h-full min-h-[250px] flex items-center justify-center text-center text-muted-foreground">
                      <p className="text-sm">
                        Select a date from the calendar to view its available
                        time slots.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 예외 확정 카드 — exceptionSlots가 있을 때만 표시 */}
              {exceptionSlots.length > 0 && overrideDate && (
                <div className="mt-6 bg-destructive/5 border border-destructive/20 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-destructive/10 p-2 rounded-lg">
                        <CalendarOffIcon className="size-5 text-destructive" />
                      </div>
                      <div>
                        <h4 className="font-bold">
                          {formatOverrideDate(overrideDate)} — Exception
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {exceptionSlots.length} time slot(s) will be blocked
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
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleConfirmExceptions}
                      >
                        <CheckIcon className="size-4 mr-1" />
                        Confirm Exceptions
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

              {/* 확정된 예외 목록 */}
              {Object.keys(confirmedExceptions).length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-bold text-sm text-muted-foreground">
                    Confirmed Exceptions
                  </h4>
                  {Object.entries(confirmedExceptions).map(
                    ([dateKey, slots]) => (
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
                              {slots.length} slot(s) blocked
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() =>
                            handleRemoveConfirmedException(dateKey)
                          }
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </div>
                    ),
                  )}
                </div>
              )}
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
