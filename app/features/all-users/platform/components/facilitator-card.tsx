import { Link } from 'react-router';
import { Button } from '~/common/components/ui/button';
import { Card, CardContent, CardFooter } from '~/common/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Separator } from '~/common/components/ui/separator';
import { MailIcon } from 'lucide-react';
import { Badge } from '~/common/components/ui/badge';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '~/common/components/ui/hover-card';

export default function FacilitatorCard({
  profileId,
  name,
  languages,
  bio,
  imageUrl,
}: {
  profileId: string;
  name: string;
  languages: string[];
  bio: string;
  imageUrl: string | null;
}) {
  const { t } = useTranslation();
  return (
    <Card className="overflow-hidden flex flex-col">
      <Link to={`/facilitators/profile/${profileId}`} className="block group">
        <div className="relative">
          <div
            className="h-48 w-full bg-cover bg-center transition-transform duration-200 group-hover:scale-105"
            style={{ backgroundImage: `url("${imageUrl}")` }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-card to-transparent h-16" />
        </div>
        <CardContent className="flex-1 pt-4 space-y-2">
          <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex flex-wrap gap-1">
            {languages.map((l) => (
              <Badge
                key={l}
                variant="secondary"
                className="text-xs px-2 py-0.5"
              >
                {t(l)}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">{bio}</p>
        </CardContent>
      </Link>
      <Separator />
      <CardFooter className="pt-4 flex gap-3">
        <HoverCard>
          <HoverCardTrigger asChild>
            <span className="flex-1 cursor-not-allowed">
              <Button variant="secondary" className="w-full opacity-50">
                <span>{t('facilitators.book')}</span>
              </Button>
            </span>
          </HoverCardTrigger>
          <HoverCardContent className="w-auto px-3 py-2 text-sm">
            구현 예정입니다
          </HoverCardContent>
        </HoverCard>
        <Button
          size="icon"
          className="shrink-0 cursor-pointer"
          onClick={() => {
            // TODO: Handle DM
          }}
        >
          <MailIcon className="size-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
