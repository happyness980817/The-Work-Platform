import { Link, useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import { EyeIcon } from "lucide-react";
import type { Route } from "./+types/facilitator-page";
import type { AppContext } from "~/types";
import FacilitatorProfileCard from "~/features/platform/components/facilitator-profile-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/common/components/ui/breadcrumb";
import { Card, CardContent } from "~/common/components/ui/card";
import ScheduleCard from "~/features/platform/components/schedule-card";
import { facilitators } from "~/features/users/data/facilitators";

export default function FacilitatorPage({ params }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { role } = useOutletContext<AppContext>();
  const facilitatorId = Number(params.facilitatorId);
  const facilitator =
    facilitators.find((item) => item.id === facilitatorId) ?? facilitators[0];

  return (
    <div className="flex flex-col max-w-[1080px] mx-auto px-4 sm:px-8 py-8 gap-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/facilitators">{t("facilitators.title")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{facilitator.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <FacilitatorProfileCard
            name={facilitator.name}
            imageUrl={facilitator.imageUrl}
            status={facilitator.status}
            introduction={facilitator.introduction}
            languages={facilitator.languages}
          />
        </div>

        <div className="lg:col-span-8">
          {role === "client" ? (
            <ScheduleCard />
          ) : (
            <Card className="h-full flex flex-col">
              <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <div className="bg-muted rounded-full p-4">
                  <EyeIcon className="size-8 text-muted-foreground" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h2 className="text-lg font-semibold">
                    {t("facilitator.preview.title")}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("facilitator.preview.description")}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
