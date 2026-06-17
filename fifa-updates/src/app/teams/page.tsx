'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchTeams, fetchMatches } from '@/lib/api'
import { FlagIcon } from '@/components/FlagIcon'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { Users, Search } from 'lucide-react'
import Link from 'next/link'

export default function TeamsPage() {
  const { data: teams, isLoading } = useQuery({ queryKey: ['teams'], queryFn: fetchTeams })
  const { data: matches } = useQuery({ queryKey: ['matches'], queryFn: fetchMatches })
  const { searchQuery, setSearchQuery, selectedGroup, setSelectedGroup } = useAppStore()

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const all = teams || []

  const groups = [...new Set(all.map(t => t.group))].sort()

  let filtered = all
  if (selectedGroup) {
    filtered = filtered.filter(t => t.group === selectedGroup)
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter(t => t.name.toLowerCase().includes(q))
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Users className="size-5" />
          Teams
        </h1>
        <div className="flex gap-1 overflow-x-auto pb-1">
          <Button
            variant={!selectedGroup ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setSelectedGroup('')}
            className="text-xs"
          >
            All
          </Button>
          {groups.map(g => (
            <Button
              key={g}
              variant={selectedGroup === g ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedGroup(g)}
              className="text-xs"
            >
              Group {g}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search teams..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full h-9 rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(team => {
          const teamMatches = (matches || []).filter(m => m.team1 === team.name || m.team2 === team.name)
          return (
            <Card key={team.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <FlagIcon name={team.name} className="size-10 shrink-0" />
                <div className="min-w-0 flex-1">
                  <Link href={`/teams/${team.id}`} className="font-semibold text-sm hover:underline">{team.name}</Link>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{team.code}</span>
                    <span>·</span>
                    <span>Group {team.group}</span>
                    <span>·</span>
                    <span>{team.confederation}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold">{teamMatches.length}</div>
                  <div className="text-[10px] text-muted-foreground">Matches</div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">No teams found.</p>
      )}
    </div>
  )
}
