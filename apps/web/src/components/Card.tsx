import {
  Card as BaseCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type BaseCardProps = React.ComponentProps<typeof BaseCard>;

interface CardProps extends BaseCardProps {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <BaseCard className={cn("rounded-2xl shadow-sm", className)} {...props}>
      {children}
    </BaseCard>
  );
}

export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardAction };
