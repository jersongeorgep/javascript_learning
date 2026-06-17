'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchMatches } from '@/lib/api'
import { FlagIcon } from '@/components/FlagIcon'
import { Card } from '@/components/ui/card'
import { Shield } from 'lucide-react'
import type { Match } from '@/lib/types'

function BracketMatch({ match }: { match?: Match }) {
  if (!match) return null

  return (
    <Card className={`p-2.5 min-w-[180px] text-xs ${match.status === 'live' ? 'ring-2 ring-green-500' : ''}`}>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <FlagIcon name={match.team1} className="size-4 shrink-0" />
            <span className="truncate font-medium">{match.team1}</span>
          </div>
          {match.score && <span className="font-bold shrink-0">{match.score.ft[0]}</span>}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <FlagIcon name={match.team2} className="size-4 shrink-0" />
            <span className="truncate font-medium">{match.team2}</span>
          </div>
          {match.score && <span className="font-bold shrink-0">{match.score.ft[1]}</span>}
        </div>
        {!match.score && (
          <div className="text-[10px] text-muted-foreground text-center pt-1">
            TBD
          </div>
        )}
      </div>
    </Card>
  )
}

function BracketRound({ label, matches }: { label: string; matches: Match[] }) {
  if (matches.length === 0) return null
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
        {label}
      </h3>
      <div className="space-y-2">
        {matches.map(m => (
          <BracketMatch key={m.id} match={m} />
        ))}
      </div>
    </div>
  )
}

export default function BracketPage() {
  const { data: matches, isLoading } = useQuery({ queryKey: ['matches'], queryFn: fetchMatches })

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="h-96 rounded-lg bg-muted animate-pulse" />
      </div>
    )
  }

  const r32 = (matches || []).filter(m => m.round?.toLowerCase().includes('round of 32'))
  const r16 = (matches || []).filter(m => m.round?.toLowerCase().includes('round of 16'))
  const qf = (matches || []).filter(m => m.round?.toLowerCase().includes('quarter'))
  const sf = (matches || []).filter(m => m.round?.toLowerCase().includes('semi'))
  const thirdPlace = (matches || []).filter(m => m.round?.toLowerCase().includes('third'))
  const finalMatch = (matches || []).filter(m => m.round?.toLowerCase().includes('final'))

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 space-y-6">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <Shield className="size-5" />
        Knockout Bracket
      </h1>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {r32.length > 0 && (
            <div className="min-w-[200px]">
              <BracketRound label="Round of 32" matches={r32} />
            </div>
          )}
          <div className="min-w-[200px]">
            <BracketRound label="Round of 16" matches={r16} />
          </div>
          <div className="min-w-[200px]">
            <BracketRound label="Quarter-finals" matches={qf} />
          </div>
          <div className="min-w-[200px]">
            <BracketRound label="Semi-finals" matches={sf} />
          </div>
          <div className="min-w-[200px] space-y-4">
            <BracketRound label="Third Place" matches={thirdPlace} />
            <BracketRound label="Final" matches={finalMatch} />
          </div>
        </div>
      </div>

      {r32.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Knockout bracket will be available after the group stage.</p>
        </div>
      )}
    </div>
  )
}
