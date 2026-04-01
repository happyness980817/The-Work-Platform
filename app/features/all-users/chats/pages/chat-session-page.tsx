import { useState } from "react";
import { useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import { ScrollArea } from "~/common/components/ui/scroll-area";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { Badge } from "~/common/components/ui/badge";
import { PlayIcon, SendIcon, StopCircleIcon, TimerIcon } from "lucide-react";
import { MessageBubble } from "../components/messages-bubble";
import { AiSuggestionCard } from "../../../facilitators/ai/components/ai-suggestion-card";
import type { ChatContext } from "../layouts/chat-layout";

const mockClient = {
  name: "Jane Smith",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAr5DPdUsim3L9Kd3llvPH6I8419IVP7m1w2K28cUTt7w4zFdKZnEXScHfN0P-bw6f992O45khAmkw3uKCuIKzVRaDNoA9khVUAGboQKBRJMu-oUi8glutmMNVl0VDeRRkMhzRqOw3QW4-oyziBPA0NbpMoLNRR2R8cUNPcAM-jErc2uJQFIBDEJiTWOwijTlGxvfBwXu7WCrycwKZKGRLV97wvZOU89tYEfXhe2InwTJGfHFsWi4dC4d9Bwr_ToHzzQgsuzGDG0Kk",
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

const mockSuggestion =
  "\"Now let's try some turnarounds. Can you turn the thought 'My boss doesn't respect me' around — to the self, to the other, and to the opposite?\"";

export default function ChatSessionPage() {
  const appContext = useOutletContext<ChatContext>();
  const { t } = useTranslation();
  const [messageInput, setMessageInput] = useState("");
  const [isInSession, setIsInSession] = useState(false);
  const isFacilitator = appContext.role === "facilitator";

  return (
    <div className="flex flex-col overflow-hidden h-11/12">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-card/50 backdrop-blur-md shrink-0">
        <div className="flex flex-row justify-between w-full">
          <div>
            <h2 className="text-xl font-bold">{mockClient.name}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              {t("chat.session", { number: 4 })}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              variant={isInSession ? "destructive" : "outline"}
              onClick={() => setIsInSession((prev) => !prev)}
            >
              {isInSession ? (
                <StopCircleIcon className="size-4" />
              ) : (
                <PlayIcon className="size-4" />
              )}
              {isInSession ? t("chat.end_session") : t("chat.start_session")}
            </Button>
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
                    {t("chat.session_started", { number: 4, time: "10:02 AM" })}
                  </Badge>
                </div>,
              );
            }

            elements.push(
              <MessageBubble
                key={msg.id}
                avatarUrl={
                  isFromMe ? mockFacilitator.avatarUrl : mockClient.avatarUrl
                }
                name={isFromMe ? mockFacilitator.name : mockClient.name}
                message={msg.message}
                isFromMe={isFromMe}
                timestamp={msg.timestamp}
                onGenerateAi={isFacilitator && !isFromMe ? () => {} : undefined}
              />,
            );

            return elements;
          })}
        </div>
      </ScrollArea>

      <div className="shrink-0 bg-background p-4 space-y-3">
        {isFacilitator && (
          <AiSuggestionCard
            suggestion={mockSuggestion}
            onUse={(text) => setMessageInput(text)}
            onRegenerate={() => {}}
            onRefine={() => {}}
          />
        )}
        <div className="flex gap-3 items-center bg-card px-3 py-2.5 my-3 rounded-xl border shadow-sm">
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
            <p className="text-xs text-muted-foreground">
              {t("chat.ai_disclaimer")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
