import type { LucideIcon } from "lucide-react";
import { SearchX } from "lucide-react";

export function LoadingRows({ count = 5 }: { count?: number }) {
  return (
    <div className="divide-y divide-hairline">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-5 py-6">
          <div className="h-20 w-20 shrink-0 animate-pulse bg-hairline" />
          <div className="flex-1 space-y-3">
            <div className="h-3 w-1/3 animate-pulse bg-hairline" />
            <div className="h-2.5 w-1/2 animate-pulse bg-hairline" />
            <div className="h-2.5 w-2/3 animate-pulse bg-hairline" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="aspect-[4/3] w-full animate-pulse bg-hairline" />
          <div className="h-3 w-2/3 animate-pulse bg-hairline" />
          <div className="h-2.5 w-1/2 animate-pulse bg-hairline" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-hairline-strong px-8 py-20 text-center">
      <Icon size={28} strokeWidth={1.25} className="mb-4 text-stone-light" />
      <h3 className="font-display text-xl text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-stone">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
