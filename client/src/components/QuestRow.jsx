import { Icon } from "./Icon.jsx";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../lib/api.js";
import { progressKey, toastProgress } from "../lib/toastProgress.js";
import { useToast } from "../hooks/useToast.js";

const statuses = {
  completed: "Completed",
  in_progress: "In Progress",
  backlog: "Backlog",
};

export function QuestRow({ quest, index, onView }) {
  const { user, signIn, invalidate } = useOutletContext();
  const [pending, setPending] = useState(false);
  const toast = useToast();
  const [error, setError] = useState("");
  const [retryStatus, setRetryStatus] = useState(null);
  async function saveStatus(status) {
    setPending(true);
    setError("");
    setRetryStatus(status);
    toast.loading(quest.title, {
      title: "Saving status…",
      key: progressKey(quest),
    });
    try {
      const { progress } = await api(`/api/quests/${quest.id}/progress`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      toastProgress(toast, quest, quest.status, progress);
      invalidate();
    } catch (failure) {
      // The error and its retry button appear inline beside the status menu.
      toast.dismiss(progressKey(quest));
      setError(failure.message);
    } finally {
      setPending(false);
    }
  }
  return (
    <li className={`quest-row status-${quest.status}`}>
      <span className="quest-step" aria-hidden="true">
        {quest.status === "completed" ? (
          <Icon name="check" size={18} />
        ) : (
          String(index + 1).padStart(2, "0")
        )}
      </span>
      <div className="quest-content">
        <div className="quest-meta">
          <span className={`difficulty difficulty-${quest.difficulty}`}>
            {quest.difficulty}
          </span>
          <span className="xp-reward">
            <Icon name="bolt" size={13} /> {quest.xp_reward} XP
          </span>
        </div>
        <h3>{quest.title}</h3>
        <p>{quest.description}</p>
        <div className="quest-bottom">
          <div className="tag-list">
            {quest.tech_stack_tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <span className={`status-badge ${quest.status}`}>
            <span />
            {statuses[quest.status]}
          </span>
        </div>
        <div className="quest-actions">
          <button
            className="text-button"
            onClick={(event) => onView(quest.id, event.currentTarget)}
          >
            View quest <Icon name="arrow" size={14} />
          </button>
          {user ? (
            <label className="status-control">
              My status
              <select
                aria-label={`My status for ${quest.title}`}
                value={quest.status}
                disabled={pending}
                onChange={(event) => saveStatus(event.target.value)}
              >
                {Object.entries(statuses)
                  .reverse()
                  .map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
              </select>
              {pending && <span role="status">Saving…</span>}
            </label>
          ) : (
            <button className="text-button" onClick={signIn}>
              Sign in to track
            </button>
          )}
        </div>
        {error && (
          <p role="alert" className="inline-error">
            {error}{" "}
            <button
              className="text-button"
              disabled={pending}
              onClick={() => saveStatus(retryStatus)}
            >
              Retry status save
            </button>
          </p>
        )}
      </div>
    </li>
  );
}
