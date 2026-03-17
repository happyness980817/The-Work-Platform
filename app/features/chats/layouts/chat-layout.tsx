import { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "~/common/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "~/common/components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/common/components/ui/collapsible";
import { Badge } from "~/common/components/ui/badge";
import { ChevronRightIcon, StopCircleIcon } from "lucide-react";
import type { AppContext } from "~/types";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuBadge,
} from "~/common/components/ui/sidebar";

export type ChatContext = AppContext;

/* ── Mock: 내담자별 세션 그룹 ── */
interface SessionItem {
  id: number;
  label: string;
  date: string;
  isInSession?: boolean;
}

interface ClientGroup {
  clientId: number;
  name: string;
  avatarUrl: string;
  sessions: SessionItem[];
}

const mockClients: ClientGroup[] = [
  {
    clientId: 1,
    name: "Jane Smith",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAr5DPdUsim3L9Kd3llvPH6I8419IVP7m1w2K28cUTt7w4zFdKZnEXScHfN0P-bw6f992O45khAmkw3uKCuIKzVRaDNoA9khVUAGboQKBRJMu-oUi8glutmMNVl0VDeRRkMhzRqOw3QW4-oyziBPA0NbpMoLNRR2R8cUNPcAM-jErc2uJQFIBDEJiTWOwijTlGxvfBwXu7WCrycwKZKGRLV97wvZOU89tYEfXhe2InwTJGfHFsWi4dC4d9Bwr_ToHzzQgsuzGDG0Kk",
    sessions: [
      { id: 1, label: "Session #4", date: "Today", isInSession: true },
      { id: 5, label: "Session #3", date: "Oct 28" },
      { id: 6, label: "Session #2", date: "Oct 14" },
      { id: 7, label: "Session #1", date: "Sep 30" },
    ],
  },
  {
    clientId: 2,
    name: "Michael Brown",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCwj7VhOVv0ogQu1v9Op6Ozzi1KKDhKNiVxSgvafTAOYkXwG_R7CaWa1iDObfv1plX6sgbdsazipCWXXoBsn9WMIPwQEOrV7vdORzvd8LLv-rOjS4VJlZlfZj-PENOiaLAbiGSu9IWjq0FP5jx3-WrlSesH_YMmMmAzKLQDTuSvdaCRZyWHIW1peFwLovI7wYOGQG9M1jYXqso3-gC-ekbhgkckDtOGW3QQdKYPg7UZ2UeGtWgWfV7aHajuzyfHfj3iaa8Q0LlS7_Q",
    sessions: [
      { id: 2, label: "Session #12", date: "2:00 PM" },
      { id: 8, label: "Session #11", date: "Oct 25" },
      { id: 9, label: "Session #10", date: "Oct 18" },
    ],
  },
  {
    clientId: 3,
    name: "Sarah Wilson",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDwHBxU-0QC9ee-C4NLQHTAuxEXt4LDepI3zFdpOxdeWyCY7RVnkQ0ZFmjm9D6tlXcW2ITHEH3B7QF0svK8-JDHijjA7SkiqzZwxA3-_1RvwM3v6aWoDxJnJYjplauF56h4XEuFWXDa6Xwmd6jmvFVQ4U6at5pgvtZx8dK2zf7wLu8XAF1efmrLya-fhicloj8XClHQ5XPEfV9AB8bRYNt30bF0qLMLUjukuNY7ripDZkk6heng5oHWZUApYZfmInRRBqstSdDVxaE",
    sessions: [
      { id: 3, label: "Session #3", date: "Oct 23" },
      { id: 10, label: "Session #2", date: "Oct 9" },
    ],
  },
  {
    clientId: 4,
    name: "Emily Davis",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBBxCezaT1dvFo82Vbg4k_skl8xk0Q8crY7oUFlyHImMaJFbX_IGOUS_Af_iXtEV4Qc3AjAaLAz3RzijCKOVMlUBq8rygp0S8s1GqizGk7KHz7YHa1oO-QtyQY_RSHGBA-qCyakvZliHqQdBGr3m3KdpyCspQMDUSP0HcrTc8AfW7HtAUaASsZ0rSw3Lo8pQIgaO7pNdgfnSLhBmIoBxPx15mmlAQmilTFAPx318IWeRJ1JmmGDmTYov-7jvnQ3mS-Q-FsjUHPYSBw",
    sessions: [{ id: 4, label: "Session #8", date: "Oct 21" }],
  },
];

