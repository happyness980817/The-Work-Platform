import { useTranslation } from "react-i18next";
import { CalendarIcon, PlusIcon } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import { Card, CardContent } from "~/common/components/ui/card";
import { SessionCard } from "~/features/users/components/session-card";

/* ── Mock data ── */
interface Session {
  id: number;
  sessionNumber: number;
  date: string;
}

interface Client {
  id: number;
  name: string;
  avatar: string;
  sessions: Session[];
}

const mockClients: Client[] = [
  {
    id: 1,
    name: "Sarah Jenkins",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCe-Z-GSYoUFcFxWJXE4rOsFj2hUh0-WDZnmzA7FgGzGGG8X8mFUCRGAS0KUjljB1f4_zOS148H4R5tCYKeAV0dxPnWIlcA5Cn3_LPaX8s2x8T32b1YwADVlJDoj4Ltx9PoApSCYBmxQz2huLe24mgnx5ca6r4S7YD3QtBbT2QUpxty62bXO0EYKdLlYgnbZMw9hUdFzbTTtxTyPQYojAgDtbFi62TSutFzIhH2wTs43FmFTQYD-L8J8ESbCIj7DGKnjBUBQqONvEA",
    sessions: [
      { id: 1, sessionNumber: 12, date: "October 24, 2023" },
      { id: 2, sessionNumber: 11, date: "October 10, 2023" },
    ],
  },
  {
    id: 2,
    name: "Marcus Reed",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAdhmS4pFo5JWAlDWTwRPdYMWq74TIqxFSRCjz_Ugj8LxB_uYag2Z9scERiBT90Ufk31UyQ-2w9aZixpAEMH1srOT2boFIU5aoIKWBmawDrdjba3PVUgbVz7jTxTYfSZQ5DlkOhABj93TbJ9wKfbw-84Ya9M3SwHdoyzJ3PLmRpTOU75or6L3VMP-I-Ecb91LTZe_bVKvuN9N_VjgazgK2WfgQJeaZ_GTE9OKWgwWRDPnzqP_fnjN3s31s71B17JAo43N6mrL_byxk",
    sessions: [{ id: 3, sessionNumber: 8, date: "November 02, 2023" }],
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuChWE6qgrfvkCNfdS_ku_EQXbXtPTrM4gOdz2bKRfL9chs5B-gWQlK63mBZkIJNwu8Yb-Rkn7J3tYrhUcmqe54G_wbJI1pL7UgkGq02H0LbPH4GcUks6XiT-xjRg2PHA2rLuIwB6r_DIqYdavYoN2PG3yJp9BKBe0P6sjoDxonoyhnIrpvYqSXgW-G52XGdI0gklwRcKDdDVOsKeZHADA_3Vp8L4NebsuRakvuGy_XK-r5eTP4n-lM0oDCwHA12T5wQMDYEW4mLlig",
    sessions: [
      { id: 4, sessionNumber: 15, date: "October 30, 2023" },
      { id: 5, sessionNumber: 14, date: "October 16, 2023" },
    ],
  },
];

export default function FacilitatorSessionsPage() {
  const { t } = useTranslation();

  const hasClients = mockClients.length > 0;

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          {t("nav.sessions")}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("bookings.sessions_description")}
        </p>
      </div>

      {hasClients ? (
        <div className="flex flex-col gap-8">
          {mockClients.map((client) => (
            <div key={client.id} className="flex flex-col gap-1">
              {/* Client header card */}
              <Card>
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-12">
                      <AvatarImage src={client.avatar} />
                      <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-lg font-bold leading-tight">
                        {client.name}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="gap-2 shrink-0">
                    <PlusIcon className="size-4" />
                    {t("bookings.new_session")}
                  </Button>
                </CardContent>
              </Card>

              {/* Nested session list */}
              <div className="ml-4 md:ml-8 border-l-2 border-border pl-4 flex flex-col gap-1">
                {client.sessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    sessionNumber={session.sessionNumber}
                    date={session.date}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed border-border bg-card">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center size-16 rounded-full bg-muted mb-4">
              <CalendarIcon className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">
              {t("bookings.no_active_sessions")}
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
