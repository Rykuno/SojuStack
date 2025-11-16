import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div {...props} className={cn("container mx-auto px-4 md:px-6", className)}>
      {children}
    </div>
  );
}
