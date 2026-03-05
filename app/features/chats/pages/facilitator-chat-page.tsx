import { useState } from "react";
import { useOutletContext } from "react-router";
import { ScrollArea } from "~/common/components/ui/scroll-area";
import { PlusCircleIcon, SendIcon, TimerIcon } from "lucide-react";
import { MessageBubble } from "../components/messages-bubble";
import { AiSuggestionCard } from "../components/ai-suggestion-card";
import type { AppContext } from "~/types";

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
    isDm: true,
  },
  {
    id: 2,
    sender: "facilitator" as const,
    message:
      "Hi Jane, thanks for joining. Let's start with the thought you wrote down: \"My boss doesn't respect me.\"",
    timestamp: "10:02 AM",
    isDm: false,
  },
  {
    id: 3,
    sender: "client" as const,
    message:
      "Yes, exactly. He interrupted me three times in the meeting today. It feels like he just doesn't value my input at all.",
    timestamp: "10:04 AM",
    isDm: false,
  },
  {
    id: 4,
    sender: "facilitator" as const,
    message:
      "I hear that it's painful. Let's facilitate The Work on this. Is it true that your boss doesn't respect you?",
    timestamp: "10:05 AM",
    isDm: false,
  },
  {
    id: 5,
    sender: "client" as const,
    message: "It feels true. Why else would he interrupt me?",
    timestamp: "10:07 AM",
    isDm: false,
  },
  {
    id: 6,
    sender: "facilitator" as const,
    message:
      "Can you absolutely know that it's true — that he doesn't respect you?",
    timestamp: "10:08 AM",
    isDm: false,
  },
  {
    id: 7,
    sender: "client" as const,
    message:
      "I guess I can't know for sure... Maybe he was just excited about the project. But it still hurt.",
    timestamp: "10:10 AM",
    isDm: false,
  },
  {
    id: 8,
    sender: "facilitator" as const,
    message:
      "That's a beautiful noticing. How do you react, what happens, when you believe the thought 'My boss doesn't respect me'?",
    timestamp: "10:12 AM",
    isDm: false,
  },
  {
    id: 9,
    sender: "client" as const,
    message:
      "I shut down. I stop contributing in meetings. I feel resentful and I go home and complain to my partner about it. It's exhausting.",
    timestamp: "10:14 AM",
    isDm: false,
  },
  {
    id: 10,
    sender: "facilitator" as const,
    message:
      "Who would you be without the thought 'My boss doesn't respect me'?",
    timestamp: "10:16 AM",
    isDm: false,
  },
  {
    id: 11,
    sender: "client" as const,
    message:
      "I think I'd feel more free. I'd speak up without worrying about how he reacts. I might even enjoy the meetings more.",
    timestamp: "10:18 AM",
    isDm: false,
  },
];

const mockSuggestion =
  "\"Now let's try some turnarounds. Can you turn the thought 'My boss doesn't respect me' around — to the self, to the other, and to the opposite?\"";

export default function FacilitatorChatPage() {
  const appContext = useOutletContext<AppContext>();
  const [messageInput, setMessageInput] = useState("");

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-card/50 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-lg font-bold">{mockClient.name}</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {mockClient.isOnline && (
                <span className="size-2 bg-green-500 rounded-full inline-block" />
              )}
              {mockClient.isOnline ? "Online" : "Offline"} • Session #4
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-6 space-y-6 flex flex-col">
          <div className="flex justify-center">
            <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
              Today, Oct 24
            </span>
          </div>

          {mockMessages.map((msg, index) => {
            const isFromMe = msg.sender === "facilitator";
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
                  <span className="relative text-xs font-bold text-primary bg-background px-4 py-1.5 rounded-full flex items-center gap-2 border border-primary/30">
                    <TimerIcon className="size-3.5" />— Session #4 started at
                    10:02 AM —
                  </span>
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
                isDm={msg.isDm}
              />,
            );

            return elements;
          })}
        </div>
      </ScrollArea>

      <div className="shrink-0 border-t bg-background p-4 space-y-3">
        <AiSuggestionCard
          suggestion={mockSuggestion}
          onUse={(text) => setMessageInput(text)}
          onRegenerate={() => {}}
          onRefine={() => {}}
        />

        <div className="flex gap-3 items-center bg-card px-3 py-2.5 rounded-xl border shadow-sm transition-shadow">
          <button className="text-muted-foreground hover:text-primary transition-colors rounded-full flex items-center justify-center">
            <PlusCircleIcon className="size-5" />
          </button>
          <input
            className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-1 text-sm"
            placeholder="Type a message..."
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && messageInput.trim()) {
                setMessageInput("");
              }
            }}
          />
          <button className="text-primary hover:text-primary/80 transition-colors flex items-center justify-center">
            <SendIcon className="size-5" />
          </button>
        </div>

        <div className="text-center">
          <p className="text-[10px] text-muted-foreground">
            AI assistance is based on The Work methodology. Review before
            sending.
          </p>
        </div>
      </div>
    </div>
  );
}
