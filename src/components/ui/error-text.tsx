import { cn } from "@/lib/utils";

interface ErrorTextProps {
  /**
   * The error message to display
   */
  message?: string | null;
  /**
   * The variant of the error text
   * - "field": For inline field validation errors (small, positioned below input)
   * - "banner": For general error messages (larger, with background)
   */
  variant?: "field" | "banner";
  /**
   * Additional CSS classes to apply
   */
  className?: string;
  /**
   * Whether to show the error text
   */
  show?: boolean;
}

export function ErrorText({
  message,
  variant = "field",
  className,
  show = true,
}: ErrorTextProps) {
  // Don't render if no message or show is false
  if (!message || !show) {
    return null;
  }

  if (variant === "banner") {
    return (
      <div
        className={cn(
          "bg-destructive/10 border-destructive/20 rounded-none border p-4",
          className,
        )}
      >
        <p className="text-destructive text-sm">{message}</p>
      </div>
    );
  }

  // Default field variant
  return (
    <div
      className={cn(
        "text-destructive absolute top-full left-0 mt-0 text-xs",
        className,
      )}
    >
      {message}
    </div>
  );
}
