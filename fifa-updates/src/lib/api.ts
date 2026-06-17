import type { Match, Team, GroupStanding, Goal } from './types'

interface RawMatch {
  round: string
  date: string
  time?: string
  team1: string
  team2: string
  score?: { ft: [number, number]; ht: [number, number] }
  goals1?: Goal[]
  goals2?: Goal[]
  group?: string
  ground: string
}

const OPENFOOTBALL_URL = 'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json'

const TEAMS_LIST: { name: string; code: string; iso: string; confederation: string }[] = [
  { name: 'Mexico', code: 'MEX', iso: 'mx', confederation: 'CONCACAF' },
  { name: 'South Africa', code: 'RSA', iso: 'za', confederation: 'CAF' },
  { name: 'South Korea', code: 'KOR', iso: 'kr', confederation: 'AFC' },
  { name: 'Czech Republic', code: 'CZE', iso: 'cz', confederation: 'UEFA' },
  { name: 'Scotland', code: 'SCO', iso: 'gb-sct', confederation: 'UEFA' },
  { name: 'Canada', code: 'CAN', iso: 'ca', confederation: 'CONCACAF' },
  { name: 'Bosnia & Herzegovina', code: 'BIH', iso: 'ba', confederation: 'UEFA' },
  { name: 'Qatar', code: 'QAT', iso: 'qa', confederation: 'AFC' },
  { name: 'Switzerland', code: 'SUI', iso: 'ch', confederation: 'UEFA' },
  { name: 'Brazil', code: 'BRA', iso: 'br', confederation: 'CONMEBOL' },
  { name: 'Morocco', code: 'MAR', iso: 'ma', confederation: 'CAF' },
  { name: 'Haiti', code: 'HAI', iso: 'ht', confederation: 'CONCACAF' },
  { name: 'USA', code: 'USA', iso: 'us', confederation: 'CONCACAF' },
  { name: 'Paraguay', code: 'PAR', iso: 'py', confederation: 'CONMEBOL' },
  { name: 'Australia', code: 'AUS', iso: 'au', confederation: 'AFC' },
  { name: 'Turkey', code: 'TUR', iso: 'tr', confederation: 'UEFA' },
  { name: 'Germany', code: 'GER', iso: 'de', confederation: 'UEFA' },
  { name: 'Curaçao', code: 'CUR', iso: 'cw', confederation: 'CONCACAF' },
  { name: 'Ivory Coast', code: 'CIV', iso: 'ci', confederation: 'CAF' },
  { name: 'Ecuador', code: 'ECU', iso: 'ec', confederation: 'CONMEBOL' },
  { name: 'Netherlands', code: 'NED', iso: 'nl', confederation: 'UEFA' },
  { name: 'Japan', code: 'JPN', iso: 'jp', confederation: 'AFC' },
  { name: 'Tunisia', code: 'TUN', iso: 'tn', confederation: 'CAF' },
  { name: 'Sweden', code: 'SWE', iso: 'se', confederation: 'UEFA' },
  { name: 'Belgium', code: 'BEL', iso: 'be', confederation: 'UEFA' },
  { name: 'Egypt', code: 'EGY', iso: 'eg', confederation: 'CAF' },
  { name: 'Iran', code: 'IRN', iso: 'ir', confederation: 'AFC' },
  { name: 'New Zealand', code: 'NZL', iso: 'nz', confederation: 'OFC' },
  { name: 'Spain', code: 'ESP', iso: 'es', confederation: 'UEFA' },
  { name: 'Cape Verde', code: 'CPV', iso: 'cv', confederation: 'CAF' },
  { name: 'Saudi Arabia', code: 'KSA', iso: 'sa', confederation: 'AFC' },
  { name: 'Uruguay', code: 'URU', iso: 'uy', confederation: 'CONMEBOL' },
  { name: 'France', code: 'FRA', iso: 'fr', confederation: 'UEFA' },
  { name: 'Senegal', code: 'SEN', iso: 'sn', confederation: 'CAF' },
  { name: 'Norway', code: 'NOR', iso: 'no', confederation: 'UEFA' },
  { name: 'Iraq', code: 'IRQ', iso: 'iq', confederation: 'AFC' },
  { name: 'Argentina', code: 'ARG', iso: 'ar', confederation: 'CONMEBOL' },
  { name: 'Algeria', code: 'ALG', iso: 'dz', confederation: 'CAF' },
  { name: 'Austria', code: 'AUT', iso: 'at', confederation: 'UEFA' },
  { name: 'Jordan', code: 'JOR', iso: 'jo', confederation: 'AFC' },
  { name: 'Portugal', code: 'POR', iso: 'pt', confederation: 'UEFA' },
  { name: 'Colombia', code: 'COL', iso: 'co', confederation: 'CONMEBOL' },
  { name: 'Uzbekistan', code: 'UZB', iso: 'uz', confederation: 'AFC' },
  { name: 'Croatia', code: 'CRO', iso: 'hr', confederation: 'UEFA' },
  { name: 'England', code: 'ENG', iso: 'gb-eng', confederation: 'UEFA' },
  { name: 'Ghana', code: 'GHA', iso: 'gh', confederation: 'CAF' },
  { name: 'DR Congo', code: 'COD', iso: 'cd', confederation: 'CAF' },
  { name: 'Panama', code: 'PAN', iso: 'pa', confederation: 'CONCACAF' },
]

