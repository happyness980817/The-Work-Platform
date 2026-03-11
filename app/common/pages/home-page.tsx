import { Button } from "~/common/components/ui/button";
import { Card } from "~/common/components/ui/card";
import FacilitatorCard from "~/features/platform/components/facilitator-card";
import { useTranslation } from "react-i18next";
import { facilitators } from "~/features/users/data/facilitators";

const heroImageUrl =
  "https://thework.com/wp-content/uploads/2019/03/byron-katie-founder-thework@2x.jpg";

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-12">
      {/* Hero Section */}
      <Card className="overflow-hidden border-0 bg-card">
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-0">
          <div
            className="w-full lg:w-1/2 min-h-[300px] lg:min-h-[400px] bg-cover bg-center"
            style={{ backgroundImage: `url("${heroImageUrl}")` }}
          />
          <div className="flex flex-col justify-center gap-4 p-8 md:p-12 lg:w-1/2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {t("hero.title_before")}
              <span className="text-primary">{t("hero.title_highlight")}</span>
              {t("hero.title_after")}
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              {t("hero.description")}
            </p>
            <div className="flex justify-end">
              <Button variant="link">{t("hero.cta")} &rarr;</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Facilitators Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {t("facilitators.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilitators.map((facilitator) => (
            <FacilitatorCard key={facilitator.id} {...facilitator} />
          ))}
        </div>
      </div>
    </div>
  );
}
