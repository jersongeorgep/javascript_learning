'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchMatches, fetchStandings } from '@/lib/api'
import { MatchCard } from '@/components/MatchCard'
import { StandingsTable } from '@/components/StandingsTable'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trophy, CalendarDays, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const { data: matches } = useQuery({ queryKey: ['matches'], queryFn: fetchMatches })
  const { data: standings } = useQuery({ queryKey: ['standings'], queryFn: fetchStandings })

  const upcoming = (matches || [])
    .filter(m => m.status !== 'finished')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6)

  const live = (matches || []).filter(m => m.status === 'live')

  const allGroupStandings = standings || []

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-700 via-green-600 to-emerald-800 p-6 sm:p-8 text-white">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <Trophy className="size-6 text-yellow-400" />
            <span className="text-sm font-medium uppercase tracking-wider text-yellow-200">2026 Edition</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">FIFA World Cup 2026</h1>
          <p className="text-green-100 max-w-xl text-sm sm:text-base">
            Follow all 104 matches, 48 teams, and 12 groups across USA, Mexico & Canada.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/matches">
              <Button size="sm" variant="secondary" className="gap-1.5">
                <CalendarDays className="size-4" /> View Matches <ArrowRight className="size-3" />
              </Button>
            </Link>
            <Link href="/standings">
              <Button size="sm" variant="outline" className="border-white/20 text-white hover:text-white hover:bg-white/10 gap-1.5">
                Standings
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 opacity-10">
          <Trophy className="size-40" />
        </div>
      </div>

      {/* Live */}
      {live.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="size-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="font-semibold text-lg">Live Now</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {live.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}

      {/* Upcoming */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">Upcoming Matches</h2>
          <Link href="/matches">
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              All matches <ArrowRight className="size-3" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map(m => <MatchCard key={m.id} match={m} />)}
          {upcoming.length === 0 && (
            <p className="col-span-full text-sm text-muted-foreground text-center py-8">
              No upcoming matches scheduled.
            </p>
          )}
        </div>
      </section>

      {/* Standings Preview */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">Group Standings</h2>
          <Link href="/standings">
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              All groups <ArrowRight className="size-3" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allGroupStandings.slice(0, 6).map((g) => (
            <Card key={g.group} className="p-3">
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                <Trophy className="size-3.5 text-yellow-500" />
                Group {g.group}
              </h3>
              <StandingsTable entries={g.teams} />
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">48</div>
            <div className="text-xs text-muted-foreground">Teams</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-muted-foreground">Groups</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">104</div>
            <div className="text-xs text-muted-foreground">Matches</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">16</div>
            <div className="text-xs text-muted-foreground">Stadiums</div>
          </Card>
        </div>
      </section>
    </div>
  )
}
