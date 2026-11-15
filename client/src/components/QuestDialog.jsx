import { useEffect, useId, useRef } from "react";
import { useToastHost } from "../hooks/useToast.js";

export function QuestDialog({
  title,
  onClose,
  children,
  pending = false,
  restoreFocusTo,
}) {
  const dialog = useRef(null);
  const close = useRef(onClose);
  const titleId = useId();
  useToastHost(dialog);
  useEffect(() => {
    close.current = onClose;
  }, [onClose]);
  useEffect(() => {
    const element = dialog.current;
    const trigger = restoreFocusTo ?? document.activeElement;
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus();
    };
  }, [restoreFocusTo]);
  return (
    <dialog
      className="quest-dialog"
      ref={dialog}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!pending) close.current();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !pending) {
          const box = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom
          )
            close.current();
        }
      }}
    >
      <header className="pane-heading">
        <div>
          <span className="eyebrow">YOUR NEXT MILESTONE</span>
          <h2 id={titleId}>{title}</h2>
        </div>
        <button
          className="pane-close"
          aria-label="Close pane"
          onClick={onClose}
          disabled={pending}
        >
          ×
        </button>
      </header>
      {children}
    </dialog>
  );
}
