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
      <div className="flex items-center my-1">
        <Button variant="ghost" className="flex-1 h-auto p-0" asChild>
          <Link
            to={`/facilitator/chats/sessions/${sessionNumber}`}
            className="flex flex-col items-start w-full px-5 py-1"
          >
            <div className="flex flex-col w-full justify-between">
              <div className="flex items-center py-1 w-full justify-between">
                <span className="text-base font-semibold text-foreground">
                  {t('bookings.session_number', { number: sessionNumber })}
                </span>
                <span className="text-xs text-muted-foreground font-normal">
                  {startDate}
                </span>
              </div>
              {lastMessage && (
                <span className="text-sm text-muted-foreground font-normal mt-1 text-left w-full truncate">
                  {lastMessage}
                </span>
              )}
            </div>
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground"
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
