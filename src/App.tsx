import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import { warmBackend } from "@/lib/backendWarmup";

function App() {
  // Wake the backend once the page is idle, so it is ready before checkout.
  useEffect(() => {
    // Older browsers (e.g. some Safari versions) have no requestIdleCallback.
    const idleWindow = window as Window & {
      requestIdleCallback?: (
        callback: () => void,
        options?: { timeout: number },
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (idleWindow.requestIdleCallback) {
      const id = idleWindow.requestIdleCallback(warmBackend, {
        timeout: 3000,
      });
      return () => idleWindow.cancelIdleCallback?.(id);
    }

    const timer = globalThis.setTimeout(warmBackend, 1500);
    return () => globalThis.clearTimeout(timer);
  }, []);

  return <RouterProvider router={router} />;
}

export default App;