const US_STATES = [
  ['AL', 'Alabama'],
  ['AK', 'Alaska'],
  ['AZ', 'Arizona'],
  ['AR', 'Arkansas'],
  ['CA', 'California'],
  ['CO', 'Colorado'],
  ['CT', 'Connecticut'],
  ['DE', 'Delaware'],
  ['FL', 'Florida'],
  ['GA', 'Georgia'],
  ['HI', 'Hawaii'],
  ['ID', 'Idaho'],
  ['IL', 'Illinois'],
  ['IN', 'Indiana'],
  ['IA', 'Iowa'],
  ['KS', 'Kansas'],
  ['KY', 'Kentucky'],
  ['LA', 'Louisiana'],
  ['ME', 'Maine'],
  ['MD', 'Maryland'],
  ['MA', 'Massachusetts'],
  ['MI', 'Michigan'],
  ['MN', 'Minnesota'],
  ['MS', 'Mississippi'],
  ['MO', 'Missouri'],
  ['MT', 'Montana'],
  ['NE', 'Nebraska'],
  ['NV', 'Nevada'],
  ['NH', 'New Hampshire'],
  ['NJ', 'New Jersey'],
  ['NM', 'New Mexico'],
  ['NY', 'New York'],
  ['NC', 'North Carolina'],
  ['ND', 'North Dakota'],
  ['OH', 'Ohio'],
  ['OK', 'Oklahoma'],
  ['OR', 'Oregon'],
  ['PA', 'Pennsylvania'],
  ['RI', 'Rhode Island'],
  ['SC', 'South Carolina'],
  ['SD', 'South Dakota'],
  ['TN', 'Tennessee'],
  ['TX', 'Texas'],
  ['UT', 'Utah'],
  ['VT', 'Vermont'],
  ['VA', 'Virginia'],
  ['WA', 'Washington'],
  ['WV', 'West Virginia'],
  ['WI', 'Wisconsin'],
  ['WY', 'Wyoming'],
  ['DC', 'Washington, DC'],
]

function VenueFields({
  newVenue,
  updateVenue,
  findCoordinates,
  geoLoading,
  geoStatus,
}) {
  return (
              <div>
                <label>
                  Venue name
                  <input
                    required
                    value={newVenue.name}
                    onChange={updateVenue('name')}
                  />
                </label>
                <label>
                  Street address
                  <input
                    required
                    value={newVenue.address}
                    onChange={updateVenue('address')}
                  />
                </label>
                <label>
                  City
                  <input
                    required
                    value={newVenue.city}
                    onChange={updateVenue('city')}
                  />
                </label>
                <label>
                  State
                  <select
                    required
                    value={newVenue.state}
                    onChange={updateVenue('state')}
                  >
                    <option value="" disabled>
                      Choose a state
                    </option>
                    {US_STATES.map(([code, name]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  ZIP code (optional)
                  <input
                    value={newVenue.zip_code}
                    onChange={updateVenue('zip_code')}
                    inputMode="numeric"
                    pattern="[0-9]{5}(-[0-9]{4})?"
                    placeholder="33312"
                  />
                </label>
                <label>
                  Website (optional)
                  <input
                    type="url"
                    value={newVenue.website_url}
                    onChange={updateVenue('website_url')}
                  />
                </label>
                <button
                  type="button"
                  onClick={findCoordinates}
                  disabled={
                    geoLoading ||
                    !newVenue.address.trim() ||
                    !newVenue.city.trim() ||
                    !newVenue.state
                  }
                >
                  {geoLoading ? 'Finding coordinates...' : 'Find coordinates'}
                </button>
                {geoStatus && <p role="status">{geoStatus}</p>}
                <label>
                  Latitude
                  <input
                    type="number"
                    step="any"
                    min="-90"
                    max="90"
                    value={newVenue.latitude}
                    onChange={updateVenue('latitude')}
                  />
                </label>
                <label>
                  Longitude
                  <input
                    type="number"
                    step="any"
                    min="-180"
                    max="180"
                    value={newVenue.longitude}
                    onChange={updateVenue('longitude')}
                  />
                </label>
              </div>
  )
}

export default VenueFields