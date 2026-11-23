import { useEffect, useRef, useState, type ReactNode } from "react";
import { Box } from "@mui/material";

interface LazyMountProps {
  children: ReactNode;
  /** Space kept free until the section loads, so the page doesn't jump. */
  minHeight?: number | { xs?: number; sm?: number; md?: number };
  /** Start loading this far before the section scrolls into view. */
  rootMargin?: string;
}

// Renders its children only when they are close to the screen.
// Sections far down the page then don't run code or fetch data on first load.
export default function LazyMount({
  children,
  minHeight = 400,
  rootMargin = "600px 0px",
}: LazyMountProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(
    typeof IntersectionObserver === "undefined"
  );

  useEffect(() => {
    if (visible) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  if (visible) return <>{children}</>;

  return <Box ref={ref} sx={{ minHeight }} aria-hidden="true" />;
}