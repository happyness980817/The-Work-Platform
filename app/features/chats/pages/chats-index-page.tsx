import { MessageCircleIcon } from "lucide-react";

export default function ChatsIndexPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
      <div className="flex items-center justify-center size-16 rounded-full bg-muted">
        <MessageCircleIcon className="size-8" />
      </div>
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold text-foreground">Messages</h3>
        <p className="text-sm">Select a conversation to start messaging</p>
      </div>
    </div>
  );
}
