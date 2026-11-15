import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../lib/api.js";
import { QuestDialog } from "./QuestDialog.jsx";
import { useToast } from "../hooks/useToast.js";

export function ResetDatabase() {
  const { user, invalidate } = useOutletContext();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();
  if (user?.role !== "admin") return null;
  async function reset() {
    setPending(true);
    setError("");
    try {
      await api("/api/reset", { method: "POST" });
      invalidate({ reset: true });
      setOpen(false);
      toast.success(
        "Database restored to defaults. Accounts and roles were preserved.",
        { title: "Database reset", variant: "reset" },
      );
    } catch (failure) {
      setError(failure.message);
    } finally {
      setPending(false);
    }
  }
  return (
    <section className="admin-panel" aria-labelledby="admin-heading">
      <div>
        <span className="eyebrow">ADMINISTRATOR TOOLS</span>
        <h2 id="admin-heading">A fresh start for the roadmap.</h2>
        <p>Restore the shared catalog and starter demo progress.</p>
      </div>
      <button
        className="button danger"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
      >
        Reset database
      </button>
      {open && (
        <QuestDialog
          title="Reset the shared database?"
          pending={pending}
          onClose={() => {
            if (!pending) setOpen(false);
          }}
        >
          <div className="pane-body">
            <p>
              This replaces{" "}
              <strong>all shared quests and everyone's saved progress</strong>{" "}
              with four default skill trees, twelve quests, and Alex's starter
              progress.
            </p>
            <p className="reset-warning">
              Custom quests, personal notes, repository links, and completion
              awards will be removed. GitHub accounts, roles, and sign-in
              sessions are preserved.
            </p>
            <p>
              Make a database backup before resetting data you want to keep.
            </p>
            {error && (
              <p className="inline-error" role="alert">
                {error}
              </p>
            )}
            <footer className="pane-footer">
              <button
                className="button secondary"
                disabled={pending}
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="button danger"
                disabled={pending}
                onClick={reset}
              >
                {pending ? (
                  <>
                    <span className="button-spinner" aria-hidden="true" />{" "}
                    Resetting…
                  </>
                ) : (
                  "Reset to defaults"
                )}
              </button>
            </footer>
            {pending && (
              <p role="status">Restoring the catalog. Keep this window open.</p>
            )}
          </div>
        </QuestDialog>
      )}
    </section>
  );
}
