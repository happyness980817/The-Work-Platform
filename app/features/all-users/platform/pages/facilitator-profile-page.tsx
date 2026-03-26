import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import type { Route } from "./+types/facilitator-profile-page";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Separator } from "~/common/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/common/components/ui/breadcrumb";
import { GlobeIcon, CalendarIcon, MessageCircleIcon } from "lucide-react";
import { facilitators } from "~/features/all-users/data/facilitators";

const mockBios: Record<number, string> = {
  1: "I'm passionate about guiding people through The Work to find clarity and peace. With over 5 years of facilitation experience, I specialize in helping individuals navigate relationship challenges and workplace stress.",
  2: "As a certified facilitator, I help people question their stressful beliefs and find freedom through self-inquiry. I work with both individuals and groups.",
  3: "I've been facilitating The Work for over 7 years. My focus is on helping people discover their own truth through compassionate, patient inquiry.",
};

export default function FacilitatorProfilePage({
  params,
}: Route.ComponentProps) {
  const { t } = useTranslation();
  const facilitatorId = Number(params.facilitatorId);
  const facilitator =
    facilitators.find((item) => item.id === facilitatorId) ?? facilitators[0];
  const bio = mockBios[facilitator.id] ?? mockBios[1];

  return (
    <div className="flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <Avatar className="size-28 border-4 border-background shadow-lg">
          <AvatarImage
            src={facilitator.imageUrl}
            alt={facilitator.name}
            className="object-cover"
          />
          <AvatarFallback className="text-3xl">
            {facilitator.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h1 className="text-2xl font-bold">{facilitator.name}</h1>
            <Badge variant="default" className="w-fit text-xs">
              {t("facilitator.certified")}
            </Badge>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
            {bio}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <GlobeIcon className="size-3.5" />
              {facilitator.languages.map((l) => t(l)).join(", ")}
            </span>
          </div>

          <div className="flex gap-3 pt-1">
            <Button size="sm" asChild>
              <Link to={`/facilitators/${facilitator.id}`}>
                <CalendarIcon className="size-4 mr-1.5" />
                {t("facilitator.booking.title")}
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/chats/dms/${facilitator.id}`}>
                <MessageCircleIcon className="size-4 mr-1.5" />
                {t("profile.contact_facilitator")}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("profile.introduction")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {facilitator.introduction}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
