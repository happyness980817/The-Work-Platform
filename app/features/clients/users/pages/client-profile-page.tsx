import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/common/components/ui/avatar';
import { Button } from '~/common/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/common/components/ui/card';
import { Separator } from '~/common/components/ui/separator';
import { SettingsIcon } from 'lucide-react';
import { DateTime } from 'luxon';

interface ClientProfilePageProps {
  user: {
    profile_id: string;
    name: string;
    avatar: string | null;
    role: string;
    is_editor: boolean;
    created_at: string;
  };
}

export default function ClientProfilePage({ user }: ClientProfilePageProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
      {/* 헤더: 아바타 + 기본 정보 */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <Avatar className="size-28 border-4 border-background shadow-lg">
          <AvatarImage
            src={user.avatar || ''}
            alt={user.name}
            className="object-cover"
          />
          <AvatarFallback className="text-3xl">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <h1 className="text-2xl font-bold">{user.name}</h1>

          <div className="flex gap-3 pt-1">
            <Button variant="outline" size="sm" asChild>
              <Link to="/my/settings">
                <SettingsIcon className="size-4 mr-1.5" />
                {t('profile.edit_profile')}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* 계정 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('profile.account_info')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t('profile.display_name')}
              </p>
              <p className="text-sm font-medium">{user.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t('profile.role')}
              </p>
              <p className="text-sm font-medium capitalize">{user.role}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t('profile.member_since')}
              </p>
              <p className="text-sm font-medium">
                {DateTime.fromISO(user.created_at, { zone: 'utc' }).toFormat(
                  'yyyy-MM-dd'
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
