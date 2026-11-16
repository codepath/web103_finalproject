export async function api(path, { method = 'GET', body } = {}) {
  let response
  try {
    response = await fetch(`/api${path}`, {
      method,
      credentials: 'include',
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    const message = 'Could not reach the server. Check your connection and try again.'
    window.dispatchEvent(new CustomEvent('api-error', { detail: message }))
    throw new Error(message)
  }
  if (response.status === 204) return null
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    if (response.status === 401) window.dispatchEvent(new Event('auth-expired'))
    const error = new Error(data.error || 'Something went wrong. Try again.')
    error.status = response.status
    if (response.status !== 401) window.dispatchEvent(new CustomEvent('api-error', { detail: error.message }))
    throw error
  }
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
