// import { DateTime } from "luxon";
// import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import type { AppContext } from "~/types";
// import { Badge } from "~/common/components/ui/badge";
// import { Calendar } from "~/common/components/ui/calendar";
// import { Card, CardContent } from "~/common/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/common/components/ui/tabs";
// import { SessionInfoCard } from "~/features/all-users/bookings/components/bookings-session-card";

/* ── Mock: calendar events ── */
// interface CalendarEvent {
//   id: number;
//   clientId?: number;
//   date: Date;
//   time: string;
//   clientName: string;
//   type: "session" | "intro";
//   isLive?: boolean;
// }

// const today = new Date();

// const mockEvents: CalendarEvent[] = [
//   {
//     id: 1,
//     clientId: 2,
//     date: new Date(today.getFullYear(), today.getMonth(), 3),
//     time: "09:00",
//     clientName: "James W.",
//     type: "session",
//   },
//   {
//     id: 2,
//     clientId: 1,
//     date: new Date(today.getFullYear(), today.getMonth(), 5),
//     time: "14:30",
//     clientName: "Sarah K.",
//     type: "session",
//     isLive: true,
//   },
//   {
//     id: 3,
//     clientId: 3,
//     date: new Date(today.getFullYear(), today.getMonth(), 5),
//     time: "17:00",
//     clientName: "Group Session",
//     type: "session",
//   },
//   {
//     id: 4,
//     date: new Date(today.getFullYear(), today.getMonth(), 11),
//     time: "11:00",
//     clientName: "Intro Call",
//     type: "intro",
//   },
// ];

// /* ── helpers ── */
// function eventsForDate(date: Date) {
//   return mockEvents.filter(
//     (e) =>
//       e.date.getDate() === date.getDate() &&
//       e.date.getMonth() === date.getMonth(),
//   );
// }

export default function ManageBookingsPage() {
  const { t } = useTranslation();
  const { role } = useOutletContext<AppContext>();
  const isClient = role === "client";
  // const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);

  // const eventDates = mockEvents.map((e) => e.date);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("nav.manage_bookings")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t("bookings.manage_description")}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="calendar" className="flex flex-col gap-6">
        <TabsList className="w-fit">
          <TabsTrigger value="calendar">
            {t("bookings.schedule_calendar")}
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            {isClient
              ? t("nav.manage_bookings")
              : t("bookings.pending_requests")}
          </TabsTrigger>
        </TabsList>

        {/* ── Schedule Calendar tab ── */}
        <TabsContent value="calendar">
          <p className="text-muted-foreground text-center py-16">
            구현 예정입니다
          </p>
          {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  modifiers={{ event: eventDates }}
                  modifiersClassNames={{
                    event:
                      "bg-primary/10 text-primary font-bold border border-primary/20",
                  }}
                  className="w-full"
                />
                {selectedDate && eventsForDate(selectedDate).length > 0 && (
                  <div className="mt-6 space-y-2 border-t pt-4">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                      {DateTime.fromJSDate(selectedDate).toFormat("MMM d")}
                    </p>
                    {eventsForDate(selectedDate).map((ev) => (
                      <div
                        key={ev.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border"
                      >
                        <div className="text-xs font-bold text-primary w-12">
                          {ev.time}
                        </div>
                        <div className="flex-1 text-sm font-medium">
                          {ev.clientName}
                        </div>
                        {ev.isLive && (
                          <Badge className="text-[10px]">
                            {t("bookings.live_now")}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              {selectedDate && eventsForDate(selectedDate).length > 0 ? (
                eventsForDate(selectedDate).map((ev) => (
                  <SessionInfoCard
                    key={ev.id}
                    clientId={ev.clientId}
                    clientName={ev.clientName}
                    time={ev.time}
                    isLive={ev.isLive}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {t("bookings.no_sessions")}
                </p>
              )}
            </div>
          </div> */}
        </TabsContent>

        {/* ── Pending Requests / Client Bookings tab ── */}
        <TabsContent value="pending">
          <p className="text-muted-foreground text-center py-16">
            구현 예정입니다
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
