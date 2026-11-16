const ADDRESS_PATTERN = /^(.*),\s*([A-Z]{2})(?:\s+(\d{5}(?:-\d{4})?))?$/

export function parseVenueAddress(address) {
  if (typeof address !== 'string') return null

  const match = address.match(ADDRESS_PATTERN)
  if (!match || !match[1].trim()) return null

  const state = match[2]
  const validStates = new Set(
    'AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC'.split(' '),
  )

  if (!validStates.has(state)) return null

  return {
    address: match[1].trim(),
    state,
    zip_code: match[3] || '',
  }
}

export function toVenuePayload(form) {
  return {
    name: form.name.trim(),
    address: form.address.trim(),
    city: form.city.trim(),
    state: form.state,
    zip_code: form.zip_code.trim(),
    website_url: form.website_url.trim() || null,
    latitude: form.latitude === '' ? null : Number(form.latitude),
    longitude: form.longitude === '' ? null : Number(form.longitude),
  }
}