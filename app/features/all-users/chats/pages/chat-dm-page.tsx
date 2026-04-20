import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import { ScrollArea } from "~/common/components/ui/scroll-area";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { Badge } from "~/common/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
import { EllipsisVertical, LogOutIcon, PlayIcon, SendIcon } from "lucide-react";
import { MessageBubble } from "../components/messages-bubble";
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
    message: "Hi, I wanted to check in before our next session.",
    timestamp: "2:00 PM",
  },
  {
    id: 2,
    sender: "facilitator" as const,
    message: "Of course! How have you been since our last session?",
    timestamp: "2:01 PM",
  },
  {
    id: 3,
    sender: "client" as const,
    message: "A bit better actually. I've been practicing what we discussed.",
    timestamp: "2:03 PM",
  },
];

export default function ChatDmPage() {
  const appContext = useOutletContext<ChatContext>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [messageInput, setMessageInput] = useState("");
  const [leaveOpen, setLeaveOpen] = useState(false);
  const isFacilitator = appContext.role === "facilitator";

  return (
    <div className="flex flex-col h-11/12 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-card/50 backdrop-blur-md shrink-0">
        <h2 className="text-lg font-bold">{mockClient.name}</h2>
        {isFacilitator && (
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <EllipsisVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/chats/sessions/1")}
                >
                  <PlayIcon className="size-4 mr-2" />
                  {t("chat.start_session")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => setLeaveOpen(true)}
                >
                  <LogOutIcon className="size-4 mr-2" />
                  채팅방 나가기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-6 space-y-6 flex flex-col">
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-muted-foreground">
              {t("chat.date_today")}, Oct 24
            </Badge>
          </div>

          {mockMessages.map((msg) => {
            const isFromMe = msg.sender === appContext.role;
            return (
              <MessageBubble
                key={msg.id}
                avatarUrl={
                  isFromMe ? mockFacilitator.avatarUrl : mockClient.avatarUrl
                }
                name={isFromMe ? mockFacilitator.name : mockClient.name}
                message={msg.message}
                isFromMe={isFromMe}
                timestamp={msg.timestamp}
              />
            );
          })}
        </div>
      </ScrollArea>

      <div className="shrink-0 bg-background p-4 space-y-3">
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
            <p className="text-[10px] text-muted-foreground">{"\u00A0"}</p>
          </div>
        )}
      </div>
      <AlertDialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말로 채팅방을 나가시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              채팅방을 나가면 이 대화의 모든 내용이 삭제되며 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              나가기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
