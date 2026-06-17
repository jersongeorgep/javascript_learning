export interface Match {
  id: string
  round: string
  date: string
  time: string
  team1: string
  team2: string
  score?: {
    ft: [number, number]
    ht: [number, number]
  }
  goals1?: Goal[]
  goals2?: Goal[]
  group?: string
  ground: string
  stage?: string
  status: 'upcoming' | 'live' | 'finished'
}

export interface Goal {
  name: string
  minute: string
  penalty?: boolean
  owngoal?: boolean
}

export interface Team {
  id: string
  name: string
  code: string
  flag: string
  group: string
  fifaRank?: number
  confederation?: string
}

export interface StandingsEntry {
  team: string
  group: string
  pts: number
  p: number
  w: number
  d: number
  l: number
  gf: number
  ga: number
  gd: number
}

export interface GroupStanding {
  group: string
  teams: StandingsEntry[]
}

export interface Group {
  name: string
  teams: string[]
}
