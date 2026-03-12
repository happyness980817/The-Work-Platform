import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import { Card, CardContent, CardFooter } from "~/common/components/ui/card";
import { useTranslation } from "react-i18next";
import { Separator } from "~/common/components/ui/separator";

interface FacilitatorCardProps {
  id: number;
  name: string;
  languages: string[];
  bio: string;
  imageUrl: string;
}

export default function FacilitatorCard({
  id,
  name,
  languages,
  bio,
  imageUrl,
}: FacilitatorCardProps) {
  const { t } = useTranslation();
  return (
    <Link to={`/facilitators/${id}`} className="cursor-default">
      <Card className="overflow-hidden flex flex-col">
        <div className="relative">
          <div
            className="h-48 w-full bg-cover bg-center"
            style={{ backgroundImage: `url("${imageUrl}")` }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-card to-transparent h-16" />
        </div>
        <CardContent className="flex-1 pt-4 space-y-2">
          <h3 className="text-lg font-bold">{name}</h3>
          <p className="text-sm font-medium text-primary">
            {languages.map((l) => t(l)).join(", ")}
          </p>
          <p className="text-sm text-muted-foreground line-clamp-3">{bio}</p>
        </CardContent>
        <Separator />
        <CardFooter className="pt-4">
          <Button className="w-full cursor-pointer">
            <span>{t("facilitators.book")}</span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
