import { useTranslation } from "react-i18next";
import { CalendarIcon } from "lucide-react";
import { ClientBookingCard } from "~/features/users/components/client-booking-card";

type BookingStatus = "confirmed" | "pending" | "cancelled";

interface Booking {
  id: number;
  facilitatorName: string;
  facilitatorAvatar: string;
  requestedDate: string;
  requestedTime: string;
  duration: string;
  status: BookingStatus;
}

const mockBookings: Booking[] = [
  {
    id: 1,
    facilitatorName: "Sarah Jenkins",
    facilitatorAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCe-Z-GSYoUFcFxWJXE4rOsFj2hUh0-WDZnmzA7FgGzGGG8X8mFUCRGAS0KUjljB1f4_zOS148H4R5tCYKeAV0dxPnWIlcA5Cn3_LPaX8s2x8T32b1YwADVlJDoj4Ltx9PoApSCYBmxQz2huLe24mgnx5ca6r4S7YD3QtBbT2QUpxty62bXO0EYKdLlYgnbZMw9hUdFzbTTtxTyPQYojAgDtbFi62TSutFzIhH2wTs43FmFTQYD-L8J8ESbCIj7DGKnjBUBQqONvEA",
    requestedDate: "Oct 28, 2023",
    requestedTime: "Wednesday, 02:00 PM",
    duration: "60m",
    status: "confirmed",
  },
  {
    id: 2,
    facilitatorName: "Marcus Reed",
    facilitatorAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAdhmS4pFo5JWAlDWTwRPdYMWq74TIqxFSRCjz_Ugj8LxB_uYag2Z9scERiBT90Ufk31UyQ-2w9aZixpAEMH1srOT2boFIU5aoIKWBmawDrdjba3PVUgbVz7jTxTYfSZQ5DlkOhABj93TbJ9wKfbw-84Ya9M3SwHdoyzJ3PLmRpTOU75or6L3VMP-I-Ecb91LTZe_bVKvuN9N_VjgazgK2WfgQJeaZ_GTE9OKWgwWRDPnzqP_fnjN3s31s71B17JAo43N6mrL_byxk",
    requestedDate: "Nov 02, 2023",
    requestedTime: "Thursday, 10:00 AM",
    duration: "45m",
    status: "pending",
  },
  {
    id: 3,
    facilitatorName: "Elena Rodriguez",
    facilitatorAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuChWE6qgrfvkCNfdS_ku_EQXbXtPTrM4gOdz2bKRfL9chs5B-gWQlK63mBZkIJNwu8Yb-Rkn7J3tYrhUcmqe54G_wbJI1pL7UgkGq02H0LbPH4GcUks6XiT-xjRg2PHA2rLuIwB6r_DIqYdavYoN2PG3yJp9BKBe0P6sjoDxonoyhnIrpvYqSXgW-G52XGdI0gklwRcKDdDVOsKeZHADA_3Vp8L4NebsuRakvuGy_XK-r5eTP4n-lM0oDCwHA12T5wQMDYEW4mLlig",
    requestedDate: "Oct 20, 2023",
    requestedTime: "Friday, 03:30 PM",
    duration: "60m",
    status: "cancelled",
  },
];

export default function ClientBookingsPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("nav.manage_bookings")}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t("bookings.my_bookings_description")}
        </p>
      </div>

      {mockBookings.length > 0 ? (
        <div className="space-y-4">
          {mockBookings.map((booking) => (
            <ClientBookingCard
              key={booking.id}
              facilitatorName={booking.facilitatorName}
              facilitatorAvatar={booking.facilitatorAvatar}
              requestedDate={booking.requestedDate}
              requestedTime={booking.requestedTime}
              duration={booking.duration}
              status={booking.status}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed border-border bg-card">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center size-16 rounded-full bg-muted mb-4">
              <CalendarIcon className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">
              {t("bookings.no_sessions")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("bookings.no_active_sessions_description")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
