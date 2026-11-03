import { grades } from '../data/starterRoutes'

function GradeFilter({ grade, sort, onGradeChange, onSortChange }) {
  return (
    <section className="toolbar" aria-label="Route filters">
      <label>
        Grade
        <select value={grade} onChange={(event) => onGradeChange(event.target.value)}>
          <option>All grades</option>
          {grades.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <label>
        Sort by
        <select value={sort} onChange={(event) => onSortChange(event.target.value)}>
          <option value="easiest">Easiest first</option>
          <option value="hardest">Hardest first</option>
        </select>
      </label>
    </section>
  )
}

export default GradeFilter
