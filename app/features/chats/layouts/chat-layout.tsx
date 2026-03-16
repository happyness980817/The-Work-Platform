import { useState } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import { ScrollArea } from "~/common/components/ui/scroll-area";
import { Button } from "~/common/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "~/common/components/ui/tabs";
import { StopCircleIcon } from "lucide-react";
import { MessageRoomsCard } from "../components/message-rooms-card";
import type { AppContext } from "~/types";

export type ChatContext = AppContext;

const mockRooms = [
  {
    id: 1,
    name: "Jane Smith",
    subtitle: "Session #4",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAr5DPdUsim3L9Kd3llvPH6I8419IVP7m1w2K28cUTt7w4zFdKZnEXScHfN0P-bw6f992O45khAmkw3uKCuIKzVRaDNoA9khVUAGboQKBRJMu-oUi8glutmMNVl0VDeRRkMhzRqOw3QW4-oyziBPA0NbpMoLNRR2R8cUNPcAM-jErc2uJQFIBDEJiTWOwijTlGxvfBwXu7WCrycwKZKGRLV97wvZOU89tYEfXhe2InwTJGfHFsWi4dC4d9Bwr_ToHzzQgsuzGDG0Kk",
    isSessionActive: true,
    badge: "chat.active",
  },
  {
    id: 2,
    name: "Michael Brown",
    subtitle: "Session #12",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCwj7VhOVv0ogQu1v9Op6Ozzi1KKDhKNiVxSgvafTAOYkXwG_R7CaWa1iDObfv1plX6sgbdsazipCWXXoBsn9WMIPwQEOrV7vdORzvd8LLv-rOjS4VJlZlfZj-PENOiaLAbiGSu9IWjq0FP5jx3-WrlSesH_YMmMmAzKLQDTuSvdaCRZyWHIW1peFwLovI7wYOGQG9M1jYXqso3-gC-ekbhgkckDtOGW3QQdKYPg7UZ2UeGtWgWfV7aHajuzyfHfj3iaa8Q0LlS7_Q",
    isSessionActive: false,
    badge: "2:00 PM",
  },
  {
    id: 3,
    name: "Sarah Wilson",
    subtitle: "Session #3",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDwHBxU-0QC9ee-C4NLQHTAuxEXt4LDepI3zFdpOxdeWyCY7RVnkQ0ZFmjm9D6tlXcW2ITHEH3B7QF0svK8-JDHijjA7SkiqzZwxA3-_1RvwM3v6aWoDxJnJYjplauF56h4XEuFWXDa6Xwmd6jmvFVQ4U6at5pgvtZx8dK2zf7wLu8XAF1efmrLya-fhicloj8XClHQ5XPEfV9AB8bRYNt30bF0qLMLUjukuNY7ripDZkk6heng5oHWZUApYZfmInRRBqstSdDVxaE",
    isSessionActive: false,
    badge: "Oct 23",
  },
  {
    id: 4,
    name: "Emily Davis",
    subtitle: "Session #8",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBBxCezaT1dvFo82Vbg4k_skl8xk0Q8crY7oUFlyHImMaJFbX_IGOUS_Af_iXtEV4Qc3AjAaLAz3RzijCKOVMlUBq8rygp0S8s1GqizGk7KHz7YHa1oO-QtyQY_RSHGBA-qCyakvZliHqQdBGr3m3KdpyCspQMDUSP0HcrTc8AfW7HtAUaASsZ0rSw3Lo8pQIgaO7pNdgfnSLhBmIoBxPx15mmlAQmilTFAPx318IWeRJ1JmmGDmTYov-7jvnQ3mS-Q-FsjUHPYSBw",
    isSessionActive: false,
    badge: "Oct 21",
  },
];


export default function ChatLayout() {
  const appContext = useOutletContext<AppContext>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"dms" | "sessions">("sessions");
  const isFacilitator = appContext.role === "facilitator";
  const hasActiveSession = mockRooms.some((r) => r.isSessionActive);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <aside className="w-80 flex flex-col border-r bg-card shrink-0">
        <div className="p-4 flex flex-col gap-4">
          <h2 className="text-base font-bold">{t("chat.unified_inbox")}</h2>
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              if (value) {
                setActiveTab(value as "dms" | "sessions");
                navigate("/chats");
              }
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dms">{t("chat.dms")}</TabsTrigger>
              <TabsTrigger value="sessions">{t("chat.sessions")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1">
            {mockRooms.map((room) => (
              <MessageRoomsCard
                key={room.id}
                id={room.id}
                name={room.name}
                subtitle={room.subtitle}
                avatarUrl={room.avatarUrl}
                isSessionActive={room.isSessionActive}
                badge={
                  room.isSessionActive && room.badge
                    ? t(room.badge)
                    : room.badge
                }
                type={activeTab === "dms" ? "dm" : "session"}
              />
            ))}
          </div>
        </ScrollArea>
        {isFacilitator && hasActiveSession && (
          <div className="p-4 border-t shrink-0 mt-auto">
            <Button variant="outline" className="w-full text-primary">
              <StopCircleIcon className="size-5 mr-2" />
              {t("chat.end_session")}
            </Button>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <Outlet context={appContext} />
      </div>
    </div>
  );
}
