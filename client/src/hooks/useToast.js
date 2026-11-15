import { createContext, useContext, useLayoutEffect } from "react";

export const ToastContext = createContext(null);

// Returns { success(message), error(message) }.
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context.toast;
}

// Modal dialogs make the rest of the page inert, so an open dialog registers
// itself as the place where toasts render until it closes.
export function useToastHost(ref) {
  const { registerHost } = useContext(ToastContext) ?? {};
  useLayoutEffect(() => {
    if (registerHost && ref.current) return registerHost(ref.current);
  }, [registerHost, ref]);
}
