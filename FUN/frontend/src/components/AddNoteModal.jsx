import "../styles/AddNoteModal.css";
import MainButton from "./MainButton";
import RegularButton from "./RegularButton";
import { useState } from "react";
import { Sparkles, Check, X, Loader2 } from "lucide-react";
import { transformNote } from "../services/api";
import { useAuth } from "../context/AuthContext";

const COLOR_PALETTE = [
  "#fff3cd",
  "#c7e9f5",
  "#f5d5e0",
  "#d4f5e8",
  "#e5d7f5",
  "#ffe8d6",
  "#e8e8e8",
  "#ffeb99",
];

const TONES = [
  "Professional",
  "Casual",
  "Bullet Points",
  "Academic",
  "Creative",
  "Concise (Summary)",
  "Detailed",
  "Friendly",
  "Humorous",
  "Persuasive",
];

const AddNoteModal = ({
  show,
  editingNote,
  formData,
  formError,
  onChange,
  onColorChange,
  onSubmit,
  onClose,
  categories,
}) => {
  const { user } = useAuth();
  const [selectedTone, setSelectedTone] = useState(TONES[0]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPreview, setAiPreview] = useState(null);

  const handleAiTransform = async () => {
    if (!formData.content) return alert("Write some content first!");
    setAiLoading(true);
    try {
      const data = await transformNote(
        user?.userID,
        user?.email,
        formData.content,
        selectedTone,
      );
      setAiPreview(data.aiText);
    } catch (err) {
      alert("AI Error: " + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const acceptAi = () => {
    onChange({ target: { name: "content", value: aiPreview } });
    setAiPreview(null);
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <div className="modal-header">
          <h2>{editingNote ? "Edit Note" : "New Note"}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="modal-form">
          {formError && <div className="form-error">{formError}</div>}

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="Note title"
              value={formData.title}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              name="content"
              placeholder="Write your note here..."
              value={formData.content}
              onChange={onChange}
              rows="6"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category || ""}
              onChange={onChange}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              placeholder="work, personal, urgent..."
              value={formData.tags}
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-palette">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-swatch ${formData.color === color ? "active" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => onColorChange(color)}
                />
              ))}
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="is_pinned"
                checked={formData.is_pinned}
                onChange={onChange}
              />
              Pin this note
            </label>
          </div>

          {/* AI MAGIC SECTION */}
          <div
            className="ai-tools-section"
            style={{
              background: "#f0f4ff",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "15px",
            }}
          >
            <label
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                display: "block",
                marginBottom: "5px",
              }}
            >
              AI MAGIC TOOLS
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                style={{ flex: 1 }}
              >
                {TONES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAiTransform}
                disabled={aiLoading}
                className="ai-magic-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  background: "#6366f1",
                  color: "white",
                  border: "none",
                  padding: "5px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {aiLoading ? (
                  <Loader2 size={16} className="spinner" />
                ) : (
                  <Sparkles size={16} />
                )}
                Rewrite
              </button>
            </div>

            {aiPreview && (
              <div
                className="ai-preview-box"
                style={{
                  marginTop: "10px",
                  border: "1px dashed #6366f1",
                  padding: "10px",
                  borderRadius: "4px",
                  background: "white",
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    fontStyle: "italic",
                    color: "#444",
                  }}
                >
                  {aiPreview}
                </p>
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                >
                  <button
                    type="button"
                    onClick={acceptAi}
                    style={{
                      background: "#22c55e",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Check size={14} /> Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPreview(null)}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <X size={14} /> Deny
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="modal-buttons">
            <RegularButton
              type="button"
              className="modal-cancel"
              onClick={onClose}
            >
              Cancel
            </RegularButton>
            <MainButton type="submit">Save</MainButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoteModal;
