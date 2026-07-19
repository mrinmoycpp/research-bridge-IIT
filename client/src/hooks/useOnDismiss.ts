import { useEffect, type RefObject } from "react";

export function useOnDismiss(
  ref: RefObject<HTMLElement | null>,
  onDismiss: () => void,
  active = true
) {
  useEffect(() => {
    if (!active) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onDismiss();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onDismiss();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [ref, onDismiss, active]);
}
