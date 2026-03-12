import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "~/common/components/ui/toggle-group";
import { cn } from "~/lib/utils";

/** "09:00" → "09:00 ~ 10:00" */
function formatRange(slot: string): string {
  const hour = parseInt(slot.split(":")[0], 10);
  const next = `${String(hour + 1).padStart(2, "0")}:00`;
  return `${slot} ~ ${next}`;
}

interface SingleProps {
  type?: "single";
  variant?: "default" | "destructive";
  slots: string[];
  selectedSlot: string;
  onSelect: (slot: string) => void;
}

interface MultipleProps {
  type: "multiple";
  variant?: "default" | "destructive";
  slots: string[];
  selectedSlots: string[];
  onSelectMultiple: (slots: string[]) => void;
}

type TimeSlotPickerProps = SingleProps | MultipleProps;

export default function TimeSlotPicker(props: TimeSlotPickerProps) {
  const { slots, variant = "default" } = props;
  const isDestructive = variant === "destructive";

  if (props.type === "multiple") {
    return (
      <ToggleGroup
        type="multiple"
        value={props.selectedSlots}
        onValueChange={props.onSelectMultiple}
        className="flex flex-col gap-2.5 w-full"
      >
        {slots.map((slot) => {
          const isOn = props.selectedSlots.includes(slot);
          return (
            <ToggleGroupItem
              key={slot}
              value={slot}
              className={cn(
                "w-full justify-between px-4 py-3 rounded-md! border h-auto",
                "data-[state=off]:bg-background data-[state=off]:border-border",
                isDestructive
                  ? cn(
                      "data-[state=off]:hover:border-destructive data-[state=off]:hover:ring-1 data-[state=off]:hover:ring-destructive",
                      "data-[state=on]:border-destructive data-[state=on]:bg-destructive/10 data-[state=on]:text-destructive",
                    )
                  : cn(
                      "data-[state=off]:hover:border-primary data-[state=off]:hover:ring-1 data-[state=off]:hover:ring-primary",
                      "data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary",
                    ),
              )}
            >
              <span className="font-medium text-sm">{formatRange(slot)}</span>
              {isOn &&
                (isDestructive ? (
                  <XCircleIcon className="size-4 text-destructive" />
                ) : (
                  <CheckCircleIcon className="size-4 text-primary" />
                ))}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    );
  }

  // single mode (default)
  const { selectedSlot, onSelect } = props;
  return (
    <ToggleGroup
      type="single"
      value={selectedSlot}
      onValueChange={onSelect}
      className="flex flex-col gap-2.5 w-full"
      spacing={1}
    >
      {slots.map((slot) => (
        <ToggleGroupItem
          key={slot}
          value={slot}
          className={cn(
            "w-full justify-between px-4 py-3 rounded-md! border h-auto",
            "data-[state=off]:bg-background data-[state=off]:border-border",
            isDestructive
              ? cn(
                  "data-[state=off]:hover:border-destructive data-[state=off]:hover:ring-1 data-[state=off]:hover:ring-destructive",
                  "data-[state=on]:border-destructive data-[state=on]:bg-destructive/10 data-[state=on]:text-destructive",
                )
              : cn(
                  "data-[state=off]:hover:border-primary data-[state=off]:hover:ring-1 data-[state=off]:hover:ring-primary",
                  "data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary",
                ),
          )}
        >
          <span className="font-medium text-sm">{formatRange(slot)}</span>
          {selectedSlot === slot &&
            (isDestructive ? (
              <XCircleIcon className="size-4 text-destructive" />
            ) : (
              <CheckCircleIcon className="size-4 text-primary" />
            ))}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
