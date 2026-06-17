'use client'

import { FlagIcon } from '@/components/FlagIcon'
import type { StandingsEntry } from '@/lib/types'

export function StandingsTable({ entries }: { entries: StandingsEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground py-4 text-center">No standings data available yet.</p>
  }

  const sorted = [...entries].sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-muted-foreground text-[11px] uppercase tracking-wider">
            <th className="text-left py-2 pr-2 font-medium">#</th>
            <th className="text-left py-2 pr-2 font-medium">Team</th>
            <th className="text-center py-2 px-1 font-medium">P</th>
            <th className="text-center py-2 px-1 font-medium">W</th>
            <th className="text-center py-2 px-1 font-medium">D</th>
            <th className="text-center py-2 px-1 font-medium">L</th>
            <th className="text-center py-2 px-1 font-medium">GF</th>
            <th className="text-center py-2 px-1 font-medium">GA</th>
            <th className="text-center py-2 px-1 font-medium">GD</th>
            <th className="text-center py-2 pl-1 font-medium">Pts</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((entry, i) => {
            const isQual = i < 2
            return (
              <tr key={entry.team} className={`border-b last:border-0 hover:bg-muted/50 transition-colors ${isQual ? 'bg-green-50/50 dark:bg-green-950/20' : ''}`}>
                <td className="py-2 pr-2 text-muted-foreground tabular-nums">{i + 1}</td>
                <td className="py-2 pr-2">
                  <div className="flex items-center gap-2">
                    <FlagIcon name={entry.team} className="size-5 shrink-0" />
                    <span className="font-medium truncate max-w-[140px]">{entry.team}</span>
                  </div>
                </td>
                <td className="text-center py-2 px-1 tabular-nums">{entry.p}</td>
                <td className="text-center py-2 px-1 tabular-nums">{entry.w}</td>
                <td className="text-center py-2 px-1 tabular-nums">{entry.d}</td>
                <td className="text-center py-2 px-1 tabular-nums">{entry.l}</td>
                <td className="text-center py-2 px-1 tabular-nums">{entry.gf}</td>
                <td className="text-center py-2 px-1 tabular-nums">{entry.ga}</td>
                <td className={`text-center py-2 px-1 tabular-nums font-medium ${entry.gd > 0 ? 'text-green-600' : entry.gd < 0 ? 'text-red-500' : ''}`}>
                  {entry.gd > 0 ? `+${entry.gd}` : entry.gd}
                </td>
                <td className="text-center py-2 pl-1 font-bold tabular-nums">{entry.pts}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="mt-1 text-[10px] text-muted-foreground">
        <span className="inline-block w-2 h-2 rounded-sm bg-green-100 dark:bg-green-900/50 mr-1 align-middle" />
        Top 2 qualify for knockout stage
      </div>
    </div>
  )
}
