import { cn } from "@/lib/utils";
import { useEnquiryFormTranslations } from "../i18n";

interface EmailHintProps {
  /**
   * The suggested corrected email address
   */
  suggestion: string;
  /**
   * Callback when user accepts the suggestion
   */
  onAccept: (correctedEmail: string) => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function EmailHint({ suggestion, onAccept, className }: EmailHintProps) {
  const t = useEnquiryFormTranslations();

  return (
    <div
      className={cn(
        "text-muted-foreground absolute top-full left-0 mt-1 text-xs",
        className,
      )}
    >
      {t.form.emailSuggestion}{" "}
      <button
        type="button"
        onClick={() => onAccept(suggestion)}
        className="text-primary hover:underline cursor-pointer font-medium"
      >
        {suggestion}
      </button>
      ?
    </div>
  );
}
