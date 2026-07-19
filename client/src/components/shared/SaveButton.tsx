import { Bookmark } from "lucide-react";
import { cn } from "../../lib/utils";

export function SaveButton({
  saved,
  onClick,
  label = "Save",
}: {
  saved: boolean;
  onClick: (e: React.MouseEvent) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(e);
      }}
      aria-pressed={saved}
      className={cn(
        "inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs uppercase tracking-wide font-medium transition-colors",
        saved
          ? "border-navy bg-navy text-paper"
          : "border-hairline-strong text-ink-soft hover:border-navy hover:text-navy"
      )}
    >
      <Bookmark size={13} className={saved ? "fill-current" : ""} />
      {saved ? "Saved" : label}
    </button>
  );
}
