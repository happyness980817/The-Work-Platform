import { useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import type { AppContext } from "~/types";
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
import { SettingsIcon, GlobeIcon, ClockIcon } from "lucide-react";
import { facilitators } from "~/features/all-users/data/facilitators";

/* ── Mock: 퍼실리테이터 프로필 상세 데이터 ── */
const mockFacilitatorProfile = {
  ...facilitators[0],
  email: "sarah.jenkins@example.com",
  memberSince: "2023-03-15",
  availability: "Mon–Fri, 09:00–17:00",
};

export default function FacilitatorProfilePage() {
  const { t } = useTranslation();
  const appContext = useOutletContext<AppContext>();
  const profile = mockFacilitatorProfile;

  return (
    <div className="flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
      {/* 헤더: 아바타 + 기본 정보 */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <Avatar className="size-28 border-4 border-background shadow-lg">
          <AvatarImage
            src={profile.imageUrl}
            alt={profile.name}
            className="object-cover"
          />
          <AvatarFallback className="text-3xl">
            {profile.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <Badge variant="default" className="w-fit text-xs">
              {t("facilitator.certified")}
            </Badge>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
            {profile.bio}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <GlobeIcon className="size-3.5" />
              {profile.languages.map((l) => t(l)).join(", ")}
            </span>
          </div>

          <div className="flex gap-3 pt-1">
            <Button variant="outline" size="sm" asChild>
              <Link to="/my/settings">
                <SettingsIcon className="size-4 mr-1.5" />
                {t("profile.edit_profile")}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Availability */}
      <Card>
        <CardContent className="flex items-center gap-3 py-6">
          <ClockIcon className="size-5 text-primary" />
          <div>
            <span className="text-sm font-bold">{profile.availability}</span>
            <p className="text-xs text-muted-foreground">
              {t("profile.availability")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 소개 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("profile.introduction")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {profile.introduction}
          </p>
        </CardContent>
      </Card>

      {/* 계정 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("profile.account_info")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("profile.display_name")}
              </p>
              <p className="text-sm font-medium">{profile.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("auth.email")}
              </p>
              <p className="text-sm font-medium">{profile.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("profile.role")}
              </p>
              <p className="text-sm font-medium capitalize">
                {appContext.role}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("profile.member_since")}
              </p>
              <p className="text-sm font-medium">{profile.memberSince}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
