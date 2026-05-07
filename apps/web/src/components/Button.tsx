import { Button as BaseButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BaseButtonProps = React.ComponentProps<typeof BaseButton>;

interface ButtonProps extends BaseButtonProps {
  fullWidth?: boolean;
}

export function Button({ className, fullWidth, ...props }: ButtonProps) {
  return (
    <BaseButton className={cn(fullWidth && "w-full", className)} {...props} />
  );
}
