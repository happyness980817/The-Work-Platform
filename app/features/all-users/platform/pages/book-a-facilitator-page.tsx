import { useState, useCallback } from "react";
import { Link, useNavigate, useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import {
  EyeIcon,
  CalendarIcon,
  ArrowRightIcon,
  UserIcon,
  MessageCircleIcon,
  CheckCircleIcon,
} from "lucide-react";
import { DateTime } from "luxon";
import type { Route } from "./+types/book-a-facilitator-page";
import type { AppContext } from "~/types";
import FacilitatorProfileCard from "~/features/all-users/platform/components/facilitator-profile-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/common/components/ui/breadcrumb";
import { Card, CardContent } from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { Calendar } from "~/common/components/ui/calendar";
import { Separator } from "~/common/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/common/components/ui/alert-dialog";
import TimeSlotPicker from "~/features/all-users/platform/components/time-slot-picker";
import TimezoneSelector from "~/common/components/timezone-selector";
import { facilitators } from "~/features/all-users/data/facilitators";

const MOCK_AVAILABLE_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:30 PM",
  "04:30 PM",
];

export default function FacilitatorBookingPage({
  params,
}: Route.ComponentProps) {
  const { t } = useTranslation();
  const { role, isLoggedIn } = useOutletContext<AppContext>();
  const navigate = useNavigate();
  const facilitatorId = Number(params.facilitatorId);
  const facilitator =
    facilitators.find((item) => item.id === facilitatorId) ?? facilitators[0];

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedTimezone, setSelectedTimezone] = useState("Asia/Seoul");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmedOpen, setConfirmedOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const handleTimeSelect = useCallback((slot: string) => {
    setSelectedTime(slot);
  }, []);

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
    <div className="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/facilitators">{t("facilitators.title")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{facilitator.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3">
          <FacilitatorProfileCard
            name={facilitator.name}
            imageUrl={facilitator.imageUrl}
            introduction={facilitator.introduction}
            languages={facilitator.languages}
          />
          <Button variant="default" className="w-full mt-3 gap-2" asChild>
            <Link to={`/facilitators/profile/${facilitator.id}`}>
              <UserIcon className="size-4" />
              {t("profile.view_profile")}
            </Link>
          </Button>
          {isLoggedIn ? (
            <Button variant="secondary" className="w-full mt-3 gap-2" asChild>
              <Link to="/chat">
                <MessageCircleIcon className="size-4" />
                {t("profile.contact_facilitator")}
              </Link>
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="w-full mt-3 gap-2"
              onClick={() => setLoginOpen(true)}
            >
              <MessageCircleIcon className="size-4" />
              {t("profile.contact_facilitator")}
            </Button>
          )}
        </div>

        <div className="lg:col-span-9">
          {role === "client" ? (
            <div className="flex flex-col gap-6">
              <Card className="overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold">
                    {t("facilitator.booking.title")}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("facilitator.booking.subtitle")}
                  </p>
                </div>
                <Separator />
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {/* Calendar */}
                  <div className="lg:col-span-4 p-6 flex flex-col items-center border-b lg:border-b-0 lg:border-r">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={{ before: new Date() }}
                    />
                    {/* Timezone selector */}
                    <div className="mt-4 w-full">
                      <TimezoneSelector
                        value={selectedTimezone}
                        onChange={setSelectedTimezone}
                      />
                    </div>
                  </div>
                  {/* Time Slots */}
                  <div className="lg:col-span-8 p-6 flex flex-col max-h-[500px] overflow-y-auto">
                    <h3 className="font-semibold mb-4">
                      {selectedDate
                        ? formatSelectedDate(selectedDate)
                        : t("facilitator.booking.selectDate")}
                    </h3>
                    <TimeSlotPicker
                      slots={MOCK_AVAILABLE_SLOTS}
                      selectedSlot={selectedTime}
                      onSelect={handleTimeSelect}
                    />
                  </div>
                </div>

                {/* Booking footer */}
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
                      <Button
                        className="w-full sm:w-auto gap-2"
                        onClick={() => {
                          if (!isLoggedIn) {
                            setLoginOpen(true);
                          } else {
                            setConfirmOpen(true);
                          }
                        }}
                      >
                        {t("facilitator.booking.request")}
                        <ArrowRightIcon className="size-4" />
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            </div>
          ) : (
            <Card className="h-full flex flex-col">
              <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <div className="bg-muted rounded-full p-4">
                  <EyeIcon className="size-8 text-muted-foreground" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h2 className="text-lg font-semibold">
                    {t("facilitator.preview.title")}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("facilitator.preview.description")}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Booking Confirm Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("facilitator.booking.confirm_title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("facilitator.booking.confirm_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedDate && selectedTime && (
            <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
              <CalendarIcon className="size-5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-semibold">
                  {formatSelectedDate(selectedDate)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTimeRange(selectedTime)} · {facilitator.name}
                </p>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmOpen(false);
                setConfirmedOpen(true);
              }}
            >
              {t("facilitator.booking.confirm_button")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Booking Confirmed Dialog */}
      <AlertDialog open={confirmedOpen} onOpenChange={setConfirmedOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="size-5 text-primary" />
              <AlertDialogTitle>
                {t("facilitator.booking.confirmed_title")}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              {t("facilitator.booking.confirmed_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.close")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => navigate("/my/bookings/sessions")}
            >
              {t("facilitator.booking.go_sessions")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Login Required Dialog */}
      <AlertDialog open={loginOpen} onOpenChange={setLoginOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("auth.login_required")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("auth.login_required_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/auth/login")}>
              {t("auth.go_login")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
