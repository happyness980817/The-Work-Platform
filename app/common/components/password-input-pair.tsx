import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function PasswordInputPair({
  label,
  description,
  ...rest
}: {
  label: string;
  description: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-2 flex flex-col">
      <Label htmlFor={rest.id} className="flex flex-col gap-1 items-start text-left">
        {label}
        {description && <small className="text-muted-foreground">{description}</small>}
      </Label>
      <div className="relative">
        <Input type={visible ? "text" : "password"} className="pr-10" {...rest} />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          tabIndex={-1}
        >
          {visible ? (
            <EyeOffIcon className="size-4" />
          ) : (
            <EyeIcon className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}
