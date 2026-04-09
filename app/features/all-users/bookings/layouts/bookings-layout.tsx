import { Link, Outlet, useLocation, useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import { CalendarIcon, ClockIcon, CalendarCheckIcon } from "lucide-react";
import type { AppContext } from "~/types";
import Navigation from "~/common/components/navigation";
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
    <div className="flex flex-col min-h-screen">
      <Navigation
        isLoggedIn={appContext.isLoggedIn}
        avatar={appContext.avatar}
        name={appContext.name}
        role={appContext.role}
        isEditor={appContext.isEditor}
      />
      <SidebarProvider className="flex flex-1 pt-16 min-h-0">
        <Sidebar collapsible="none" className="w-60 border-r bg-card shrink-0 h-[calc(100vh-4rem)] sticky top-16">
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
    </div>
  );
}
