export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "k";
  return String(n);
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function catalogNumber(index: number, prefix = "REC"): string {
  return `${prefix}-${String(index + 1).padStart(4, "0")}`;
}

export const availabilityLabel: Record<string, string> = {
  open: "Open for students",
  limited: "Limited capacity",
  closed: "Not currently taking students",
};

export const availabilityDot: Record<string, string> = {
  open: "bg-[#3f6b4a]",
  limited: "bg-brass",
  closed: "bg-stone-light",
};
