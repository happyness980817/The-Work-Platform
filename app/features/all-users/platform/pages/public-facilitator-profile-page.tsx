import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { Route } from './+types/public-facilitator-profile-page';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/common/components/ui/avatar';
import { Badge } from '~/common/components/ui/badge';
import { Button } from '~/common/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/common/components/ui/card';
import { Separator } from '~/common/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/common/components/ui/breadcrumb';
import { GlobeIcon, CalendarIcon, MessageCircleIcon } from 'lucide-react';
import { dummyFacilitators } from '~/features/all-users/data/facilitators';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '~/common/components/ui/hover-card';
import { getFacilitators } from '../queries';
import { getFacilitatorsInfo } from '~/features/facilitators/queries';

export const loader = async () => {
  const facilitators = await getFacilitators();
  const facilitatorsInfo = await getFacilitatorsInfo();
  return { facilitators, facilitatorsInfo };
};


export default function FacilitatorProfilePage({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { t } = useTranslation();
  const facilitatorId = params.facilitatorId;
  const facilitator =
    loaderData.facilitators.find((item) => item.profile_id === facilitatorId) ??
    loaderData.facilitators[0];
  const facilitatorInfo = loaderData.facilitatorsInfo?.find(
    (item) => item.profile_id === facilitator?.profile_id
  );
  const bio = facilitatorInfo?.bio ?? '';
  const introduction = facilitatorInfo?.introduction ?? '';
  return (
    <div className="flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/facilitators">{t('facilitators.title')}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{facilitator.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <Avatar className="size-28 border-4 border-background shadow-lg">
          <AvatarImage
            src={facilitator.avatar || ''}
            alt={facilitator.name}
            className="object-cover"
          />
          <AvatarFallback className="text-3xl">
            {facilitator.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h1 className="text-2xl font-bold">{facilitator.name}</h1>
            <Badge variant="default" className="w-fit text-xs">
              {t('facilitator.certified')}
            </Badge>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
            {bio}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <GlobeIcon className="size-3.5" />
              {(facilitator.facilitator_profiles?.languages as string[] ?? [])
                .map((l) => t(l))
                .join(', ')}
            </span>
          </div>

          <div className="flex gap-3 pt-1">
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="cursor-not-allowed">
                  <Button size="sm" className="opacity-50">
                    <CalendarIcon className="size-4 mr-1.5" />
                    {t('facilitator.booking.title')}
                  </Button>
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto px-3 py-2 text-sm">
                구현 예정입니다
              </HoverCardContent>
            </HoverCard>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/chats/dms/${facilitator.profile_id}`}>
                <MessageCircleIcon className="size-4 mr-1.5" />
                DM
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('profile.introduction')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {introduction}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
