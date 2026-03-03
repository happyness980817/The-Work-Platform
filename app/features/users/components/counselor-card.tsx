import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import { Card, CardContent, CardFooter } from "~/common/components/ui/card";
import { Badge } from "~/common/components/ui/badge";
import { useTranslation } from "react-i18next";
import { cn } from "~/lib/utils";

type FacilitatorStatus = "online" | "in-session" | "offline";

interface CounselorCardProps {
  id: number;
  name: string;
  languages: string[];
  bio: string;
  imageUrl: string;
  status: FacilitatorStatus;
}

export function CounselorCard({
  id,
  name,
  languages,
  bio,
  imageUrl,
  status,
}: CounselorCardProps) {
  const { t } = useTranslation();
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative">
        <div
          className="h-48 w-full bg-cover bg-center"
          style={{ backgroundImage: `url("${imageUrl}")` }}
        />
        <Badge
          variant={status === "offline" ? "secondary" : "default"}
          className={cn(
            "absolute top-3 left-3 backdrop-blur-md",
            status === "online" &&
              "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/20",
            status === "in-session" &&
              "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/20",
            status === "offline" && "bg-secondary/80",
          )}
        >
          <span
            className={cn(
              "mr-1.5 size-2 rounded-full inline-block",
              status === "online" && "bg-green-500 animate-pulse",
              status === "in-session" && "bg-blue-500",
              status === "offline" && "bg-muted-foreground",
            )}
          />
          {t(`counselors.${status}`)}
        </Badge>
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-card to-transparent h-16" />
      </div>
      <CardContent className="flex-1 pt-4 space-y-2">
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-sm font-medium text-primary">
          {languages.map((l) => t(l)).join(", ")}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-3">{bio}</p>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button className="w-full" asChild>
          <Link to={`/counselors/${id}`}>{t("counselors.book")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
