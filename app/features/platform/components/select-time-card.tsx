import { CheckCircleIcon, BanIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Card } from "~/common/components/ui/card";

const ALL_HOURS = Array.from({ length: 24 }, (_, i) => {
  return `${String(i).padStart(2, "0")}:00`;
});

interface SelectTimeCardProps {
  availableSlots: Set<string>;
  onToggle: (slot: string) => void;
  readOnly?: boolean;
}

export default function SelectTimeCard({
  availableSlots,
  onToggle,
  readOnly = false,
}: SelectTimeCardProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {ALL_HOURS.map((slot) => {
        const isAvailable = availableSlots.has(slot);
        return (
          <Card
            key={slot}
            role={readOnly ? undefined : "button"}
            tabIndex={readOnly ? undefined : 0}
            onClick={() => {
              if (!readOnly) onToggle(slot);
            }}
            onKeyDown={(e) => {
              if (!readOnly && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onToggle(slot);
              }
            }}
            className={cn(
              "group flex flex-col p-4 rounded-xl transition-all outline-none",
              isAvailable
                ? "border-2 border-primary bg-primary/5 hover:bg-primary/10"
                : "border border-border bg-card hover:border-border/80",
              !readOnly && "cursor-pointer",
              readOnly && "cursor-default"
            )}
          >
            <div className="flex justify-between items-start mb-2">
              <span
                className={cn(
                  "text-lg font-bold",
                  isAvailable ? "text-primary" : "text-foreground"
                )}
              >
                {slot}
              </span>
              {isAvailable ? (
                <CheckCircleIcon className="size-5 text-primary" />
              ) : (
                <BanIcon className="size-5 text-muted-foreground/50" />
              )}
            </div>
            <span
              className={cn(
                "text-xs font-bold uppercase tracking-wider",
                isAvailable ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isAvailable ? "Available" : "Unavailable"}
            </span>
          </Card>
        );
      })}
    </div>
  );
}
