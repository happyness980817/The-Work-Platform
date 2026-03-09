import { useTranslation } from "react-i18next";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { Card, CardContent } from "~/common/components/ui/card";
import { cn } from "~/lib/utils";
import type { FacilitatorStatus } from "~/features/users/data/facilitators";

interface FacilitatorProfileCardProps {
  name: string;
  imageUrl: string;
  status: FacilitatorStatus;
  introduction: string;
  languages: string[];
}

export default function FacilitatorProfileCard({
  name,
  imageUrl,
  status,
  introduction,
  languages,
}: FacilitatorProfileCardProps) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardContent className="flex flex-col items-center text-center pt-6">
        <div className="relative mb-4">
          <Avatar className="size-32 border-4 border-background">
            <AvatarImage src={imageUrl} alt={name} className="object-cover" />
            <AvatarFallback className="text-2xl">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div
            className={cn(
              "absolute bottom-3 right-3 size-4 rounded-full border-2 border-background",
              status === "online" && "bg-green-500",
              status === "in-session" && "bg-blue-500",
              status === "offline" && "bg-muted-foreground",
            )}
            title={t(`facilitators.${status}`)}
          />
        </div>
        <h1 className="text-2xl font-bold mb-1">{name}</h1>
        <p className="text-primary font-medium text-sm mb-1">
          {t("facilitator.certified")}
        </p>
        <p className="text-muted-foreground text-sm mb-3">
          {languages.map((l) => t(l)).join(", ")}
        </p>
        {/* <div className="flex flex-wrap justify-center gap-2 mb-6">
          {specialties.map((s) => (
            <Badge key={s} variant="secondary" className="text-xs">
              {s}
            </Badge>
          ))}
        </div> */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {introduction}
        </p>
      </CardContent>
    </Card>
  );
}
