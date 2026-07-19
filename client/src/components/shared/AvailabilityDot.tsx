import type { AvailabilityStatus } from "../../types";
import { availabilityLabel, availabilityDot, cn } from "../../lib/utils";

export function AvailabilityDot({
  status,
  showLabel = true,
}: {
  status: AvailabilityStatus;
  showLabel?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink-soft">
      <span className={cn("h-1.5 w-1.5 rounded-full", availabilityDot[status])} />
      {showLabel && availabilityLabel[status]}
    </span>
  );
}
