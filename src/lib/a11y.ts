import type { KeyboardEvent } from "react";

/**
 * Keyboard activation for non-button elements that act as buttons
 * (drop zones, click-to-copy rows). Use with role="button" and tabIndex={0}:
 * Enter or Space triggers the element's own click handler.
 */
export function activateOnKey(e: KeyboardEvent<HTMLElement>) {
  // Ignore keys coming from controls nested inside the element.
  if (e.target !== e.currentTarget) return;
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    e.currentTarget.click();
  }
}
