import { useState } from "react";
import { useTranslation } from "react-i18next";
import InputPair from "~/common/components/input-pair";
import PasswordInputPair from "~/common/components/password-input-pair";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { Button } from "~/common/components/ui/button";
import { Form } from "react-router";

const mockUser = {
  name: "mockname",
  avatar: "",
};

export default function ClientSettingsPage() {
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
            <PasswordInputPair
              label={t("settings.current_password")}
              description={t("settings.change_password_desc")}
              id="current-password"
              name="currentPassword"
              placeholder="••••••••"
            />
            <PasswordInputPair
              label={t("settings.new_password")}
              description=""
              id="new-password"
              name="newPassword"
              placeholder="••••••••"
            />
            <PasswordInputPair
              label={t("settings.confirm_new_password")}
              description=""
              id="confirm-password"
              name="confirmPassword"
              placeholder="••••••••"
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
