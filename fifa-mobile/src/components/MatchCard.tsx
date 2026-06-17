import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FlagIcon } from './FlagIcon'
import { colors } from '../lib/theme'
import type { Match } from '../lib/types'
import { useColorScheme } from 'react-native'

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00Z')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function MatchCard({ match, onPress }: { match: Match; onPress: () => void }) {
  const scheme = useColorScheme()
  const c = scheme === 'dark' ? colors.dark : colors.light

  const isFinished = match.status === 'finished'
  const isLive = match.status === 'live'

  const statusStyle = isLive
    ? { backgroundColor: c.greenBg }
    : isFinished
    ? { backgroundColor: c.muted }
    : { backgroundColor: c.blueBg }

  const statusText = isLive ? 'LIVE' : isFinished ? 'FT' : 'UP'
  const statusColor = isLive ? c.greenText : isFinished ? c.mutedForeground : c.blueText

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
        <View style={styles.header}>
          <View style={[styles.badge, statusStyle]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>{statusText}</Text>
          </View>
          <Text style={[styles.round, { color: c.mutedForeground }]}>{match.round}</Text>
          {match.group && (
            <Text style={[styles.round, { color: c.mutedForeground }]}>{match.group}</Text>
          )}
        </View>

        <View style={styles.body}>
          <View style={styles.teamRow}>
            <TeamBadge name={match.team1} />
          </View>
          <View style={styles.scoreCol}>
            {match.score ? (
              <Text style={[styles.score, { color: c.foreground }]}>
                {match.score.ft[0]} - {match.score.ft[1]}
              </Text>
            ) : (
              <Text style={[styles.score, { color: c.mutedForeground }]}>-</Text>
            )}
          </View>
          <View style={styles.teamRow}>
            <TeamBadge name={match.team2} />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.meta, { color: c.mutedForeground }]}>
            {formatDate(match.date)}{match.time ? ` · ${match.time.split('UTC')[0].trim()}` : ''}
          </Text>
          <Text style={[styles.meta, { color: c.mutedForeground }]} numberOfLines={1}>
            🏟 {match.ground}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

function TeamBadge({ name }: { name: string }) {
  return (
    <View style={styles.teamBadge}>
      <FlagIcon name={name} size={20} />
      <Text style={[styles.teamName, { color: useColorScheme() === 'dark' ? colors.dark.foreground : colors.light.foreground }]} numberOfLines={1}>
        {name}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  round: {
    fontSize: 11,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  teamRow: {
    flex: 1,
  },
  scoreCol: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  score: {
    fontSize: 20,
    fontWeight: '700',
  },
  teamBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '500',
    flexShrink: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  meta: {
    fontSize: 11,
  },
})
