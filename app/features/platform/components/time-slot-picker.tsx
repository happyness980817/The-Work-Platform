import { CheckCircleIcon } from "lucide-react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "~/common/components/ui/toggle-group";
import { cn } from "~/lib/utils";

interface TimeSlotPickerProps {
  slots: string[];
  selectedSlot: string;
  onSelect: (slot: string) => void;
}

export default function TimeSlotPicker({
  slots,
  selectedSlot,
  onSelect,
}: TimeSlotPickerProps) {
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
            "w-full justify-between px-4 py-3 rounded-md border h-auto",
            "data-[state=off]:bg-background data-[state=off]:border-border",
            "data-[state=off]:hover:border-primary data-[state=off]:hover:ring-1 data-[state=off]:hover:ring-primary",
            "data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary",
          )}
        >
          <span className="font-medium text-sm">{slot}</span>
          {selectedSlot === slot && (
            <CheckCircleIcon className="size-4 text-primary" />
          )}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
