import { useState } from "react";
import { Outlet, useLocation, useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import { ScrollArea } from "~/common/components/ui/scroll-area";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { Badge } from "~/common/components/ui/badge";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "~/common/components/ui/toggle-group";
import { SendIcon, StopCircleIcon, TimerIcon } from "lucide-react";
import { MessageRoomsCard } from "../components/message-rooms-card";
import { MessageBubble } from "../components/messages-bubble";
import type { AppContext } from "~/types";

export interface ChatContext extends AppContext {
  setMessageInput: (text: string) => void;
}

const mockRooms = [
  {
    id: 1,
    name: "Jane Smith",
    subtitle: "Session #4",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAr5DPdUsim3L9Kd3llvPH6I8419IVP7m1w2K28cUTt7w4zFdKZnEXScHfN0P-bw6f992O45khAmkw3uKCuIKzVRaDNoA9khVUAGboQKBRJMu-oUi8glutmMNVl0VDeRRkMhzRqOw3QW4-oyziBPA0NbpMoLNRR2R8cUNPcAM-jErc2uJQFIBDEJiTWOwijTlGxvfBwXu7WCrycwKZKGRLV97wvZOU89tYEfXhe2InwTJGfHFsWi4dC4d9Bwr_ToHzzQgsuzGDG0Kk",
    status: "online" as const,
    isSessionActive: true,
    badge: "chat.active",
  },
  {
    id: 2,
    name: "Michael Brown",
    subtitle: "Session #12",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCwj7VhOVv0ogQu1v9Op6Ozzi1KKDhKNiVxSgvafTAOYkXwG_R7CaWa1iDObfv1plX6sgbdsazipCWXXoBsn9WMIPwQEOrV7vdORzvd8LLv-rOjS4VJlZlfZj-PENOiaLAbiGSu9IWjq0FP5jx3-WrlSesH_YMmMmAzKLQDTuSvdaCRZyWHIW1peFwLovI7wYOGQG9M1jYXqso3-gC-ekbhgkckDtOGW3QQdKYPg7UZ2UeGtWgWfV7aHajuzyfHfj3iaa8Q0LlS7_Q",
    status: "offline" as const,
    isSessionActive: false,
    badge: "2:00 PM",
  },
  {
    id: 3,
    name: "Sarah Wilson",
    subtitle: "Session #3",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDwHBxU-0QC9ee-C4NLQHTAuxEXt4LDepI3zFdpOxdeWyCY7RVnkQ0ZFmjm9D6tlXcW2ITHEH3B7QF0svK8-JDHijjA7SkiqzZwxA3-_1RvwM3v6aWoDxJnJYjplauF56h4XEuFWXDa6Xwmd6jmvFVQ4U6at5pgvtZx8dK2zf7wLu8XAF1efmrLya-fhicloj8XClHQ5XPEfV9AB8bRYNt30bF0qLMLUjukuNY7ripDZkk6heng5oHWZUApYZfmInRRBqstSdDVxaE",
    status: "offline" as const,
    isSessionActive: false,
    badge: "Oct 23",
  },
  {
    id: 4,
    name: "Emily Davis",
    subtitle: "Session #8",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBBxCezaT1dvFo82Vbg4k_skl8xk0Q8crY7oUFlyHImMaJFbX_IGOUS_Af_iXtEV4Qc3AjAaLAz3RzijCKOVMlUBq8rygp0S8s1GqizGk7KHz7YHa1oO-QtyQY_RSHGBA-qCyakvZliHqQdBGr3m3KdpyCspQMDUSP0HcrTc8AfW7HtAUaASsZ0rSw3Lo8pQIgaO7pNdgfnSLhBmIoBxPx15mmlAQmilTFAPx318IWeRJ1JmmGDmTYov-7jvnQ3mS-Q-FsjUHPYSBw",
    status: "offline" as const,
    isSessionActive: false,
    badge: "Oct 21",
  },
];

const mockClient = {
  name: "Jane Smith",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAr5DPdUsim3L9Kd3llvPH6I8419IVP7m1w2K28cUTt7w4zFdKZnEXScHfN0P-bw6f992O45khAmkw3uKCuIKzVRaDNoA9khVUAGboQKBRJMu-oUi8glutmMNVl0VDeRRkMhzRqOw3QW4-oyziBPA0NbpMoLNRR2R8cUNPcAM-jErc2uJQFIBDEJiTWOwijTlGxvfBwXu7WCrycwKZKGRLV97wvZOU89tYEfXhe2InwTJGfHFsWi4dC4d9Bwr_ToHzzQgsuzGDG0Kk",
  isOnline: true,
};

const mockFacilitator = {
  name: "Dr. Kim",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuApIXo2M07eNooMxaZaqr8DxlROgbILy4pAaj0iwcrpS8gfsOHQQM2GWEzh9DcoTPSfcf7mcJplvsztWDGjEtTeq7bn5hQR6adzT-LKPcF5m_ZbSTaRO7xqSn9uUZGH4YNUaAB5wEtt3BTBrsOPwg25YPy9SVObbnOSxVbqGEBE0b9uEsXtDI2NgKbAKYZUbPJBiPiDRTdFdpn14HluRoaStZcMX8wKfDFQ9vV-2kGnyXxy1OakR0Tgfd80bc6vcQuSazrdRGZhfvQ",
};

const mockMessages = [
  {
    id: 1,
    sender: "client" as const,
    message: "I'm here, ready to start whenever you are.",
    timestamp: "10:00 AM",
  },
  {
    id: 2,
    sender: "facilitator" as const,
    message:
      "Hi Jane, thanks for joining. Let's start with the thought you wrote down: \"My boss doesn't respect me.\"",
    timestamp: "10:02 AM",
  },
  {
    id: 3,
    sender: "client" as const,
    message:
      "Yes, exactly. He interrupted me three times in the meeting today. It feels like he just doesn't value my input at all.",
    timestamp: "10:04 AM",
  },
  {
    id: 4,
    sender: "facilitator" as const,
    message:
      "I hear that it's painful. Let's facilitate The Work on this. Is it true that your boss doesn't respect you?",
    timestamp: "10:05 AM",
  },
  {
    id: 5,
    sender: "client" as const,
    message: "It feels true. Why else would he interrupt me?",
    timestamp: "10:07 AM",
  },
  {
    id: 6,
    sender: "facilitator" as const,
    message:
      "Can you absolutely know that it's true — that he doesn't respect you?",
    timestamp: "10:08 AM",
  },
  {
    id: 7,
    sender: "client" as const,
    message:
      "I guess I can't know for sure... Maybe he was just excited about the project. But it still hurt.",
    timestamp: "10:10 AM",
  },
  {
    id: 8,
    sender: "facilitator" as const,
    message:
      "That's a beautiful noticing. How do you react, what happens, when you believe the thought 'My boss doesn't respect me'?",
    timestamp: "10:12 AM",
  },
  {
    id: 9,
    sender: "client" as const,
    message:
      "I shut down. I stop contributing in meetings. I feel resentful and I go home and complain to my partner about it. It's exhausting.",
    timestamp: "10:14 AM",
  },
  {
    id: 10,
    sender: "facilitator" as const,
    message:
      "Who would you be without the thought 'My boss doesn't respect me'?",
    timestamp: "10:16 AM",
  },
  {
    id: 11,
    sender: "client" as const,
    message:
      "I think I'd feel more free. I'd speak up without worrying about how he reacts. I might even enjoy the meetings more.",
    timestamp: "10:18 AM",
  },
];

export default function ChatLayout() {
  const appContext = useOutletContext<AppContext>();
  const { t } = useTranslation();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"dms" | "sessions">("sessions");
  const [messageInput, setMessageInput] = useState("");
  const isFacilitator = appContext.role === "facilitator";
  const hasActiveSession = mockRooms.some((r) => r.isSessionActive);
  const isDefault = location.pathname === "/chats";

  const chatContext: ChatContext = {
    ...appContext,
    setMessageInput,
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <aside className="w-80 flex flex-col border-r bg-card shrink-0">
        <div className="p-4 flex flex-col gap-4">
          <h2 className="text-base font-bold">{t("chat.unified_inbox")}</h2>
          <ToggleGroup
            type="single"
            value={activeTab}
            onValueChange={(value) => {
              if (value) setActiveTab(value as "dms" | "sessions");
            }}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <ToggleGroupItem value="dms" className="flex-1">
              {t("chat.dms")}
            </ToggleGroupItem>
            <ToggleGroupItem value="sessions" className="flex-1">
              {t("chat.sessions")}
            </ToggleGroupItem>
          </ToggleGroup>
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
                status={room.status}
                isSessionActive={room.isSessionActive}
                badge={
                  room.isSessionActive && room.badge
                    ? t(room.badge)
                    : room.badge
                }
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
        {isDefault ? (
          <Outlet context={chatContext} />
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b bg-card/50 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold">{mockClient.name}</h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    {mockClient.isOnline && (
                      <span className="size-2 bg-green-500 rounded-full inline-block" />
                    )}
                    {mockClient.isOnline ? t("chat.online") : t("chat.offline")}{" "}
                    • {t("chat.session", { number: 4 })}
                  </p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 min-h-0">
              <div className="p-6 space-y-6 flex flex-col">
                <div className="flex justify-center">
                  <Badge variant="secondary" className="text-muted-foreground">
                    {t("chat.date_today")}, Oct 24
                  </Badge>
                </div>

                {mockMessages.map((msg, index) => {
                  const isFromMe = msg.sender === appContext.role;
                  const elements = [];

                  if (index === 1) {
                    elements.push(
                      <div
                        key={`session-start-${msg.id}`}
                        className="flex justify-center my-4 relative"
                      >
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-primary/20" />
                        </div>
                        <Badge
                          variant="outline"
                          className="relative bg-background text-primary border-primary/20"
                        >
                          <TimerIcon className="size-3.5" />
                          {t("chat.session_started", {
                            number: 4,
                            time: "10:02 AM",
                          })}
                        </Badge>
                      </div>,
                    );
                  }

                  elements.push(
                    <MessageBubble
                      key={msg.id}
                      avatarUrl={
                        isFromMe
                          ? mockFacilitator.avatarUrl
                          : mockClient.avatarUrl
                      }
                      name={isFromMe ? mockFacilitator.name : mockClient.name}
                      message={msg.message}
                      isFromMe={isFromMe}
                      timestamp={msg.timestamp}
                      onGenerateAi={
                        isFacilitator && !isFromMe ? () => {} : undefined
                      }
                    />,
                  );

                  return elements;
                })}
              </div>
            </ScrollArea>

            <div className="shrink-0 bg-background p-4 space-y-3">
              <Outlet context={chatContext} />
              <div className="flex gap-3 items-center bg-card px-3 py-2.5 rounded-xl border shadow-sm">
                <Input
                  className="ml-2 flex-1 border-0 shadow-none focus-visible:ring-0 bg-transparent h-auto p-0"
                  placeholder={t("chat.type_message")}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && messageInput.trim()) {
                      setMessageInput("");
                    }
                  }}
                />
                <Button variant="ghost" size="icon-sm" className="text-primary">
                  <SendIcon className="size-5" />
                </Button>
              </div>
              {isFacilitator && (
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground">
                    {t("chat.ai_disclaimer")}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
