import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ToastContext } from "../hooks/useToast.js";

// Loading toasts stay until a result toast with the same key replaces them.
const DURATION = { success: 3500, error: 6000, xp: 4000, loading: Infinity };
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
  // Time left per toast, by id: { rev, ms }. Kept outside the toast so it
  // survives a toast moving between page and dialog.
  const clock = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((current) =>
      current.map((toast) =>
        toast.id === id ? { ...toast, leaving: true } : toast,
      ),
    );
    setTimeout(() => {
      clock.current.delete(id);
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, EXIT_MS);
  }, []);

  // A toast with the same `key` as a visible one updates it in place, so a
  // "Saving…" toast turns into its result and repeated updates to one quest
  // show only the latest.
  const show = useCallback((type, message, options = {}) => {
    const { title, xp, key, action } = options;
    const variant =
      options.variant ??
      (type === "error" ? "error" : type === "loading" ? "loading" : "success");
    const rev = ++nextId.current;
    const fields = { type, variant, title, message, xp, action, rev };
    setToasts((current) => {
      const match =
        key === undefined
          ? undefined
          : current.find((toast) => toast.key === key && !toast.leaving);
      if (match) {
        clock.current.set(match.id, { rev, ms: DURATION[type] });
        return current.map((toast) =>
          toast === match ? { ...toast, ...fields } : toast,
        );
      }
      clock.current.set(rev, { rev, ms: DURATION[type] });
      return [...current, { id: rev, key, ...fields }].slice(-MAX_VISIBLE);
    });
  }, []);

  // Removes the toast with this key, e.g. a "Saving…" toast whose save failed
  // with an error that is shown inline instead.
  const dismissKey = useCallback((key) => {
    const matches = (toast) => toast.key === key;
    setToasts((current) =>
      current.map((toast) =>
        matches(toast) ? { ...toast, leaving: true } : toast,
      ),
    );
    setTimeout(
      () =>
        setToasts((current) =>
          current.filter((toast) => !(matches(toast) && toast.leaving)),
        ),
      EXIT_MS,
    );
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
      loading: (message, options) => show("loading", message, options),
      dismiss: dismissKey,
    }),
    [show, dismissKey],
  );
  const value = useMemo(() => ({ toast, registerHost }), [toast, registerHost]);
  const host = hosts.at(-1);
  const region = (items) => (
    <ToastRegion toasts={items} clock={clock} onDismiss={dismiss} />
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {region(host ? [] : toasts)}
      {host && createPortal(region(toasts), host)}
    </ToastContext.Provider>
  );
}

function ToastRegion({ toasts, clock, onDismiss }) {
  return (
    <section
      className="toast-region"
      aria-label="Notifications"
      aria-live="polite"
      aria-relevant="additions text"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          clock={clock}
          onDismiss={onDismiss}
        />
      ))}
    </section>
  );
}

function ToastItem({ toast, clock, onDismiss }) {
  const { id, rev, type, variant, title, message, xp, action, leaving } =
    toast;
  const [paused, setPaused] = useState(false);

  // Auto-dismiss, pausing while the pointer or keyboard focus is on the toast.
  // `rev` restarts the countdown when the toast is updated in place.
  useEffect(() => {
    const times = clock.current;
    const entry = times.get(id);
    if (paused || leaving || !entry || !Number.isFinite(entry.ms)) return;
    const started = Date.now();
    const timer = setTimeout(() => onDismiss(id), entry.ms);
    return () => {
      clearTimeout(timer);
      const latest = times.get(id);
      if (latest?.rev === entry.rev)
        latest.ms = Math.max(0, latest.ms - (Date.now() - started));
    };
  }, [paused, leaving, id, rev, clock, onDismiss]);

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
      <ToastMark key={variant} variant={variant} />
      <div className="toast-body">
        {(title || type === "xp") && (
          <div className="toast-heading">
            {title && <strong className="toast-title">{title}</strong>}
            {type === "xp" && <span className="toast-xp-badge">+{xp} XP</span>}
          </div>
        )}
        <p>{message}</p>
      </div>
      {action && (
        <button
          className="toast-action"
          onClick={() => {
            onDismiss(id);
            action.onClick();
          }}
        >
          {action.label}
        </button>
      )}
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

// A circle that fills in, then the variant's icon draws itself. While loading,
// an arc spins around the circle instead.
function ToastMark({ variant }) {
  if (variant === "loading")
    return (
      <svg
        className="toast-mark toast-spinner"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle className="toast-spinner-track" cx="12" cy="12" r="9" />
        <circle className="toast-spinner-arc" cx="12" cy="12" r="9" />
      </svg>
    );
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
