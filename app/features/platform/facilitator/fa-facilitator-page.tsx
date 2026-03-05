import { useTranslation } from "react-i18next";
import { Card, CardContent } from "~/common/components/ui/card";
import { EyeIcon } from "lucide-react";

export default function FaFacilitatorPage() {
  const { t } = useTranslation();

  return (
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
  );
}
