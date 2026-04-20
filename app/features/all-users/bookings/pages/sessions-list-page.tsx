import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useSearchParams } from "react-router";
import type { AppContext } from "~/types";
import { cn } from "~/lib/utils";
import { CalendarIcon, PlusIcon } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { Button } from "~/common/components/ui/button";
import { Card, CardContent, CardHeader } from "~/common/components/ui/card";
import { SessionCard } from "~/features/all-users/bookings/components/sessions-list-item-card";

/* ── Mock data ── */
interface Session {
  id: number;
  sessionNumber: number;
  startDate: string;
  lastMessage: string;
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
      {
        id: 1,
        sessionNumber: 12,
        startDate: "October 24, 2023",
        lastMessage: "Hello, how are you?",
      },
      {
        id: 2,
        sessionNumber: 11,
        startDate: "October 10, 2023",
        lastMessage: "I'm fine, thank you.",
      },
    ],
  },
  {
    id: 2,
    name: "Marcus Reed",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAdhmS4pFo5JWAlDWTwRPdYMWq74TIqxFSRCjz_Ugj8LxB_uYag2Z9scERiBT90Ufk31UyQ-2w9aZixpAEMH1srOT2boFIU5aoIKWBmawDrdjba3PVUgbVz7jTxTYfSZQ5DlkOhABj93TbJ9wKfbw-84Ya9M3SwHdoyzJ3PLmRpTOU75or6L3VMP-I-Ecb91LTZe_bVKvuN9N_VjgazgK2WfgQJeaZ_GTE9OKWgwWRDPnzqP_fnjN3s31s71B17JAo43N6mrL_byxk",
    sessions: [
      {
        id: 3,
        sessionNumber: 8,
        startDate: "November 02, 2023",
        lastMessage: "Hello, how are you?",
      },
    ],
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuChWE6qgrfvkCNfdS_ku_EQXbXtPTrM4gOdz2bKRfL9chs5B-gWQlK63mBZkIJNwu8Yb-Rkn7J3tYrhUcmqe54G_wbJI1pL7UgkGq02H0LbPH4GcUks6XiT-xjRg2PHA2rLuIwB6r_DIqYdavYoN2PG3yJp9BKBe0P6sjoDxonoyhnIrpvYqSXgW-G52XGdI0gklwRcKDdDVOsKeZHADA_3Vp8L4NebsuRakvuGy_XK-r5eTP4n-lM0oDCwHA12T5wQMDYEW4mLlig",
    sessions: [
      {
        id: 4,
        sessionNumber: 15,
        startDate: "October 30, 2023",
        lastMessage: "Thank you for the session.",
      },
      {
        id: 5,
        sessionNumber: 14,
        startDate: "October 16, 2023",
        lastMessage: "See you next time!",
      },
    ],
  },
];

export default function SessionsListPage() {
  const { t } = useTranslation();
  const { role } = useOutletContext<AppContext>();
  const isFacilitator = role === "facilitator";
  const [clients, setClients] = useState(mockClients);
  const hasClients = clients.length > 0;

  const handleDeleteSession = (clientId: number, sessionId: number) => {
    setClients((prev) =>
      prev
        .map((c) =>
          c.id === clientId
            ? { ...c, sessions: c.sessions.filter((s) => s.id !== sessionId) }
            : c
        )
        .filter((c) => c.sessions.length > 0)
    );
  };

  const [searchParams] = useSearchParams();
  const targetClientId = searchParams.get("clientId");
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!targetClientId) return;
    const id = Number(targetClientId);
    const el = cardRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [targetClientId]);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("bookings.sessions_list")}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t("bookings.sessions_description")}
        </p>
      </div>

      {hasClients ? (
        <div className="flex flex-col gap-6">
          {clients.map((client) => (
            <Card
              key={client.id}
              ref={(el) => {
                cardRefs.current[client.id] = el;
              }}
              className={cn(
                "transition-all duration-500",
                targetClientId &&
                  Number(targetClientId) === client.id &&
                  "ring-2 ring-primary ring-offset-2",
              )}
            >
              {/* Client header */}
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="size-12">
                    <AvatarImage src={client.avatar} />
                    <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-bold leading-tight">
                      {client.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm text-muted-foreground">
                        {t("bookings.session_count", {
                          count: client.sessions.length,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                {isFacilitator && (
                  <Button size="sm" className="gap-2 shrink-0">
                    <PlusIcon className="size-4" />
                    {t("bookings.new_session")}
                  </Button>
                )}
              </CardHeader>

              {/* Session list */}
              <CardContent className="pt-0 pb-4">
                <div className="flex flex-col gap-0">
                  {client.sessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      sessionNumber={session.sessionNumber}
                      startDate={session.startDate}
                      lastMessage={session.lastMessage}
                      onDelete={() => handleDeleteSession(client.id, session.id)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
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
