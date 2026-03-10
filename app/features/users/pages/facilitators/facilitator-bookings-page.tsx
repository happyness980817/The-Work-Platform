import ScheduleCard from "~/features/platform/components/schedule-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/common/components/ui/breadcrumb";
import { Link } from "react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import type { AppContext } from "~/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/common/components/ui/tabs";

export default function FacilitatorBookingsPage() {
  const { t } = useTranslation();
  const appContext = useOutletContext<AppContext>();
  const [activeTab, setActiveTab] = useState("upcoming");

  return (
    <div className="flex flex-col max-w-[1200px] mx-auto px-4 sm:px-8 py-8 gap-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/my/bookings">{t("nav.bookings")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {activeTab === "upcoming" ? "예약 관리" : "상담 시간 설정"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-8">
          {t("nav.bookings")}
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="upcoming">예약 관리</TabsTrigger>
            <TabsTrigger value="availability">상담 시간 설정</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed border-border bg-card">
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <h3 className="mt-4 text-lg font-semibold">
                  진행 예정인 상담이 없습니다
                </h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  새로운 상담 예약이 들어오면 이곳에 표시됩니다.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="availability">
            <div className="flex justify-start gap-6">
              <ScheduleCard />
              <ScheduleCard />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
