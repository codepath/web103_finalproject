// Presenter: checkbox chips for picking any number of tags.
// tags = [{ id, name }], selected = array of tag ids, onToggle(id) flips one.
function TagPicker({ tags, selected, onToggle }) {
  return (
    <fieldset>
      <legend>Tags (pick any)</legend>
      <div className="tag-picker">
        {tags.map((t) => (
          <label
            key={t.id}
            className={
              selected.includes(t.id) ? 'tag-option checked' : 'tag-option'
            }
          >
            <input
              type="checkbox"
              checked={selected.includes(t.id)}
              onChange={() => onToggle(t.id)}
            />
            #{t.name}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default TagPicker
