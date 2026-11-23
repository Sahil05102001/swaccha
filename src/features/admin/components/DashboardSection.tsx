import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Box, Skeleton } from "@mui/material";

type Height =
  | number
  | Partial<Record<"xs" | "sm" | "md" | "lg" | "xl", number>>;

interface Props {
  children: ReactNode;
  /**
   * Height of the grey placeholder shown only BEFORE the section loads.
   * Once it has loaded, the section takes exactly the space its content needs.
   */
  placeholderHeight?: Height;
}

/**
 * Loads its content (code and data) only when the section is about to
 * scroll into view. Reserves no space after loading.
 */
export default function DashboardSection({
  children,
  placeholderHeight = 260,
}: Props) {
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

  const placeholder = (
    <Skeleton
      variant="rounded"
      role="status"
      aria-label="Loading section"
      sx={{ height: placeholderHeight, borderRadius: "14px" }}
    />
  );

  return (
    <Box ref={ref}>
      {visible ? <Suspense fallback={placeholder}>{children}</Suspense> : placeholder}
    </Box>
  );
}