'use client'

import { create } from 'zustand'
import type { Match, Team, GroupStanding } from './types'

interface AppState {
  matches: Match[]
  teams: Team[]
  standings: GroupStanding[]
  loading: boolean
  error: string | null
  selectedGroup: string
  searchQuery: string
  setMatches: (matches: Match[]) => void
  setTeams: (teams: Team[]) => void
  setStandings: (standings: GroupStanding[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedGroup: (group: string) => void
  setSearchQuery: (query: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  matches: [],
  teams: [],
  standings: [],
  loading: false,
  error: null,
  selectedGroup: 'all',
  searchQuery: '',
  setMatches: (matches) => set({ matches }),
  setTeams: (teams) => set({ teams }),
  setStandings: (standings) => set({ standings }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedGroup: (selectedGroup) => set({ selectedGroup }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}))
