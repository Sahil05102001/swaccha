/** Scrolls the page (and, optionally, a dialog's content area) back to the top. */
export function scrollToTop(container?: HTMLElement | null) {
  container?.scrollTo({ top: 0 });
  window.scrollTo({ top: 0 });
}