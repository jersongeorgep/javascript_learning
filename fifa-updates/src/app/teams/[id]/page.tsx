'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { fetchTeams, fetchMatches, fetchStandings } from '@/lib/api'
import { FlagIcon } from '@/components/FlagIcon'
import { Card } from '@/components/ui/card'
import { MatchCard } from '@/components/MatchCard'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TeamDetailPage() {
  const params = useParams()
  const { data: teams } = useQuery({ queryKey: ['teams'], queryFn: fetchTeams })
  const { data: matches } = useQuery({ queryKey: ['matches'], queryFn: fetchMatches })
  const { data: standings } = useQuery({ queryKey: ['standings'], queryFn: fetchStandings })

  const team = (teams || []).find(t => t.id === params.id)

  if (!team) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-muted-foreground">Team not found.</p>
        <Link href="/teams">
          <Button variant="outline" size="sm" className="mt-4">Back to teams</Button>
        </Link>
      </div>
    )
  }

  const teamMatches = (matches || [])
    .filter(m => m.team1 === team.name || m.team2 === team.name)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const standing = (standings || [])
    .filter(g => g.group === team.group)
    .flatMap(g => g.teams)
    .find(e => e.team === team.name)

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 space-y-4">
      <Link href="/teams">
        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
          <ArrowLeft className="size-4" /> Back
        </Button>
      </Link>

      <Card className="overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center gap-4">
            <FlagIcon name={team.name} className="size-14 shrink-0" />
            <div>
              <h1 className="text-2xl font-bold">{team.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{team.code}</span>
                <span>·</span>
                <span>Group {team.group}</span>
                <span>·</span>
                <span>{team.confederation}</span>
              </div>
            </div>
          </div>
        </div>

        {standing && (
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-px bg-border">
            {[
              { label: 'P', value: standing.p },
              { label: 'W', value: standing.w },
              { label: 'D', value: standing.d },
              { label: 'L', value: standing.l },
              { label: 'GF', value: standing.gf },
              { label: 'GA', value: standing.ga },
              { label: 'Pts', value: standing.pts },
            ].map(s => (
              <div key={s.label} className="bg-background p-3 text-center">
                <div className="text-lg font-bold">{s.value}</div>
                <div className="text-[10px] text-muted-foreground uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <h2 className="font-semibold">Matches</h2>
      <div className="space-y-2">
        {teamMatches.map(m => (
          <MatchCard key={m.id} match={m} />
        ))}
        {teamMatches.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No matches yet.</p>
        )}
      </div>
    </div>
  )
}
