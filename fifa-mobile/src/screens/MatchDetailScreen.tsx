import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { fetchMatches } from '../lib/api'
import { FlagIcon } from '../components/FlagIcon'
import { colors } from '../lib/theme'
import { useColorScheme } from 'react-native'
import { useRoute, type RouteProp } from '@react-navigation/native'
import type { RootStackParamList } from '../../App'

type Route = RouteProp<RootStackParamList, 'MatchDetail'>

export default function MatchDetailScreen() {
  const scheme = useColorScheme()
  const c = scheme === 'dark' ? colors.dark : colors.light
  const route = useRoute<Route>()
  const { data: matches, isLoading } = useQuery({ queryKey: ['matches'], queryFn: fetchMatches })

  if (isLoading) {
    return (
      <View style={[styles.screen, { backgroundColor: c.background }]}>
        <Text style={{ color: c.mutedForeground, textAlign: 'center', marginTop: 40 }}>Loading...</Text>
      </View>
    )
  }

  const match = (matches || []).find(m => m.id === route.params.id)

  if (!match) {
    return (
      <View style={[styles.screen, { backgroundColor: c.background }]}>
        <Text style={{ color: c.mutedForeground, textAlign: 'center', marginTop: 40 }}>Match not found</Text>
      </View>
    )
  }

  const isFinished = match.status === 'finished'
  const isLive = match.status === 'live'

  return (
    <ScrollView style={[styles.screen, { backgroundColor: c.background }]} contentContainerStyle={{ padding: 16 }}>
      {/* Scoreboard */}
      <View style={[styles.scoreboard, { backgroundColor: c.card, borderColor: c.border }]}>
        <View style={styles.matchInfo}>
          <View style={[styles.statusBadge, isLive && { backgroundColor: '#dcfce7' }]}>
            <Text style={[styles.statusText, isLive && { color: '#166534' }]}>
              {isLive ? 'LIVE' : isFinished ? 'Full Time' : 'Upcoming'}
            </Text>
          </View>
          <Text style={[styles.roundText, { color: c.mutedForeground }]}>
            {match.round}{match.group ? ` · ${match.group}` : ''}
          </Text>
        </View>

        <View style={styles.scoreRow}>
          <View style={styles.teamCol}>
            <FlagIcon name={match.team1} size={40} />
            <Text style={[styles.teamName, { color: c.foreground }]}>{match.team1}</Text>
          </View>

          <View style={styles.scoreCol}>
            {match.score ? (
              <>
                <Text style={[styles.score, { color: c.foreground }]}>
                  {match.score.ft[0]} - {match.score.ft[1]}
                </Text>
                <Text style={[styles.ht, { color: c.mutedForeground }]}>
                  HT: {match.score.ht[0]} - {match.score.ht[1]}
                </Text>
              </>
            ) : (
              <Text style={[styles.score, { color: c.mutedForeground }]}>vs</Text>
            )}
          </View>

          <View style={styles.teamCol}>
            <FlagIcon name={match.team2} size={40} />
            <Text style={[styles.teamName, { color: c.foreground }]}>{match.team2}</Text>
          </View>
        </View>

        <Text style={[styles.metaText, { color: c.mutedForeground }]}>
          {match.time ? match.time.split('UTC')[0].trim() : match.date} · {match.ground}
        </Text>
      </View>

      {/* Goals */}
      <View style={styles.goalsRow}>
        <GoalList title={match.team1} goals={match.goals1} c={c} />
        <GoalList title={match.team2} goals={match.goals2} c={c} />
      </View>
    </ScrollView>
  )
}

function GoalList({ title, goals, c }: { title: string; goals?: { name: string; minute: string; penalty?: boolean; owngoal?: boolean }[]; c: any }) {
  return (
    <View style={[styles.goalBox, { backgroundColor: c.card, borderColor: c.border }]}>
      <View style={styles.goalHeader}>
        <FlagIcon name={title} size={18} />
        <Text style={[styles.goalTitle, { color: c.foreground }]}>{title}</Text>
      </View>
      {goals && goals.length > 0 ? (
        goals.map((g, i) => (
          <View key={i} style={styles.goalItem}>
            <View style={styles.goalDot} />
            <Text style={[styles.goalName, { color: c.foreground }]}>{g.name}</Text>
            <Text style={[styles.goalMin, { color: c.mutedForeground }]}>
              {g.minute}&apos;{g.penalty ? ' (P)' : ''}{g.owngoal ? ' (OG)' : ''}
            </Text>
          </View>
        ))
      ) : (
        <Text style={[styles.noGoals, { color: c.mutedForeground }]}>No goals</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scoreboard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
  },
  matchInfo: { alignItems: 'center', marginBottom: 12 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#f4f4f5',
  },
  statusText: { fontSize: 11, fontWeight: '600' },
  roundText: { fontSize: 12, marginTop: 4 },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 12,
  },
  teamCol: { flex: 1, alignItems: 'center', gap: 6 },
  teamName: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  scoreCol: { paddingHorizontal: 16, alignItems: 'center' },
  score: { fontSize: 28, fontWeight: '700' },
  ht: { fontSize: 11, marginTop: 2 },
  metaText: { fontSize: 11, textAlign: 'center' },
  goalsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  goalBox: { flex: 1, borderRadius: 10, borderWidth: 1, padding: 10 },
  goalHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  goalTitle: { fontSize: 12, fontWeight: '600' },
  goalItem: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  goalDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e' },
  goalName: { fontSize: 12, flex: 1 },
  goalMin: { fontSize: 11 },
  noGoals: { fontSize: 12, fontStyle: 'italic' },
})
