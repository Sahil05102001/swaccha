import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Scrolls to the top when the user goes to a different page.
 *
 * It deliberately does nothing when:
 * - only the query string changes (typing in the navbar search on the
 *   products page updates ?search=... and must not jump the page),
 * - the link points to an anchor such as #reviews,
 * - the user presses the browser Back / Forward button, so the browser can
 *   put them back where they were.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return;

    previousPathname.current = pathname;

    if (navigationType === "POP" || hash) return;

    // "instant" skips any smooth-scroll animation set in the site's CSS.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash, navigationType]);

  return null;
}