const ISO_MAP: Record<string, string> = {}
for (const t of TEAMS_LIST) {
  ISO_MAP[t.name] = t.iso
}

export function getFlagUrl(teamName: string): string {
  const iso = ISO_MAP[teamName]
  return iso ? `https://hatscripts.github.io/circle-flags/flags/${iso}.svg` : ''
}

const GROUP_MAP: Record<string, string> = {
  'Mexico': 'A', 'South Africa': 'A', 'South Korea': 'A', 'Czech Republic': 'A',
  'Canada': 'B', 'Bosnia & Herzegovina': 'B', 'Qatar': 'B', 'Switzerland': 'B',
  'Brazil': 'C', 'Morocco': 'C', 'Haiti': 'C', 'Scotland': 'C',
  'USA': 'D', 'Paraguay': 'D', 'Australia': 'D', 'Turkey': 'D',
  'Germany': 'E', 'Curaçao': 'E', 'Ivory Coast': 'E', 'Ecuador': 'E',
  'Netherlands': 'F', 'Japan': 'F', 'Tunisia': 'F', 'Sweden': 'F',
  'Belgium': 'G', 'Egypt': 'G', 'Iran': 'G', 'New Zealand': 'G',
  'Spain': 'H', 'Cape Verde': 'H', 'Saudi Arabia': 'H', 'Uruguay': 'H',
  'France': 'I', 'Senegal': 'I', 'Norway': 'I', 'Iraq': 'I',
  'Argentina': 'J', 'Algeria': 'J', 'Austria': 'J', 'Jordan': 'J',
  'Portugal': 'K', 'Colombia': 'K', 'Uzbekistan': 'K', 'Croatia': 'K',
  'England': 'L', 'Ghana': 'L', 'DR Congo': 'L', 'Panama': 'L',
}

export function getTeamCode(teamName: string): string {
  return TEAMS_LIST.find(t => t.name === teamName)?.code || ''
}

function getStatus(dateStr: string): 'upcoming' | 'live' | 'finished' {
  const matchDate = new Date(dateStr + 'T23:59:59Z')
  const now = new Date()
  if (now > matchDate) return 'finished'
  if (now.toDateString() === matchDate.toDateString()) return 'live'
  return 'upcoming'
}

export async function fetchMatches(): Promise<Match[]> {
  const res = await fetch(OPENFOOTBALL_URL, { cache: 'no-store' })
  const data = await res.json()
  return data.matches
    .filter((m: RawMatch) => {
      const isPlaceholder = m.team1.startsWith('W') || m.team1.startsWith('L') ||
        m.team1.startsWith('1') || m.team1.startsWith('2') || m.team1.startsWith('3')
      return !isPlaceholder
    })
    .map((m: RawMatch, i: number) => ({
      id: String(i + 1),
      round: m.round,
      date: m.date,
      time: m.time || '',
      team1: m.team1,
      team2: m.team2,
      score: m.score,
      goals1: m.goals1,
      goals2: m.goals2,
      group: m.group,
      ground: m.ground,
      stage: m.round?.toLowerCase().includes('matchday') ? 'group' : 'knockout',
      status: getStatus(m.date),
    }))
}

export async function fetchTeams(): Promise<Team[]> {
  return TEAMS_LIST.map((t, i) => ({
    id: String(i + 1),
    name: t.name,
    code: t.code,
    flag: getFlagUrl(t.name),
    group: GROUP_MAP[t.name] || '',
    confederation: t.confederation,
  }))
}

export async function fetchStandings(): Promise<GroupStanding[]> {
  const matches = await fetchMatches()
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
  const groupTeams: Record<string, Set<string>> = {}
  const stats: Record<string, { pts: number; p: number; w: number; d: number; l: number; gf: number; ga: number }> = {}

  for (const g of groups) {
    groupTeams[g] = new Set()
  }

  for (const m of matches) {
    if (!m.group) continue
    const grp = m.group.replace('Group ', '')
    if (groups.includes(grp)) {
      groupTeams[grp].add(m.team1)
      groupTeams[grp].add(m.team2)
    }
    if (m.score?.ft) {
      const [s1, s2] = m.score.ft
      if (!stats[m.team1]) stats[m.team1] = { pts: 0, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 }
      if (!stats[m.team2]) stats[m.team2] = { pts: 0, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 }
      stats[m.team1].p++
      stats[m.team2].p++
      stats[m.team1].gf += s1
      stats[m.team1].ga += s2
      stats[m.team2].gf += s2
      stats[m.team2].ga += s1
      if (s1 > s2) { stats[m.team1].w++; stats[m.team1].pts += 3; stats[m.team2].l++ }
      else if (s2 > s1) { stats[m.team2].w++; stats[m.team2].pts += 3; stats[m.team1].l++ }
      else { stats[m.team1].d++; stats[m.team1].pts++; stats[m.team2].d++; stats[m.team2].pts++ }
    }
  }

  return groups.map(g => ({
    group: g,
    teams: Array.from(groupTeams[g] || [])
      .map(team => ({
        team,
        group: g,
        pts: stats[team]?.pts || 0,
        p: stats[team]?.p || 0,
        w: stats[team]?.w || 0,
        d: stats[team]?.d || 0,
        l: stats[team]?.l || 0,
        gf: stats[team]?.gf || 0,
        ga: stats[team]?.ga || 0,
        gd: (stats[team]?.gf || 0) - (stats[team]?.ga || 0),
      }))
      .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf),
  }))
}
