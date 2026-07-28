// Shared helper for Crest and Avatar. Team crests, match badges, and player
// photos have no image source anywhere in the API. Every team/match/player
// endpoint is hand-written dummy data with zero image/crest/badge/photo fields.
// Rather than a blank grey block (or worse, an invented logo), these render a
// deterministic initials badge so the same name always gets the same look.

const PALETTES = [
  { bg: 'bg-primary/15', text: 'text-primary' },
  { bg: 'bg-dash-away/15', text: 'text-dash-away' },
  { bg: 'bg-dash-gold/15', text: 'text-dash-gold' },
  { bg: 'bg-accent-pink/15', text: 'text-accent-pink' },
  { bg: 'bg-accent-blue/15', text: 'text-accent-blue' },
  { bg: 'bg-white/10', text: 'text-secondary' },
]

export function hashString(value) {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

export function paletteFor(seed) {
  const value = seed || '?'
  return PALETTES[hashString(value) % PALETTES.length]
}

// Already-short codes (API match.home/away, e.g. "MCI") pass through as-is;
// multi-word names take first+last initials; single long words are clipped.
export function shortLabel(value) {
  const trimmed = (value || '?').trim()
  if (!trimmed) return '?'
  const words = trimmed.split(/\s+/).filter(Boolean)
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
  }
  return trimmed.length <= 4 ? trimmed.toUpperCase() : trimmed.slice(0, 3).toUpperCase()
}

export function getInitials(value) {
  const trimmed = (value || '?').trim()
  if (!trimmed) return '?'
  const words = trimmed.split(/\s+/).filter(Boolean)
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
  }
  return trimmed.slice(0, 2).toUpperCase()
}
