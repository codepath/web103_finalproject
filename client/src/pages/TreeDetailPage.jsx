import { useEffect, useRef, useState } from "react";
import {
  Link,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useApiResource } from "../hooks/useApiResource.js";
import { Icon } from "../components/Icon.jsx";
import { treeTheme } from "../lib/treeTheme.js";
import { ProgressBar } from "../components/ProgressBar.jsx";
import { QuestRow } from "../components/QuestRow.jsx";
import { useToast } from "../hooks/useToast.js";
import { QUEST_SAVE } from "../lib/toastKeys.js";
import { QuestForm } from "../components/QuestForm.jsx";
import { QuestDetails } from "../components/QuestDetails.jsx";
import { QuestFilters } from "../components/QuestFilters.jsx";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../components/Feedback.jsx";

export function TreeDetailPage() {
  const { id } = useParams();
  const { user, signIn, invalidate, resetRevision } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const linkedQuestId = searchParams.get("quest");
  const backLink = useRef(null);
  const defaults = { difficulty: "all", status: "all", sort: "roadmap" };
  const [filters, setFilters] = useState(defaults);
  const [linkError, setLinkError] = useState("");
  const [pane, setPane] = useState(null);
  const toast = useToast();
  const progress = useApiResource("/api/me/progress", {
    enabled: Boolean(user),
  });
  function saved(message, title, variant) {
    closePane();
    toast.success(message, { title, variant, key: QUEST_SAVE });
    invalidate();
  }
  function closePane() {
    setPane(null);
    if (linkedQuestId !== null) {
      const next = new URLSearchParams(searchParams);
      next.delete("quest");
      setSearchParams(next, { replace: true });
    }
  }
  const { data, loading, error, retry } = useApiResource(
    `/api/trees/${encodeURIComponent(id)}`,
  );
  useEffect(() => {
    setFilters({ difficulty: "all", status: "all", sort: "roadmap" });
    setPane(null);
    setLinkError("");
  }, [id, resetRevision, user?.id]);
  useEffect(() => {
    if (!data || linkedQuestId === null) return;
    const quest = data.quests.find((item) => String(item.id) === linkedQuestId);
    if (quest) {
      setLinkError("");
      setPane({
        mode: "details",
        questId: quest.id,
        trigger: backLink.current,
      });
    } else {
      setPane(null);
      setLinkError(
        "That quest is no longer in this skill tree. You can continue with the roadmap below.",
      );
    }
  }, [data, linkedQuestId]);
  useEffect(() => {
    document.title = data
      ? `${data.tree.title} · SkillForge`
      : "Skill tree · SkillForge";
  }, [data]);
  if (loading) return <LoadingState />;
  if (error && !data) return <ErrorState error={error} retry={retry} />;
  const { tree, quests } = data;
  const visibleQuests = quests
    .filter(
      (quest) =>
        (filters.difficulty === "all" ||
          quest.difficulty === filters.difficulty) &&
        (!user || filters.status === "all" || quest.status === filters.status),
    )
    .sort((a, b) => {
      if (filters.sort === "xp")
        return b.xp_reward - a.xp_reward || a.id - b.id;
      if (filters.sort === "title")
        return a.title.localeCompare(b.title) || a.id - b.id;
      return a.position - b.position || a.id - b.id;
    });
  const theme = treeTheme(tree.id);
  return (
    <div className={`detail-page theme-${theme.color}`}>
      <Link to="/" className="back-link" ref={backLink}>
        <Icon name="back" size={16} /> All skill trees
      </Link>
      {linkError && (
        <p className="inline-error" role="alert">
          {linkError}{" "}
          <button
            className="text-button"
            onClick={() => {
              closePane();
              setLinkError("");
            }}
          >
            Dismiss
          </button>
        </p>
      )}
      {error && <ErrorState error={error} retry={retry} />}
      <section className="detail-hero">
        <div>
          <span className="eyebrow">
            <Icon name={theme.icon} size={17} /> {theme.category}
          </span>
          <h1>{tree.title}</h1>
          <p>{tree.description}</p>
          <div className="detail-meta">
            <span>
              <Icon name="book" size={15} /> {quests.length} quests
            </span>
            <span>
              <Icon name="bolt" size={15} />{" "}
              {quests.reduce((total, quest) => total + quest.xp_reward, 0)} XP
              to explore
            </span>
          </div>
        </div>
        <div className="detail-progress">
          <span className="small-label">YOUR TRACK PROGRESS</span>
          {user && (
            <span className="earned-xp" aria-label="Total earned XP">
              {progress.data?.summary.total_xp ?? "…"} XP earned
            </span>
          )}
          {progress.error && (
            <button className="text-button" onClick={progress.retry}>
              Retry XP summary
            </button>
          )}
          <strong>
            {tree.completed_count}
            <span> / {tree.quest_count}</span>
          </strong>
          <span className="progress-caption">
            {tree.quest_count ? "quests completed" : "No quests yet"}
          </span>
          <ProgressBar
            completed={tree.completed_count}
            total={tree.quest_count}
            label="Track completion"
          />
        </div>
      </section>
      <div className="detail-columns">
        <section aria-labelledby="quests-heading">
          <div className="section-heading quest-heading">
            <div>
              <span className="eyebrow">BUILD WITH INTENTION</span>
              <h2 id="quests-heading">The quest roadmap</h2>
            </div>
            <button
              className="button secondary"
              onClick={(event) =>
                user
                  ? setPane({ mode: "create", trigger: event.currentTarget })
                  : signIn()
              }
            >
              <span aria-hidden="true">+</span> Forge Quest
            </button>
          </div>
          <QuestFilters
            value={filters}
            onChange={setFilters}
            canTrack={Boolean(user)}
            count={visibleQuests.length}
            total={quests.length}
            onClear={() => setFilters(defaults)}
          />
          {quests.length ? (
            visibleQuests.length ? (
              <ol className="quest-list">
                {visibleQuests.map((quest) => (
                  <QuestRow
                    key={quest.id}
                    quest={quest}
                    index={quests.findIndex((item) => item.id === quest.id)}
                    onView={(questId, trigger) =>
                      setPane({ mode: "details", questId, trigger })
                    }
                  />
                ))}
              </ol>
            ) : (
              <div className="filtered-empty">
                <EmptyState title="No quests match these filters.">
                  Try a different difficulty or status.
                </EmptyState>
                <button
                  className="button secondary"
                  onClick={() => setFilters(defaults)}
                >
                  Show all quests
                </button>
              </div>
            )
          ) : (
            <EmptyState title="A fresh canvas.">
              This track has no quests yet. Explore another tree while this
              roadmap takes shape.
            </EmptyState>
          )}
        </section>
        <aside className="guidance">
          <div className="guidance-heading">
            <Icon name="branch" size={22} />
            <h2>Before you begin</h2>
          </div>
          <p>
            Good foundations help. These are suggestions, never locked doors.
          </p>
          {quests.length > 0 && (
            <ul>
              {quests
                .filter((quest) => quest.prerequisite_notes)
                .map((quest) => (
                  <li key={quest.id}>
                    <strong>{quest.title}</strong>
                    <p>{quest.prerequisite_notes}</p>
                  </li>
                ))}
            </ul>
          )}
          <div className="guidance-footer">
            <Icon name="bolt" size={16} />
            <span>
              Follow your curiosity.
              <br />
              Build at your own pace.
            </span>
          </div>
        </aside>
      </div>
      {pane &&
        (pane.mode === "details" ? (
          <QuestDetails
            key={pane.questId}
            questId={pane.questId}
            restoreFocusTo={pane.trigger}
            onClose={closePane}
            onEdit={(quest) =>
              setPane({ mode: "edit", quest, trigger: pane.trigger })
            }
            onSaved={saved}
          />
        ) : (
          <QuestForm
            quest={pane.quest}
            treeId={tree.id}
            restoreFocusTo={pane.trigger}
            onClose={closePane}
            onSaved={saved}
          />
        ))}
    </div>
  );
}
