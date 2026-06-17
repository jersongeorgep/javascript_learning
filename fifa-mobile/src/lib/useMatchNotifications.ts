import { useEffect, useRef } from 'react'
import { AppState, type AppStateStatus } from 'react-native'
import * as Notifications from 'expo-notifications'
import type { Match } from './types'
import { fetchMatches } from './api'
import {
  registerForPushNotifications,
  setupNotificationChannel,
  setupForegroundHandler,
  showLocalNotification,
  scheduleMatchReminder,
  cancelScheduledNotification,
  type NotificationData,
} from './notifications'

const POLL_INTERVAL = 30_000

interface MatchSnapshot {
  [matchId: string]: {
    status: string
    score1: number | null
    score2: number | null
  }
}

function matchScore(m: Match): [number | null, number | null] {
  if (!m.score?.ft) return [null, null]
  return m.score.ft
}

function buildSnapshot(matches: Match[]): MatchSnapshot {
  const snap: MatchSnapshot = {}
  for (const m of matches) {
    const [s1, s2] = matchScore(m)
    snap[m.id] = { status: m.status, score1: s1, score2: s2 }
  }
  return snap
}

function isMatchLiveNow(m: Match): boolean {
  if (m.status === 'live') return true
  const matchDate = new Date(m.date + 'T' + (m.time || '20:00') + ':00')
  const now = new Date()
  const twoHoursLater = new Date(matchDate.getTime() + 120 * 60_000)
  return now >= matchDate && now <= twoHoursLater
}

export function useMatchNotifications() {
  const prevSnapshot = useRef<MatchSnapshot>({})
  const reminderIds = useRef<Map<string, string>>(new Map())
  const reminded = useRef<Set<string>>(new Set())
  const notifiedLive = useRef<Set<string>>(new Set())

  useEffect(() => {
    setupForegroundHandler()

    const check = async () => {
      try {
        const matches = await fetchMatches()
        const current = buildSnapshot(matches)

        for (const m of matches) {
          const p = prevSnapshot.current[m.id]
          const [s1, s2] = matchScore(m)
          const liveNow = isMatchLiveNow(m)

          if (liveNow && !notifiedLive.current.has(m.id)) {
            notifiedLive.current.add(m.id)
            await showLocalNotification({
              type: 'match_start',
              matchId: m.id,
              team1: m.team1,
              team2: m.team2,
            })
            continue
          }

          if (p && p.status === 'live' && m.status === 'finished') {
            await showLocalNotification({
              type: 'match_end',
              matchId: m.id,
              team1: m.team1,
              team2: m.team2,
              score1: s1 ?? 0,
              score2: s2 ?? 0,
            })
            continue
          }

          if (p && p.score1 != null && s1 != null && (s1 !== p.score1 || s2 !== p.score2)) {
            await showLocalNotification({
              type: 'score_update',
              matchId: m.id,
              team1: m.team1,
              team2: m.team2,
              score1: s1 ?? undefined,
              score2: s2 ?? undefined,
            })
          }
        }

        for (const m of matches) {
          if (m.status === 'upcoming' && !reminded.current.has(m.id)) {
            reminded.current.add(m.id)
            const id = await scheduleMatchReminder(m.id, m.team1, m.team2, m.date, m.time)
            if (id) reminderIds.current.set(m.id, id)
          }
        }

        prevSnapshot.current = current
      } catch {
        // silent
      }
    }

    const init = async () => {
      await setupNotificationChannel()
      await registerForPushNotifications()
      await check()
    }
    init()

    const interval = setInterval(check, POLL_INTERVAL)

    const sub = Notifications.addNotificationResponseReceivedListener(_response => {})

    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === 'active') check()
    }
    const appSub = AppState.addEventListener('change', handleAppState)

    return () => {
      clearInterval(interval)
      sub.remove()
      appSub.remove()
      for (const id of reminderIds.current.values()) {
        cancelScheduledNotification(id)
      }
    }
  }, [])
}
