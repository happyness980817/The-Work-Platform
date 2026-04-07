import { useState } from "react";
import { XIcon, ChevronsUpDownIcon } from "lucide-react";
import { Label } from "~/common/components/ui/label";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import { Checkbox } from "~/common/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/common/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SelectPairProps {
  name: string;
  required: boolean;
  label: string;
  description: string;
  placeholder: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  multiple?: boolean;
  defaultValues?: string[];
}

export default function SelectPair({
  name,
  required,
  label,
  description,
  placeholder,
  options,
  defaultValue,
  multiple,
  defaultValues,
}: SelectPairProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(defaultValues ?? []);

  const toggleValue = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const removeValue = (value: string) => {
    setSelected((prev) => prev.filter((v) => v !== value));
  };

  if (multiple) {
    return (
      <div className="space-y-2 flex flex-col w-full">
        <Label className="flex flex-col gap-1 items-start text-left">
          {label}
          <small className="text-muted-foreground">{description}</small>
        </Label>
        {/* hidden inputs for form submission */}
        {selected.map((v) => (
          <input key={v} type="hidden" name={name} value={v} />
        ))}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full font-normal h-auto min-h-9 px-3 py-2 justify-start flex-wrap"
            >
              {selected.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-1 w-full">
                    {selected.map((v) => {
                      const opt = options.find((o) => o.value === v);
                      return (
                        <Badge
                          key={v}
                          variant="secondary"
                          className="gap-1 pr-1"
                        >
                          {opt?.label ?? v}
                          <span
                            role="button"
                            tabIndex={0}
                            className="rounded-full hover:bg-muted-foreground/20 p-0.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeValue(v);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.stopPropagation();
                                removeValue(v);
                              }
                            }}
                          >
                            <XIcon className="size-3" />
                          </span>
                        </Badge>
                      );
                    })}
                  </div>
                  <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50 ml-auto" />
                </>
              ) : (
                <>
                  <span className="text-muted-foreground">{placeholder}</span>
                  <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50 ml-auto" />
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-(--radix-popover-trigger-width) p-2">
            <div className="flex flex-col gap-1">
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-accent"
                >
                  <Checkbox
                    checked={selected.includes(option.value)}
                    onCheckedChange={() => toggleValue(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className="space-y-2 flex flex-col w-full">
      <Label className="flex flex-col gap-1" onClick={() => setOpen(!open)}>
        {label}
        <small className="text-muted-foreground">{description}</small>
      </Label>
      <Select
        open={open}
        onOpenChange={setOpen}
        name={name}
        required={required}
        defaultValue={defaultValue}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
