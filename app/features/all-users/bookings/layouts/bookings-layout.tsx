import { Link, Outlet, useLocation, useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import { CalendarIcon, ClockIcon, CalendarCheckIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import type { AppContext } from "~/types";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
} from "~/common/components/ui/sidebar";

const facilitatorMenuItems = [
  {
    key: "sessions",
    path: "/my/bookings/sessions",
    icon: CalendarIcon,
    labelKey: "nav.sessions",
  },
  {
    key: "manage",
    path: "/my/bookings/manage",
    icon: CalendarCheckIcon,
    labelKey: "nav.manage_bookings",
  },
  {
    key: "availability",
    path: "/my/bookings/availability",
    icon: ClockIcon,
    labelKey: "nav.availability",
  },
];

const clientMenuItems = [
  {
    key: "sessions",
    path: "/my/bookings/sessions",
    icon: CalendarIcon,
    labelKey: "nav.sessions",
  },
  {
    key: "manage",
    path: "/my/bookings/manage",
    icon: CalendarCheckIcon,
    labelKey: "nav.manage_bookings",
  },
];

export default function BookingsLayout() {
  const appContext = useOutletContext<AppContext>();
  const { t } = useTranslation();
  const location = useLocation();
  const isFacilitator = appContext.role === "facilitator";
  const menuItems = isFacilitator ? facilitatorMenuItems : clientMenuItems;

  return (
    <SidebarProvider className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar collapsible="none" className="w-60 border-r bg-card shrink-0">
        <SidebarHeader className="p-6">
          <h2 className="text-lg font-bold">{t("nav.bookings")}</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {t("nav.bookings_description")}
          </p>
        </SidebarHeader>
        <SidebarContent className="px-3">
          <SidebarMenu>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className="gap-3 py-5"
                  >
                    <Link to={item.path}>
                      <item.icon className="size-4" />
                      <span>{t(item.labelKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="flex-1 bg-transparent">
        <Outlet context={appContext} />
      </SidebarInset>
    </SidebarProvider>
  );
}
