import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/common/components/ui/breadcrumb";
import { Link } from "react-router";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import type { AppContext } from "~/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/common/components/ui/tabs";
import { Card, CardContent } from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { Calendar } from "~/common/components/ui/calendar";
import { Separator } from "~/common/components/ui/separator";
import { SaveIcon } from "lucide-react";
import { DateTime } from "luxon";
import SelectTimeCard from "~/features/platform/components/select-time-card";
import TimeSlotPicker from "~/features/platform/components/time-slot-picker";

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
type Day = (typeof DAYS)[number];

const DEFAULT_AVAILABLE = new Set([
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
]);

function buildInitialWeekly(): Record<Day, Set<string>> {
  return Object.fromEntries(
    DAYS.map((d) => [d, new Set(DEFAULT_AVAILABLE)]),
  ) as Record<Day, Set<string>>;
}

export default function FacilitatorBookingsPage() {
  const { t } = useTranslation();
  const appContext = useOutletContext<AppContext>();

  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedDay, setSelectedDay] = useState<Day>("mon");
  const [weekly, setWeekly] = useState(buildInitialWeekly);

  const [overrideDate, setOverrideDate] = useState<Date | undefined>(undefined);
  const [overrides, setOverrides] = useState<Record<string, Set<string>>>({});

  const toggleWeeklySlot = useCallback(
    (slot: string) => {
      setWeekly((prev) => {
        const next = { ...prev };
        const daySet = new Set(next[selectedDay]);
        if (daySet.has(slot)) {
          daySet.delete(slot);
        } else {
          daySet.add(slot);
        }
        next[selectedDay] = daySet;
        return next;
      });
    },
    [selectedDay],
  );

  const overrideDateKey = overrideDate
    ? DateTime.fromJSDate(overrideDate).toISODate()
    : null;

  const overrideSlots = overrideDateKey
    ? (overrides[overrideDateKey] ?? weekly[selectedDay])
    : new Set<string>();

  const toggleOverrideSlot = useCallback(
    (slot: string) => {
      if (!overrideDateKey) return;
      setOverrides((prev) => {
        const current = prev[overrideDateKey]
          ? new Set(prev[overrideDateKey])
          : new Set(weekly[selectedDay]);
        if (current.has(slot)) {
          current.delete(slot);
        } else {
          current.add(slot);
        }
        return { ...prev, [overrideDateKey]: current };
      });
    },
    [overrideDateKey, weekly, selectedDay],
  );

  const formatOverrideDate = (date: Date | undefined) => {
    if (!date) return "";
    return DateTime.fromJSDate(date).toFormat("MMM d, yyyy");
  };

  const availableCount = weekly[selectedDay].size;

  return (
    <div className="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
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
          <TabsList className="mb-6 mt-4 grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="upcoming">예약 관리</TabsTrigger>
            <TabsTrigger value="availability">상담 시간 설정</TabsTrigger>
          </TabsList>

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

          <TabsContent value="availability">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Weekly Routine */}
              <Card className="lg:col-span-8 overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center bg-muted/30">
                  <div>
                    <h3 className="font-bold text-lg">Weekly Routine</h3>
                    <p className="text-xs text-muted-foreground">
                      Set your general hours for each day
                    </p>
                  </div>
                  <Button size="sm" className="gap-2">
                    <SaveIcon className="size-4" />
                    Save Changes
                  </Button>
                </div>
                <CardContent className="p-6">
                  <Tabs
                    value={selectedDay}
                    onValueChange={(v) => setSelectedDay(v as Day)}
                    className="w-full"
                  >
                    <TabsList className="w-full mb-8">
                      {DAYS.map((day) => (
                        <TabsTrigger
                          key={day}
                          value={day}
                          className="flex-1 capitalize"
                        >
                          {t(`days.${day}`)}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {DAYS.map((day) => (
                      <TabsContent key={day} value={day}>
                        <SelectTimeCard
                          availableSlots={weekly[day]}
                          onToggle={toggleWeeklySlot}
                        />
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>

              {/* Calendar Overrides */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-1">Calendar Overrides</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Select a date to customize its hours
                  </p>
                  <Calendar
                    mode="single"
                    selected={overrideDate}
                    onSelect={setOverrideDate}
                    disabled={{ before: new Date() }}
                    className="w-full"
                  />
                </Card>

                {overrideDate && (
                  <Card className="overflow-hidden">
                    <div className="p-5 border-b flex items-center justify-between">
                      <h4 className="font-bold">Selected Override</h4>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-bold">
                        {formatOverrideDate(overrideDate)}
                      </span>
                    </div>
                    <CardContent className="p-5 max-h-[400px] overflow-y-auto">
                      <TimeSlotPicker
                        slots={Array.from(overrideSlots).sort()}
                        selectedSlot=""
                        onSelect={() => {}}
                      />
                      {overrideSlots.size === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No available slots for this date
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
