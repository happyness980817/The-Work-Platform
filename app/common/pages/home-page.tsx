import { Button } from "~/common/components/ui/button";
import { Card } from "~/common/components/ui/card";
import FacilitatorCard from "~/features/users/components/facilitator-card";
import { useTranslation } from "react-i18next";

const heroImageUrl =
  "https://thework.com/wp-content/uploads/2019/03/byron-katie-founder-thework@2x.jpg";
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

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-8 gap-12">
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