/* ── Mock: DM 목록 ── */
interface DmItem {
  id: number;
  name: string;
  avatarUrl: string;
  lastMessage: string;
  time: string;
}

const mockDms: DmItem[] = [
  {
    id: 1,
    name: "Jane Smith",
    avatarUrl: mockClients[0].avatarUrl,
    lastMessage: "Thank you for the session!",
    time: "10:32 AM",
  },
  {
    id: 2,
    name: "Michael Brown",
    avatarUrl: mockClients[1].avatarUrl,
    lastMessage: "Can we reschedule?",
    time: "Yesterday",
  },
  {
    id: 3,
    name: "Sarah Wilson",
    avatarUrl: mockClients[2].avatarUrl,
    lastMessage: "See you next week.",
    time: "Oct 23",
  },
];

export default function ChatLayout() {
  const appContext = useOutletContext<AppContext>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"dms" | "sessions">("sessions");
  const isFacilitator = appContext.role === "facilitator";

  useEffect(() => {
    if (location.pathname.startsWith("/chats/sessions")) {
      setActiveTab("sessions");
    } else if (location.pathname.startsWith("/chats/dms")) {
      setActiveTab("dms");
    }
  }, [location.pathname]);

  const hasInSessionSession = mockClients.some((c) =>
    c.sessions.some((s) => s.isInSession),
  );

  return (
    <SidebarProvider className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <Sidebar collapsible="none" className="w-80 border-r bg-card shrink-0">
        <SidebarHeader className="p-4 flex flex-col gap-4">
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
        </SidebarHeader>

        <SidebarContent>
          {activeTab === "sessions" ? (
            /* ── Sessions: 내담자별 Collapsible 그룹 ── */
            <SidebarGroup>
              <SidebarGroupLabel>{t("chat.sessions")}</SidebarGroupLabel>
              <SidebarMenu>
                {mockClients.map((client) => {
                  const hasInSession = client.sessions.some(
                    (s) => s.isInSession,
                  );
                  return (
                    <Collapsible
                      key={client.clientId}
                      defaultOpen={hasInSession}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="h-10">
                            <Avatar className="size-6 shrink-0">
                              <AvatarImage src={client.avatarUrl} />
                              <AvatarFallback className="text-[10px]">
                                {client.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium truncate">
                              {client.name}
                            </span>
                            {hasInSession && (
                              <Badge className="text-[10px] px-1.5 py-0 shrink-0 ml-1">
                                {t("chat.in_session")}
                              </Badge>
                            )}
                            <ChevronRightIcon className="ml-auto size-4 text-muted-foreground transition-transform group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {client.sessions.map((session) => {
                              const isSelected =
                                location.pathname ===
                                `/chats/sessions/${session.id}`;
                              return (
                                <SidebarMenuSubItem key={session.id}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isSelected}
                                  >
                                    <Link to={`/chats/sessions/${session.id}`}>
                                      <span className="truncate text-muted-foreground">
                                        {session.label}
                                      </span>
                                      <span className="ml-auto text-[10px] text-muted-foreground shrink-0">
                                        {session.isInSession
                                          ? t("chat.current")
                                          : session.date}
                                      </span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          ) : (
            /* ── DMs: flat list ── */
            <SidebarGroup>
              <SidebarGroupLabel>{t("chat.dms")}</SidebarGroupLabel>
              <SidebarMenu>
                {mockDms.map((dm) => {
                  const isSelected =
                    location.pathname === `/chats/dms/${dm.id}`;
                  return (
                    <SidebarMenuItem key={dm.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={isSelected}
                        size="lg"
                      >
                        <Link to={`/chats/dms/${dm.id}`}>
                          <Avatar className="size-8 shrink-0">
                            <AvatarImage src={dm.avatarUrl} />
                            <AvatarFallback className="text-xs">
                              {dm.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium text-sm truncate">
                                {dm.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground shrink-0">
                                {dm.time}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground truncate">
                              {dm.lastMessage}
                            </span>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          )}
        </SidebarContent>

        {isFacilitator && hasInSessionSession && (
          <SidebarFooter className="p-4 border-t">
            <Button variant="outline" className="w-full text-primary">
              <StopCircleIcon className="size-5 mr-2" />
              {t("chat.end_session")}
            </Button>
          </SidebarFooter>
        )}
      </Sidebar>

      <SidebarInset className="flex-1 flex flex-col min-w-0 bg-transparent">
        <Outlet context={appContext} />
      </SidebarInset>
    </SidebarProvider>
  );
}
