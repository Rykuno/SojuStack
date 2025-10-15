import { cn } from "~/lib/utils";

export default function Container({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("container mx-auto px-4 md:px-6", className)} {...props}>
      {children}
    </div>
  );
}
