import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputPair from '~/common/components/input-pair';
import PasswordInputPair from '~/common/components/password-input-pair';
import SelectPair from '~/common/components/select-pair';
import { Input } from '~/common/components/ui/input';
import { Label } from '~/common/components/ui/label';
import { Button } from '~/common/components/ui/button';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '~/common/components/ui/alert';
import { Form } from 'react-router';
import type { Json } from 'database.types';

interface FacilitatorSettingsPageProps {
  user: {
    profile_id: string;
    name: string;
    avatar: string | null;
    role: string;
    is_editor: boolean;
    created_at: string;
  };
  facilitatorProfile: {
    profile_id: string;
    bio: string | null;
    introduction: string | null;
    languages: Json | null;
    availability: string | null;
    is_certified: boolean;
  };
  actionData?: {
    ok?: boolean;
    passwordChanged?: boolean;
    formErrors?: Record<string, string[]>;
  };
}

export default function FacilitatorSettingsPage({
  user,
  facilitatorProfile,
  actionData,
}: FacilitatorSettingsPageProps) {
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState<string | null>(user.avatar);
  const onChangeAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setAvatar(URL.createObjectURL(file));
    }
  };
  const languages = (facilitatorProfile.languages as string[]) ?? [];

  return (
    <div className="flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-10">
      <h2 className="text-2xl font-bold tracking-tight">
        {t('settings.title')}
      </h2>
      {actionData?.ok && !actionData?.passwordChanged && (
        <Alert>
          <AlertTitle>성공</AlertTitle>
          <AlertDescription>프로필이 업데이트되었습니다.</AlertDescription>
        </Alert>
      )}
      {actionData?.ok && actionData?.passwordChanged && (
        <Alert>
          <AlertTitle>성공</AlertTitle>
          <AlertDescription>비밀번호가 변경되었습니다.</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-10 lg:gap-16">
        {/* 프로필 수정 폼 */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <Form className="flex flex-col gap-5" method="post">
            <InputPair
              label={t('auth.name')}
              description={t('settings.name_desc')}
              required
              id="name"
              name="name"
              defaultValue={user.name}
              placeholder={t('auth.placeholder_name')}
            />
            {actionData?.formErrors && 'name' in actionData.formErrors ? (
              <Alert variant="destructive">
                <AlertTitle>오류</AlertTitle>
                <AlertDescription>
                  {actionData.formErrors.name?.join(', ')}
                </AlertDescription>
              </Alert>
            ) : null}
            <InputPair
              label={t('settings.bio')}
              description={t('settings.bio_hint')}
              id="bio"
              name="bio"
              defaultValue={facilitatorProfile.bio || ''}
              placeholder={t('settings.bio_placeholder')}
              textArea
            />
            <InputPair
              label={t('settings.introduction')}
              description={t('settings.introduction_hint')}
              id="introduction"
              name="introduction"
              defaultValue={facilitatorProfile.introduction || ''}
              placeholder={t('settings.introduction_placeholder')}
              textArea
            />
            <SelectPair
              label={t('settings.languages')}
              description={t('settings.languages_hint')}
              name="languages"
              required={false}
              placeholder={t('settings.languages_placeholder')}
              multiple
              defaultValues={languages}
              options={[
                { value: 'lang.ko', label: t('lang.ko') },
                { value: 'lang.en', label: t('lang.en') },
                { value: 'lang.zh', label: t('lang.zh') },
                { value: 'lang.es', label: t('lang.es') },
                { value: 'lang.hi', label: t('lang.hi') },
              ]}
            />
            <input type="hidden" name="intent" value="profile" />
            <Button type="submit" className="w-full">
              {t('settings.save_profile')}
            </Button>
          </Form>

          {/* 비밀번호 변경 */}
          <Form className="flex flex-col gap-5 border-t pt-8" method="post">
            <h3 className="text-lg font-semibold">
              {t('settings.change_password_desc')}
            </h3>
            <PasswordInputPair
              label={t('settings.current_password')}
              description=""
              id="current-password"
              name="currentPassword"
              placeholder="••••••••"
            />
            {actionData?.formErrors &&
            'currentPassword' in actionData.formErrors ? (
              <Alert variant="destructive">
                <AlertTitle>오류</AlertTitle>
                <AlertDescription>
                  {actionData.formErrors.currentPassword?.join(', ')}
                </AlertDescription>
              </Alert>
            ) : null}
            <PasswordInputPair
              label={t('settings.new_password')}
              description=""
              id="new-password"
              name="newPassword"
              placeholder="••••••••"
            />
            <PasswordInputPair
              label={t('settings.confirm_new_password')}
              description=""
              id="confirm-password"
              name="confirmPassword"
              placeholder="••••••••"
            />
            {actionData?.formErrors &&
            'confirmPassword' in actionData.formErrors ? (
              <Alert variant="destructive">
                <AlertTitle>오류</AlertTitle>
                <AlertDescription>
                  {actionData.formErrors.confirmPassword?.join(', ')}
                </AlertDescription>
              </Alert>
            ) : null}
            <input type="hidden" name="intent" value="password" />
            <Button type="submit" className="w-full" variant="outline">
              비밀번호 변경
            </Button>
          </Form>
        </div>

        {/* 아바타 수정 */}
        <div className="lg:col-span-2">
          <Form
            className="p-6 rounded-lg border shadow-md space-y-4"
            method="post"
            encType="multipart/form-data"
          >
            <Label className="flex flex-col gap-1">
              {t('settings.profile_photo')}
              <small className="text-muted-foreground">
                {t('settings.photo_hint')}
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
            {actionData?.formErrors && 'avatar' in actionData.formErrors ? (
              <Alert variant="destructive">
                <AlertTitle>오류</AlertTitle>
                <AlertDescription>
                  {actionData.formErrors.avatar?.join(', ')}
                </AlertDescription>
              </Alert>
            ) : null}
            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              <span>Recommended size: 128×128</span>
              <span>Allowed formats: SVG, PNG, JPG</span>
              <span>Max file size: 2MB</span>
            </div>
            <input type="hidden" name="intent" value="avatar" />
            <Button type="submit" className="w-full">
              {t('settings.change_photo')}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
