import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Box, CircularProgress } from "@mui/material";

interface LazySectionProps {
  children: ReactNode;
  /** Reserved height, so the page doesn't jump when the section appears. */
  minHeight?: number;
}

/**
 * Renders its children (and starts their data fetching and code download)
 * only when the section is about to scroll into view.
 */
export default function LazySection({
  children,
  minHeight = 260,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <Box ref={ref} data-lazy sx={{ minHeight }}>
      {visible && (
        <Suspense
          fallback={
            <Box
              sx={{
                minHeight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={24} aria-label="Loading section" />
            </Box>
          }
        >
          {children}
        </Suspense>
      )}
    </Box>
  );
}