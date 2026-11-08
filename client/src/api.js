// Small fetch wrapper. Every request carries the active demo user's id.
function activeUserId() {
  try {
    return localStorage.getItem('activeUserId') || '1'
  } catch {
    return '1'
  }
}

export async function api(path, { method = 'GET', body } = {}) {
  const response = await fetch(`/api${path}`, {
    method,
    headers: {
      'x-user-id': activeUserId(),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (response.status === 204) return null
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Something went wrong. Try again.')
  return data
}

export function formatDate(value) {
  if (!value) return ''
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatMoney(value) {
  return Number(value).toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}
