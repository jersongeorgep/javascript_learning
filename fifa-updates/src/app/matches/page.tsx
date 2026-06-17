'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchMatches } from '@/lib/api'
import { MatchCard } from '@/components/MatchCard'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { CalendarDays, Filter } from 'lucide-react'

const FILTERS = ['all', 'group', 'r32', 'r16', 'qf', 'sf', 'third', 'final'] as const
const FILTER_LABELS: Record<string, string> = {
  all: 'All',
  group: 'Group Stage',
  r32: 'Round of 32',
  r16: 'Round of 16',
  qf: 'Quarter-finals',
  sf: 'Semi-finals',
  third: 'Third Place',
  final: 'Final',
}

export default function MatchesPage() {
  const { data: matches, isLoading } = useQuery({ queryKey: ['matches'], queryFn: fetchMatches })
  const [filter, setFilter] = useState<string>('all')
  const [showUpcoming, setShowUpcoming] = useState(false)

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  let filtered = matches || []

  if (filter !== 'all') {
    filtered = filtered.filter(m => {
      const r = (m.round || '').toLowerCase()
      if (filter === 'group') return r.includes('matchday')
      return r.includes(filter)
    })
  }

  if (showUpcoming) {
    filtered = filtered.filter(m => m.status !== 'finished')
  }

  const sorted = [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <CalendarDays className="size-5" />
          Matches
        </h1>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {FILTERS.map(f => (
            <Button
              key={f}
              variant={filter === f ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setFilter(f)}
              className="whitespace-nowrap text-xs"
            >
              {FILTER_LABELS[f]}
            </Button>
          ))}
          <Button
            variant={showUpcoming ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setShowUpcoming(!showUpcoming)}
            className="whitespace-nowrap text-xs gap-1"
          >
            <Filter className="size-3" />
            Upcoming
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {sorted.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-12">
            No matches found.
          </p>
        )}
        {sorted.map(m => (
          <MatchCard key={m.id} match={m} />
        ))}
      </div>
    </div>
  )
}
