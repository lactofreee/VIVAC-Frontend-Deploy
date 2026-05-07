import { Input as BaseInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type BaseInputProps = React.ComponentProps<typeof BaseInput>;

interface InputProps extends BaseInputProps {
  label?: string;
  errorMessage?: string;
}

export function Input({ className, label, errorMessage, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <BaseInput
        id={id}
        className={cn(errorMessage && "border-destructive", className)}
        aria-describedby={errorMessage ? `${id}-error` : undefined}
        aria-invalid={!!errorMessage}
        {...props}
      />
      {errorMessage && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
