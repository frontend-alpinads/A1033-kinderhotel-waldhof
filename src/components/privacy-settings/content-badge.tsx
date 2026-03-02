import { cn } from "@/lib/utils";

interface ContentBadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary";
}

export function ContentBadge({
  children,
  className,
  variant = "default",
}: ContentBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-normal transition-colors",
        {
          "bg-gray-100 text-gray-800 hover:bg-gray-200": variant === "default",
          "border border-gray-300 text-gray-700 hover:bg-gray-50":
            variant === "outline",
          "bg-blue-100 text-blue-800 hover:bg-blue-200":
            variant === "secondary",
        },
        className,
      )}
    >
      {children}
    </span>
  );
}
