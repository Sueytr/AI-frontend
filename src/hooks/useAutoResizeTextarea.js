import { useLayoutEffect } from "react";

/** Grows a textarea to fit its content, up to the CSS max-height (which
 * then takes over and shows a scrollbar). */
export function useAutoResizeTextarea(ref, value) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [ref, value]);
}
