import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import { Card, CardContent, CardFooter } from "~/common/components/ui/card";
import { Badge } from "~/common/components/ui/badge";

interface CounselorCardProps {
  id: number;
  name: string;
  languages: string;
  bio: string;
  imageUrl: string;
  online: boolean;
}

export function CounselorCard({
  id,
  name,
  languages,
  bio,
  imageUrl,
  online,
}: CounselorCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative">
        <div
          className="h-48 w-full bg-cover bg-center"
          style={{ backgroundImage: `url("${imageUrl}")` }}
        />
        <Badge
          variant={online ? "default" : "secondary"}
          className={`absolute top-3 left-3 ${
            online
              ? "bg-green-500/20 text-green-400 border-green-500/30 backdrop-blur-md hover:bg-green-500/20"
              : "bg-secondary/80 backdrop-blur-md"
          }`}
        >
          <span
            className={`mr-1.5 size-2 rounded-full inline-block ${
              online ? "bg-green-500 animate-pulse" : "bg-muted-foreground"
            }`}
          />
          {online ? "ONLINE" : "OFFLINE"}
        </Badge>
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-card to-transparent h-16" />
      </div>
      <CardContent className="flex-1 pt-4 space-y-2">
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-sm font-medium text-primary">{languages}</p>
        <p className="text-sm text-muted-foreground line-clamp-3">{bio}</p>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button className="w-full" asChild>
          <Link to={`/counselors/${id}`}>상담 신청</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
