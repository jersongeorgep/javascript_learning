'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchStandings } from '@/lib/api'
import { StandingsTable } from '@/components/StandingsTable'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Table2 } from 'lucide-react'

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export default function StandingsPage() {
  const { data: standings, isLoading } = useQuery({ queryKey: ['standings'], queryFn: fetchStandings })
  const [selected, setSelected] = useState<string>('all')

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const filtered = selected === 'all'
    ? standings || []
    : (standings || []).filter(g => g.group === selected)

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Table2 className="size-5" />
          Standings
        </h1>
        <div className="flex gap-1 overflow-x-auto pb-1">
          <Button
            variant={selected === 'all' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setSelected('all')}
            className="text-xs"
          >
            All
          </Button>
          {GROUPS.map(g => (
            <Button
              key={g}
              variant={selected === g ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSelected(g)}
              className="text-xs"
            >
              Group {g}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map(g => (
          <Card key={g.group} className="p-4">
            <h2 className="font-bold mb-3 flex items-center gap-2">
              <span className="size-2 rounded-full bg-green-500" />
              Group {g.group}
            </h2>
            <StandingsTable entries={g.teams} />
          </Card>
        ))}
      </div>
    </div>
  )
}
