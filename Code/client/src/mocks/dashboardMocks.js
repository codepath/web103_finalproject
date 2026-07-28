// The knockout bracket and per-match statistics below have no backing table
// or endpoint anywhere in Code/server — they're fixtures, not stand-ins for
// data that will later be fetched.

export const knockoutBracket = {
  quarterLeft: [
    { home: 'FRA', away: 'MAR' },
    { home: 'ESP', away: 'BEL' },
  ],
  semiLeft: { home: 'FRA', away: 'ESP' },
  final: { home: 'FRA', away: 'GER', venue: 'Boston Arena' },
  semiRight: { home: 'GER', away: 'ENG' },
  quarterRight: [
    { home: 'GER', away: 'NOR' },
    { home: 'ENG', away: 'ARG' },
  ],
}

export const matchStatistics = [
  { label: 'Shots on Target', homeValue: 7, awayValue: 3 },
  { label: 'Total Shots', homeValue: 12, awayValue: 7 },
  { label: 'Fouls', homeValue: 8, awayValue: 11 },
]
