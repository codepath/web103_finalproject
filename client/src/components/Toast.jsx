import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ToastContext } from "../hooks/useToast.js";

const DURATION = { success: 3500, error: 6000, xp: 4000 };
const EXIT_MS = 220;
const MAX_VISIBLE = 3;

// Each variant has its own icon (errors are also red; see .tone-* in
// styles.css). The icon draws itself inside a filled circle.
const ICONS = {
  success: "m6.8 12.4 3.4 3.4 7-7.4",
  completed: "m6.8 12.4 3.4 3.4 7-7.4",
  progress: "M12 6.8V12l3.6 2.2",
  backlog: "M7.5 8.8h9M7.5 12h9M7.5 15.2h5.5",
  forge: "M12 7v10M7 12h10",
  edit: "m14.2 7.3 2.5 2.5-6.9 6.9H7.3v-2.5zM12.6 8.9l2.5 2.5",
  delete: "M7.5 8.7h9M10 8.7V7.2h4v1.5M8.8 8.7l.6 8.1h5.2l.6-8.1",
  reset: "M16.6 9.6a5 5 0 1 0 .4 3.4M17 6.6v3.1h-3.1",
  signout: "M10.5 12h7m-2.6-2.7 2.6 2.7-2.6 2.7M12.5 7.3H7.5v9.4h5",
  error: "M12 6.5v7M12 17v.5",
};

// Modal <dialog>s make the rest of the page inert, so toasts render inside the
// topmost open dialog (registered via useToastHost) or at the page level.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [hosts, setHosts] = useState([]);
  const nextId = useRef(0);
  // Time left per toast survives a toast moving between page and dialog.
  const remaining = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((current) =>
      current.map((toast) =>
        toast.id === id ? { ...toast, leaving: true } : toast,
      ),
    );
    setTimeout(() => {
      remaining.current.delete(id);
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, EXIT_MS);
  }, []);

  // A toast with the same `key` as a visible one replaces it, so repeated
  // updates to one thing (e.g. a quest's status) show only the latest.
  const show = useCallback((type, message, options = {}) => {
    const { title, xp, key } = options;
    const variant = options.variant ?? (type === "error" ? "error" : "success");
    const id = ++nextId.current;
    remaining.current.set(id, DURATION[type]);
    setToasts((current) => {
      const kept = current.filter((toast) => {
        const replaced = key !== undefined && toast.key === key;
        if (replaced) remaining.current.delete(toast.id);
        return !replaced;
      });
      return [...kept, { id, key, type, variant, title, message, xp }].slice(
        -MAX_VISIBLE,
      );
    });
  }, []);

  const registerHost = useCallback((element) => {
    setHosts((current) => [...current, element]);
    return () =>
      setHosts((current) => current.filter((host) => host !== element));
  }, []);

  const toast = useMemo(
    () => ({
      success: (message, options) => show("success", message, options),
      error: (message, options) => show("error", message, options),
      xp: (xp, message, options) => show("xp", message, { ...options, xp }),
    }),
    [show],
  );
  const value = useMemo(() => ({ toast, registerHost }), [toast, registerHost]);
  const host = hosts.at(-1);
  const region = (items) => (
    <ToastRegion toasts={items} remaining={remaining} onDismiss={dismiss} />
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {region(host ? [] : toasts)}
      {host && createPortal(region(toasts), host)}
    </ToastContext.Provider>
  );
}

function ToastRegion({ toasts, remaining, onDismiss }) {
  return (
    <section
      className="toast-region"
      aria-label="Notifications"
      aria-live="polite"
      aria-relevant="additions"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          remaining={remaining}
          onDismiss={onDismiss}
        />
      ))}
    </section>
  );
}

function ToastItem({ toast, remaining, onDismiss }) {
  const { id, type, variant, title, message, xp, leaving } = toast;
  const [paused, setPaused] = useState(false);
  const total = DURATION[type];

  // Auto-dismiss, pausing while the pointer or keyboard focus is on the toast.
  useEffect(() => {
    if (paused || leaving) return;
    const clock = remaining.current;
    const started = Date.now();
    const timer = setTimeout(() => onDismiss(id), clock.get(id) ?? total);
    return () => {
      clearTimeout(timer);
      if (clock.has(id))
        clock.set(id, Math.max(0, clock.get(id) - (Date.now() - started)));
    };
  }, [paused, leaving, id, total, remaining, onDismiss]);

  const pause = () => setPaused(true);
  const resume = () => setPaused(false);
  return (
    <div
      className={`toast tone-${variant}${leaving ? " is-leaving" : ""}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <ToastMark variant={variant} />
      <div className="toast-body">
        {(title || type === "xp") && (
          <div className="toast-heading">
            {title && <strong className="toast-title">{title}</strong>}
            {type === "xp" && <span className="toast-xp-badge">+{xp} XP</span>}
          </div>
        )}
        <p>{message}</p>
      </div>
      <button
        className="toast-close"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(id)}
      >
        ×
      </button>
    </div>
  );
}

// A circle that fills in, then the variant's icon draws itself.
function ToastMark({ variant }) {
  return (
    <svg className="toast-mark" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="toast-mark-circle" cx="12" cy="12" r="11" />
      <path
        className="toast-mark-symbol"
        pathLength="1"
        d={ICONS[variant] ?? ICONS.success}
      />
    </svg>
  );
}
