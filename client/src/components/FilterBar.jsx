import Dropdown from './Dropdown.jsx'

const PRICES = [
  ['free', 'Free'],
  ['$', 'Under $25'],
  ['$$', '$25–59'],
  ['$$$', '$60+'],
]
const RADII = [
  ['1', 'Within 1 mile'],
  ['5', 'Within 5 miles'],
  ['10', 'Within 10 miles'],
  ['25', 'Within 25 miles'],
]

// Presenter: shows the filter dropdowns. values = { tier, activity_type, radius };
// onChange(name, value) is called with '' when a filter is cleared.
function FilterBar({ values, activityTypes, onChange }) {
  const filterSelect = (name, label, anyText, options) => (
    <Dropdown
      label={label}
      value={values[name] ?? ''}
      options={[['', anyText], ...options]}
      onChange={(value) => onChange(name, value)}
    />
  )

  return (
    <div className="filters" role="group" aria-label="Filter events">
      {filterSelect('tier', 'Price', 'Any price', PRICES)}
      {filterSelect(
        'activity_type',
        'Type',
        'All activity types',
        activityTypes.map((a) => [a.name, a.name]),
      )}
      {filterSelect('radius', 'Distance', 'Any distance', RADII)}
    </div>
  )
}

export default FilterBar
