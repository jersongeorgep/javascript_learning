'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FlagIcon } from '@/components/FlagIcon'
import type { Match } from '@/lib/types'
import { Clock, MapPin } from 'lucide-react'

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00Z')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const STATUS_COLORS = {
  upcoming: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  live: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 animate-pulse',
  finished: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

function TeamBadge({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <FlagIcon name={name} className="size-5 shrink-0" />
      <span className="font-medium truncate">{name}</span>
    </div>
  )
}

export function MatchCard({ match }: { match: Match }) {
  const isFinished = match.status === 'finished'
  const isLive = match.status === 'live'
  const statusColor = STATUS_COLORS[match.status]

  return (
    <Link href={`/matches/${match.id}`}>
      <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 font-medium ${statusColor}`}>
                {isLive ? 'LIVE' : isFinished ? 'FT' : 'UP'}
              </Badge>
              <span className="text-[11px] text-muted-foreground">{match.round}</span>
              {match.group && (
                <span className="text-[11px] text-muted-foreground">{match.group}</span>
              )}
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 space-y-1">
                <TeamBadge name={match.team1} />
                <TeamBadge name={match.team2} />
              </div>

              <div className="text-right shrink-0">
                {match.score ? (
                  <div className="text-xl font-bold tabular-nums">
                    <span>{match.score.ft[0]}</span>
                    <span className="text-muted-foreground mx-1">-</span>
                    <span>{match.score.ft[1]}</span>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">-</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {formatDate(match.date)}
                {match.time && ` · ${match.time.split('UTC')[0].trim()}`}
              </span>
              <span className="flex items-center gap-1 truncate">
                <MapPin className="size-3 shrink-0" />
                {match.ground}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
