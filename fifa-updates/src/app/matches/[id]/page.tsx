'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { fetchMatches } from '@/lib/api'
import { FlagIcon } from '@/components/FlagIcon'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function MatchDetailPage() {
  const params = useParams()
  const { data: matches, isLoading } = useQuery({ queryKey: ['matches'], queryFn: fetchMatches })

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="h-64 rounded-lg bg-muted animate-pulse" />
      </div>
    )
  }

  const match = (matches || []).find(m => m.id === params.id)

  if (!match) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-muted-foreground">Match not found.</p>
        <Link href="/matches">
          <Button variant="outline" size="sm" className="mt-4">Back to matches</Button>
        </Link>
      </div>
    )
  }

  const isFinished = match.status === 'finished'
  const isLive = match.status === 'live'

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 space-y-4">
      <Link href="/matches">
        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
          <ArrowLeft className="size-4" /> Back
        </Button>
      </Link>

      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
          <div className="text-center space-y-2 mb-4">
            <Badge variant="outline" className={isLive ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 animate-pulse' : ''}>
              {isLive ? 'LIVE' : isFinished ? 'Full Time' : 'Upcoming'}
            </Badge>
            <p className="text-sm text-muted-foreground">{match.round} {match.group && `· ${match.group}`}</p>
          </div>

          <div className="flex items-center justify-center gap-4 sm:gap-8">
            <div className="flex flex-col items-center gap-2 text-center flex-1 min-w-0">
              <FlagIcon name={match.team1} className="size-10 shrink-0" />
              <span className="font-semibold text-sm truncate max-w-[120px]">{match.team1}</span>
            </div>

            <div className="text-center shrink-0">
              {match.score ? (
                <div className="text-3xl sm:text-4xl font-bold tabular-nums">
                  <span>{match.score.ft[0]}</span>
                  <span className="text-muted-foreground mx-2">-</span>
                  <span>{match.score.ft[1]}</span>
                </div>
              ) : (
                <div className="text-lg text-muted-foreground">vs</div>
              )}
              {match.score && (
                <div className="text-xs text-muted-foreground mt-1">
                  HT: {match.score.ht[0]} - {match.score.ht[1]}
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-2 text-center flex-1 min-w-0">
              <FlagIcon name={match.team2} className="size-10 shrink-0" />
              <span className="font-semibold text-sm truncate max-w-[120px]">{match.team2}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {match.time ? match.time.split('UTC')[0].trim() : match.date}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {match.ground}
            </span>
          </div>
        </div>
      </Card>

      {/* Goals */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <FlagIcon name={match.team1} className="size-5 shrink-0" />
            {match.team1}
          </h3>
          {match.goals1 && match.goals1.length > 0 ? (
            <ul className="space-y-1">
              {match.goals1.map((g, i) => (
                <li key={i} className="text-sm flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-green-500 shrink-0" />
                  <span>{g.name}</span>
                  <span className="text-muted-foreground text-xs">{g.minute}&apos;{g.penalty ? ' (P)' : ''}{g.owngoal ? ' (OG)' : ''}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">{isFinished ? 'No goals' : '-'}</p>
          )}
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <FlagIcon name={match.team2} className="size-5 shrink-0" />
            {match.team2}
          </h3>
          {match.goals2 && match.goals2.length > 0 ? (
            <ul className="space-y-1">
              {match.goals2.map((g, i) => (
                <li key={i} className="text-sm flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-green-500 shrink-0" />
                  <span>{g.name}</span>
                  <span className="text-muted-foreground text-xs">{g.minute}&apos;{g.penalty ? ' (P)' : ''}{g.owngoal ? ' (OG)' : ''}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">{isFinished ? 'No goals' : '-'}</p>
          )}
        </Card>
      </div>
    </div>
  )
}
