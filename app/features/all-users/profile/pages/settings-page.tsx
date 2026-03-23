import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import InputPair from "~/common/components/input-pair";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { Button } from "~/common/components/ui/button";
import { Alert, AlertDescription } from "~/common/components/ui/alert";
import { Form } from "react-router";
import { InfoIcon } from "lucide-react";

const mockUser = {
  name: "Sarah Jenkins",
  bio: "Specializing in relationship conflicts and self-worth inquiries. I help clients apply The Work to dissolve painful beliefs about family dynamics.",
  introduction:
    "I help individuals untangle stressful thoughts using The Work. My sessions are direct, compassionate, and focused on finding your own truth.",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBXh6AuGuTwRu_SVMeV_O2NOB3mGLJxzoF9XCWWWe5WN8vX2IQao-efhpJ6weRRdkSzqpB_w848n6wlL5_KU_8Q7nxy_1Gtaw4s-HeiUOBj7O2r8V1nqDNoxZOb9j5VLSBOEv1eXZVu84bjfLHSt1RyDc5N4SCVBhvFvDu-sm1Yug1y9qIb2px-nRNtFFUSE6UJ9HdAUGfs8d9yf6o60NUr7b7ekhpcPWit0x20EtmcdaJLOAPLJH5-4soyAyypJGNKx8loua8gAFk",
};

export default function SettingsPage() {
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState<string | null>(mockUser.avatar);
  const onChangeAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setAvatar(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-10">
      <h2 className="text-2xl font-bold tracking-tight">
        {t("settings.title")}
      </h2>
      <Alert>
        <InfoIcon className="size-4" />
        <AlertDescription className="flex flex-row items-center gap-1">
          {t("settings.booking_hint")}
          <Link
            to="/my/bookings/availability"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            {t("settings.booking_hint_link")}
          </Link>
          {t("settings.booking_hint_suffix")}
        </AlertDescription>
      </Alert>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-10 lg:gap-16">
        {/* 프로필 수정 폼 */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <Form className="flex flex-col gap-5">
            <InputPair
              label={t("auth.name")}
              description={t("settings.name_desc")}
              required
              id="name"
              name="name"
              defaultValue={mockUser.name}
              placeholder={t("auth.placeholder_name")}
            />
            <InputPair
              label={t("settings.bio")}
              description={t("settings.bio_hint")}
              id="bio"
              name="bio"
              defaultValue={mockUser.bio}
              placeholder={t("settings.bio_placeholder")}
              textArea
            />
            <InputPair
              label={t("settings.introduction")}
              description={t("settings.introduction_hint")}
              id="introduction"
              name="introduction"
              defaultValue={mockUser.introduction}
              placeholder={t("settings.introduction_placeholder")}
              textArea
            />
            <Button type="submit" className="w-full">
              {t("settings.save_profile")}
            </Button>
          </Form>
        </div>

        {/* 아바타 수정 */}
        <div className="lg:col-span-2">
          <Form className="p-6 rounded-lg border shadow-md space-y-4">
            <Label className="flex flex-col gap-1">
              {t("settings.profile_photo")}
              <small className="text-muted-foreground">
                {t("settings.photo_hint")}
              </small>
            </Label>
            <div className="size-40 rounded-full shadow-xl overflow-hidden">
              {avatar ? (
                <img
                  src={avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <Input
              type="file"
              className="w-full"
              onChange={onChangeAvatar}
              accept="image/*"
              name="avatar"
            />
            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              <span>Recommended size: 128×128</span>
              <span>Allowed formats: SVG, PNG, JPG</span>
              <span>Max file size: 2MB</span>
            </div>
            <Button type="submit" className="w-full">
              {t("settings.change_photo")}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
