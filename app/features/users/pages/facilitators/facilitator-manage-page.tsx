import { DateTime } from "luxon";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "~/common/components/ui/badge";
import { Calendar } from "~/common/components/ui/calendar";
import { Card, CardContent } from "~/common/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/common/components/ui/tabs";
import { SessionInfoCard } from "~/features/users/components/session-info-card";
import { BookingRequestCard } from "~/features/users/components/booking-request-card";

/* ── Mock: calendar events ── */
interface CalendarEvent {
  id: number;
  date: Date;
  time: string;
  clientName: string;
  type: "session" | "intro";
  isLive?: boolean;
}

const today = new Date();

const mockEvents: CalendarEvent[] = [
  {
    id: 1,
    date: new Date(today.getFullYear(), today.getMonth(), 3),
    time: "09:00",
    clientName: "James W.",
    type: "session",
  },
  {
    id: 2,
    date: new Date(today.getFullYear(), today.getMonth(), 5),
    time: "14:30",
    clientName: "Sarah K.",
    type: "session",
    isLive: true,
  },
  {
    id: 3,
    date: new Date(today.getFullYear(), today.getMonth(), 5),
    time: "17:00",
    clientName: "Group Session",
    type: "session",
  },
  {
    id: 4,
    date: new Date(today.getFullYear(), today.getMonth(), 11),
    time: "11:00",
    clientName: "Intro Call",
    type: "intro",
  },
];

/* ── Mock: pending requests ── */
interface PendingRequest {
  id: number;
  clientName: string;
  clientAvatar: string;
  requestedDate: string;
  requestedTime: string;
  duration: string;
  message: string;
  tag: string;
  tagVariant: "default" | "secondary";
}

const mockPendingRequests: PendingRequest[] = [
  {
    id: 1,
    clientName: "Michael Chen",
    clientAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD4Vm8vfDm6QbOdAEItKBElAHASxCYHcpkGrO3OZ9DoNMk7AMSDFxmghjsrR2YhYnLNsKdeBb0EIGta0cTwmTKBGP7hiGW4YSFwFdS3kX91M5oJxwM7w1MmGzPENJnkM7YVB0zIUGFWjWFoXxkqkVAqtTluCOdAMSK5Wc8bBi152unlSYSuvbviUjYC41EYw7i7Z341aAlnNvdQwC6RI33-EPHEPeW-IWIH_81AX_KS0DgAUVLLtXNTrSWmLyhlJ7cF1M4tpFiuG7E",
    requestedDate: "Oct 18, 2023",
    requestedTime: "Wednesday, 09:00 AM",
    duration: "60m",
    message:
      "Looking to start our first deep-dive session after the intake last week. Specifically want to focus on workplace boundaries...",
    tag: "New Client",
    tagVariant: "default",
  },
  {
    id: 2,
    clientName: "Emily Watson",
    clientAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCbeAXVw7hW4xeyh-CcQ39Gwu_c3OYKQ_hy7R0Df9DgTubv2Ge_crbgeIwSiQrCoG_EGGU4E3Bef7FxFnDejOP7OXwgrFuG1isnAMapYIeRUs266G50x-hSu4vuK7unphQhSDItRQ6V5Tm35EBiXR5QG_3M-SlJEY47NQpIgr1LLfWbS5vLEhJaV24V2GFgZLa9PEG-7Ayy7uiOJjNwVyOy-TWllKHxyAvIu1LaWnAwxrx6JnvFbtMnLCrRynPyx1kJDzGma81xFrM",
    requestedDate: "Oct 19, 2023",
    requestedTime: "Thursday, 02:30 PM",
    duration: "45m",
    message:
      "Urgent follow up regarding the negotiation we discussed. Let me know if this slot works.",
    tag: "Returning",
    tagVariant: "secondary",
  },
  {
    id: 3,
    clientName: "Mark Thompson",
    clientAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDGMa8PzsrJnwbHiSTO1xSGvWYjELr7YfYO3ULLDdzMpA8HIVy51CUhwSmOMbBHwNB2PQizZyp4V82AhUcrkwZ-bD5zbkWGLs1IjOj-u32zs2CXwORDiGTG884ScvEXDFkNGr99zGR4BmRNIcFdDpLoa3HehYjjI8voDa6p0AU3TAImg4fmBrzVd3RRPsYCJ4c3KBld-XhMFdlL2gmrcUjS_P5wJirtrYSMhkkwMPOSGxmeSncQhaA2LyuP2hoLG2FuvkdMcAqNCEE",
    requestedDate: "Oct 20, 2023",
    requestedTime: "Friday, 10:00 AM",
    duration: "60m",
    message:
      "I'd like to schedule a follow-up session to discuss progress on the action items we set last time.",
    tag: "Returning",
    tagVariant: "secondary",
  },
];

/* ── helpers ── */
function eventsForDate(date: Date) {
  return mockEvents.filter(
    (e) =>
      e.date.getDate() === date.getDate() &&
      e.date.getMonth() === date.getMonth(),
  );
}

export default function FacilitatorManagePage() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);

  const eventDates = mockEvents.map((e) => e.date);

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
            {t("bookings.pending_requests")}
            <Badge className="text-[10px] px-1.5 py-0">
              {mockPendingRequests.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* ── Schedule Calendar tab ── */}
        <TabsContent value="calendar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
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
                {/* Events for selected date */}
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

            {/* Selected Session Details */}
            <div className="flex flex-col gap-4">
              {selectedDate && eventsForDate(selectedDate).length > 0 ? (
                eventsForDate(selectedDate).map((ev) => (
                  <SessionInfoCard
                    key={ev.id}
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
          </div>
        </TabsContent>

        {/* ── Pending Requests tab ── */}
        <TabsContent value="pending">
          <div className="space-y-4">
            {mockPendingRequests.map((req) => (
              <BookingRequestCard
                key={req.id}
                clientName={req.clientName}
                clientAvatar={req.clientAvatar}
                requestedDate={req.requestedDate}
                requestedTime={req.requestedTime}
                duration={req.duration}
                tag={req.tag}
                tagVariant={req.tagVariant}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
