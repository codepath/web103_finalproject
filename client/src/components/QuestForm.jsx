import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useApiResource } from "../hooks/useApiResource.js";
import { api } from "../lib/api.js";
import { QuestDialog } from "./QuestDialog.jsx";
import { useToast } from "../hooks/useToast.js";
import { QUEST_SAVE } from "../lib/toastKeys.js";

function initialForm(quest, treeId) {
  return {
    title: quest?.title ?? "",
    skill_tree_id: String(quest?.skill_tree_id ?? treeId),
    description: quest?.description ?? "",
    requirements: quest?.requirements ?? "",
    difficulty: quest?.difficulty ?? "beginner",
    xp_reward: quest?.xp_reward ?? "",
    position: quest?.position ?? "",
    prerequisite_notes: quest?.prerequisite_notes ?? "",
    tech_stack_tags: quest?.tech_stack_tags.join(", ") ?? "",
    documentation_urls: quest?.documentation_urls.join("\n") ?? "",
  };
}
export function QuestForm({ quest, treeId, onClose, onSaved, restoreFocusTo }) {
  const { signIn } = useOutletContext();
  const toast = useToast();
  const { data, error: treesError, retry } = useApiResource("/api/trees");
  const [initial] = useState(() => initialForm(quest, treeId));
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);
  const [pending, setPending] = useState(false);
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const close = () => {
    if (
      !pending &&
      (!dirty || window.confirm("Discard your unsaved quest changes?"))
    )
      onClose();
  };
  function field(name, label, kind = "input", props = {}) {
    const Tag = kind;
    return (
      <div
        className={`form-field ${["description", "requirements", "documentation_urls", "prerequisite_notes"].includes(name) ? "wide" : ""}`}
      >
        <label htmlFor={`quest-${name}`}>{label}</label>
        <Tag
          id={`quest-${name}`}
          name={name}
          value={form[name]}
          onChange={(event) => setForm({ ...form, [name]: event.target.value })}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `error-${name}` : undefined}
          {...props}
        />
        {errors[name] && (
          <small id={`error-${name}`} className="field-error">
            {errors[name]}
          </small>
        )}
      </div>
    );
  }
  async function save(event) {
    event.preventDefault();
    const payload = {
      ...form,
      skill_tree_id: Number(form.skill_tree_id),
      xp_reward: Number(form.xp_reward),
      position: Number(form.position),
      tech_stack_tags: form.tech_stack_tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      documentation_urls: form.documentation_urls
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    };
    const invalid = {};
    for (const name of ["title", "description", "requirements"])
      if (!form[name].trim()) invalid[name] = "This field is required.";
    for (const name of ["xp_reward", "position"])
      if (
        form[name] === "" ||
        !Number.isInteger(payload[name]) ||
        payload[name] < 0
      )
        invalid[name] = "Enter a nonnegative whole number.";
    if (Object.keys(invalid).length) {
      setErrors(invalid);
      return;
    }
    setPending(true);
    setError("");
    setErrors({});
    setSessionExpired(false);
    toast.loading(payload.title, {
      title: quest ? "Saving changes…" : "Forging quest…",
      key: QUEST_SAVE,
    });
    try {
      await api(quest ? `/api/quests/${quest.id}` : "/api/quests", {
        method: quest ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      onSaved(
        payload.title,
        quest ? "Quest updated" : "Quest forged",
        quest ? "edit" : "forge",
      );
    } catch (failure) {
      // Field errors and the retry message appear inline in the form.
      toast.dismiss(QUEST_SAVE);
      setError(failure.message);
      setErrors(failure.fields ?? {});
      if (failure.status === 401) {
        setSessionExpired(true);
        setError("Your session ended. Sign in to save these changes.");
      }
    } finally {
      setPending(false);
    }
  }
  return (
    <QuestDialog
      title={quest ? "Edit quest" : "Forge Quest"}
      onClose={close}
      pending={pending}
      restoreFocusTo={restoreFocusTo}
    >
      <form onSubmit={save} noValidate className="pane-body">
        <p className="pane-intro">
          Turn your next project into an achievable milestone. Shared quest
          content is visible to everyone.
        </p>
        {error && (
          <div role="alert" className="inline-error">
            {error}{" "}
            {sessionExpired && (
              <button type="button" className="text-button" onClick={signIn}>
                Sign in
              </button>
            )}
          </div>
        )}
        {treesError && (
          <div role="alert">
            Could not load skill trees.{" "}
            <button type="button" onClick={retry}>
              Try again
            </button>
          </div>
        )}
        <fieldset disabled={pending} className="quest-fields">
          {field("title", "Title *", "input", {
            required: true,
            autoFocus: true,
          })}
          {field("skill_tree_id", "Skill tree *", "select", {
            disabled: !data,
            children: data ? (
              data.trees.map((tree) => (
                <option key={tree.id} value={tree.id}>
                  {tree.title}
                </option>
              ))
            ) : (
              <option value={initial.skill_tree_id}>
                Loading skill trees…
              </option>
            ),
            required: true,
          })}
          {field("description", "Description *", "textarea", {
            rows: 3,
            required: true,
          })}
          {field("requirements", "Requirements *", "textarea", {
            rows: 4,
            required: true,
          })}
          {field("difficulty", "Difficulty *", "select", {
            children: ["beginner", "intermediate", "advanced"].map((value) => (
              <option key={value} value={value}>
                {value[0].toUpperCase() + value.slice(1)}
              </option>
            )),
          })}
          {field("xp_reward", "XP reward *", "input", {
            type: "number",
            min: 0,
            step: 1,
            required: true,
          })}
          {field("position", "Roadmap position *", "input", {
            type: "number",
            min: 0,
            step: 1,
            required: true,
          })}
          {field("tech_stack_tags", "Tags (comma-separated)")}
          {field("prerequisite_notes", "Prerequisite guidance", "textarea", {
            rows: 2,
          })}
          {field(
            "documentation_urls",
            "Documentation URLs (one per line)",
            "textarea",
            { rows: 3 },
          )}
        </fieldset>
        <footer className="pane-footer">
          <button
            type="button"
            className="button secondary"
            onClick={close}
            disabled={pending}
          >
            Cancel
          </button>
          <button className="button primary" disabled={pending || !data}>
            {pending ? "Saving…" : quest ? "Save changes" : "Create quest"}
          </button>
        </footer>
      </form>
    </QuestDialog>
  );
}
