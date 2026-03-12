import { Link, useLocation } from "react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { Badge } from "~/common/components/ui/badge";
import { cn } from "~/lib/utils";

interface MessageRoomsCardProps {
  id: number;
  name: string;
  subtitle: string;
  avatarUrl?: string;
  isSessionActive?: boolean;
  badge?: string;
}

export function MessageRoomsCard({
  id,
  name,
  subtitle,
  avatarUrl,
  isSessionActive = false,
  badge,
}: MessageRoomsCardProps) {
  const location = useLocation();
  const isSelected = location.pathname.includes(id.toString());
  return (
    <Link
      to={`/chats/sessions/${id}`}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors relative overflow-hidden",
        isSelected
          ? "bg-accent border border-transparent"
          : "hover:bg-accent/50",
      )}
    >
      <Avatar className="size-10">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start flex-1 min-w-0">
        <div className="flex w-full justify-between items-center">
          <p
            className={cn(
              "text-sm truncate",
              isSelected
                ? "font-semibold text-foreground"
                : "font-medium text-foreground/80",
            )}
          >
            {name}
          </p>
          {badge &&
            (isSessionActive ? (
              <Badge className="text-[10px]">{badge}</Badge>
            ) : (
              <span className="text-[10px] text-muted-foreground">{badge}</span>
            ))}
        </div>
        <p className="text-xs text-muted-foreground truncate w-full text-left">
          {subtitle}
        </p>
      </div>
    </Link>
  );
}
