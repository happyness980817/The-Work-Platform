import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
import FacilitatorCard from "~/features/users/components/facilitator-card";
import {
  facilitators,
  type FacilitatorStatus,
} from "~/features/users/data/facilitators";
import type { Route } from "./+types/facilitators-page";

const AVAILABILITY_OPTIONS: FacilitatorStatus[] = [
  "online",
  "in-session",
  "offline",
];

const LANGUAGE_OPTIONS = [
  "lang.ko",
  "lang.en",
  "lang.zh",
  "lang.es",
  "lang.hi",
];

export default function FacilitatorsPage({}) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const availability = searchParams.get("availability");
  const language = searchParams.get("language");

  const filtered = facilitators.filter((f) => {
    if (availability && f.status !== availability) return false;
    if (language && !f.languages.includes(language)) return false;
    return true;
  });

  return (
    <div className="flex flex-col max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-8 gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t("facilitators.title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("facilitators.subtitle")}
        </p>
      </div>

      <div className="flex items-center gap-5">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 text-sm">
            <span>
              {availability
                ? t(`facilitators.filter.${availability}`)
                : t("facilitators.filter.availability")}
            </span>
            <ChevronDownIcon className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              className="cursor-pointer"
              checked={!availability}
              onCheckedChange={() => {
                searchParams.delete("availability");
                setSearchParams(searchParams);
              }}
            >
              {t("facilitators.filter.all")}
            </DropdownMenuCheckboxItem>
            {AVAILABILITY_OPTIONS.map((option) => (
              <DropdownMenuCheckboxItem
                className="cursor-pointer"
                key={option}
                checked={availability === option}
                onCheckedChange={(checked: boolean) => {
                  if (checked) {
                    searchParams.set("availability", option);
                  } else {
                    searchParams.delete("availability");
                  }
                  setSearchParams(searchParams);
                }}
              >
                {t(`facilitators.filter.${option}`)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 text-sm">
            <span>
              {language ? t(language) : t("facilitators.filter.language")}
            </span>
            <ChevronDownIcon className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              className="cursor-pointer"
              checked={!language}
              onCheckedChange={() => {
                searchParams.delete("language");
                setSearchParams(searchParams);
              }}
            >
              {t("facilitators.filter.all")}
            </DropdownMenuCheckboxItem>
            {LANGUAGE_OPTIONS.map((option) => (
              <DropdownMenuCheckboxItem
                className="cursor-pointer"
                key={option}
                checked={language === option}
                onCheckedChange={(checked: boolean) => {
                  if (checked) {
                    searchParams.set("language", option);
                  } else {
                    searchParams.delete("language");
                  }
                  setSearchParams(searchParams);
                }}
              >
                {t(option)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((facilitator) => (
          <FacilitatorCard key={facilitator.id} {...facilitator} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          {t("facilitators.filter.no_results")}
        </p>
      )}
    </div>
  );
}
