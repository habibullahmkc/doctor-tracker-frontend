import { useCallback, useRef } from "react";

/**
 * Controlled dialogs (opened from a button or a row menu, without a Radix
 * Trigger) lose focus to <body> when they close. Remember what had focus when
 * the dialog opened and put focus back there, so keyboard users keep their place.
 */
export function useRestoreFocus() {
  const previous = useRef<HTMLElement | null>(null);

  const onOpenAutoFocus = useCallback(() => {
    previous.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }, []);

  const onCloseAutoFocus = useCallback((event: Event) => {
    const target = previous.current;
    if (target?.isConnected) {
      event.preventDefault();
      target.focus();
    }
  }, []);

  return { onOpenAutoFocus, onCloseAutoFocus };
}
