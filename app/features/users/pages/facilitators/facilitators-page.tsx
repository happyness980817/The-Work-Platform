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
import type { Route } from "./+types/facilitators-page";

type FacilitatorStatus = "online" | "in-session" | "offline";

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

const facilitators = [
  {
    id: 1,
    name: "Sarah Jenkins",
    languages: ["lang.ko", "lang.en"],
    bio: "Specializing in relationship conflicts and self-worth inquiries. I help clients apply The Work to dissolve painful beliefs about family dynamics.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBXh6AuGuTwRu_SVMeV_O2NOB3mGLJxzoF9XCWWWe5WN8vX2IQao-efhpJ6weRRdkSzqpB_w848n6wlL5_KU_8Q7nxy_1Gtaw4s-HeiUOBj7O2r8V1nqDNoxZOb9j5VLSBOEv1eXZVu84bjfLHSt1RyDc5N4SCVBhvFvDu-sm1Yug1y9qIb2px-nRNtFFUSE6UJ9HdAUGfs8d9yf6o60NUr7b7ekhpcPWit0x20EtmcdaJLOAPLJH5-4soyAyypJGNKx8loua8gAFk",
    status: "online" as const,
  },
  {
    id: 2,
    name: "David Chen",
    languages: ["lang.zh", "lang.en"],
    bio: "Deep experience with workplace stress and career transitions. Let's question the thoughts that keep you stuck in professional anxiety.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCg99Qg2t1f76JWwizho_6u2fyEx6H3sKvYETKM3qz9tc2ok52lolYs6EhYwpDLUN96wBt331PIMMrOStdrth64EekfMQY55kH8YCuvcXGa2dfUxhapdp5M40uJXEOHHMRmrSA46dUjTTi18vKHDWP5xLtkWcR4ulix_2rqo0yQrjQ966axiBGGyrxNrm_0rbMh7CktgCQFsUQv3DuZXRaqRyPpjOVvKCmlGP3jQG2CW85EuyDbSoudC89b9V3wh8zUcibKjfEVGjQ",
    status: "online" as const,
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    languages: ["lang.en", "lang.es"],
    bio: "Gentle guidance for healing past traumas. I offer a safe space to do The Work on deep-seated beliefs and finding forgiveness.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-uOWDUXKLFU-Z3Kud1ZZAHcAG0W44HHmXsiUzCTKeD8LJaJeh1Ee3kRYICqxhmkbGfQyJX8ZuUoreLio9AZIfKgZOn1tzsn6dS9_2drM1D6KrWTMs-jfZyBk7HYcwXA2D59sqAuoRznsX7GU0JP8ejiE5WvOzUjFl2v1xQFEKbL2deioADuXMJW7FoY52hH99Yk7m93A8i9b0oOzrOtbWvStnqoaMV_hNdX_q_N1-YYVP6a171nMYstln8nz2qo93KRaA0ZQ5UFo",
    status: "offline" as const,
  },
  {
    id: 4,
    name: "Marcus Johnson",
    languages: ["lang.en"],
    bio: "Focusing on addiction and recovery. The Work is a powerful tool for sobriety and understanding the mind's cravings.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCEijL7b4QAFlTggev8E_kgqbNEehkNrDCIUKpfXjTZTU7TBscLcQn1rk2P4Nf-fDYheEcFoSHLF0UQjhtf8a2voqYpvJithCg_k0TWUNxCsOUtwfu3P8M6qvVsQ0-6t2KAWEwNEXAxTNlyDZa9s5iqEJ94CEcyWlexF2R3oueH-LfnmIBvlK1e_Yo5wTd5t2kCWy37h6q0M6WakVQ7xFIfuYdh-yx8b9y_CjPHzKi240ZfkH9QgaGPTOFKicxkwsoHOphJJ8dHV5o",
    status: "in-session" as const,
  },
  {
    id: 5,
    name: "Amara Patel",
    languages: ["lang.hi", "lang.en"],
    bio: "Expert in marriage and partnership inquiries. Discover the love that is already present by questioning your judgments.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBz14KtqC0VKdu6SNx1NofYEJ5DoBkblzUV7uJnq-alSUca5JCfPOM404dslplvRdUw8W1IuUZ3MWjLmmrqYaiNX6J-bx3kdYrE4_TzWlTTxcrDN3WXJybpH17r8LqfHd399mD-NyF2c7nDgvheooQbkvv2ynIx-vijdZ6nOFVpPhgjDOwUwvDZkDePP0ivCMghJfat5FWQHmVzkqNjGPA3zSpTTQu2eSwsD5m9J3xJtWM8dPRMopecAtHBO4GxW16JspHqMWcRSrY",
    status: "online" as const,
  },
  {
    id: 6,
    name: "James Wilson",
    languages: ["lang.en"],
    bio: "Specializing in anxiety and body image issues. Learn to love what is, including yourself and your body.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDxlZ1Ha0Su0iuokij8dIkuuc5X6XG18Vs846TIY3QPaSVUOfRW8p-RkLxcEnVV7wH-TMZHEe5WCzzksjR_Ew3I2X_y0AGVIoioIjAIvRQD6OyHisER40kKKRIKN8hOvW7q7D8STfJhbVyyzRh5UbIgeHUZkeYj4J0zRj9nOwyVn-gwNgvER-JxOkQ2gsXdcoN_wL4kpPS6x45EYoSbgfOqLdJmxZIKxioFkJ9fgZDp_qkZvdZxQLOfQ0LL4qf6MBtd9TDQGtHZhPg",
    status: "offline" as const,
  },
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
          {t("facilitators.filter.all")}
        </p>
      )}
    </div>
  );
}
