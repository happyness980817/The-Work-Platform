import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button } from '~/common/components/ui/button';
import { EllipsisVertical, LogOutIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/common/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/common/components/ui/alert-dialog';

export function SessionCard({
  sessionNumber,
  startDate,
  lastMessage,
  onDelete,
}: {
  sessionNumber: number;
  startDate: string;
  lastMessage: string;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="group relative my-1 rounded-md hover:bg-accent">
        <Link
          to={`/facilitator/chats/sessions/${sessionNumber}`}
          className="flex flex-col items-start w-full px-5 py-2"
        >
          <div className="flex items-center py-1 w-full justify-between gap-2 pr-8">
            <span className="text-base font-semibold text-foreground">
              {t('bookings.session_number', { number: sessionNumber })}
            </span>
            <span className="text-xs text-muted-foreground font-normal">
              {startDate}
            </span>
          </div>
          {lastMessage && (
            <span className="text-sm text-muted-foreground font-normal mt-1 text-left w-full truncate pr-8">
              {lastMessage}
            </span>
          )}
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 size-7 text-muted-foreground opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100 transition-opacity"
            >
              <EllipsisVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <LogOutIcon className="size-4 mr-2" />
              채팅방 나가기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말로 채팅방을 나가시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              채팅방을 나가면 이 세션의 모든 대화 내용이 삭제되며 복구할 수
              없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={onDelete}
            >
              나가기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
