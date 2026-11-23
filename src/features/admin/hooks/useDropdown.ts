import { useCallback, useEffect, useState } from "react";

// Anything inside these is the dropdown's own list: scrolling it must not close it.
const INSIDE = ".MuiPopover-paper, .MuiAutocomplete-popper";

/**
 * Open/close state for an admin dropdown that also closes as soon as the page
 * is scrolled, wheeled or touch-dragged outside it.
 */
export function useDropdown() {
  const [open, setOpen] = useState(false);

  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const close = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest?.(INSIDE)) return;
      setOpen(false);
    };

    const options = { capture: true, passive: true } as const;

    window.addEventListener("scroll", close, options);
    window.addEventListener("wheel", close, options);
    window.addEventListener("touchmove", close, options);
    window.addEventListener("resize", close);

    return () => {
      window.removeEventListener("scroll", close, options);
      window.removeEventListener("wheel", close, options);
      window.removeEventListener("touchmove", close, options);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return { open, onOpen, onClose };
}