import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { fetchTeams, fetchMatches, fetchStandings } from '../lib/api'
import { FlagIcon } from '../components/FlagIcon'
import { MatchCard } from '../components/MatchCard'
import { colors } from '../lib/theme'
import { useColorScheme } from 'react-native'
import { useRoute, type RouteProp } from '@react-navigation/native'
import type { RootStackParamList } from '../../App'

type Route = RouteProp<RootStackParamList, 'TeamDetail'>

export default function TeamDetailScreen() {
  const scheme = useColorScheme()
  const c = scheme === 'dark' ? colors.dark : colors.light
  const route = useRoute<Route>()
  const { data: teams } = useQuery({ queryKey: ['teams'], queryFn: fetchTeams })
  const { data: matches } = useQuery({ queryKey: ['matches'], queryFn: fetchMatches })
  const { data: standings } = useQuery({ queryKey: ['standings'], queryFn: fetchStandings })

  const team = (teams || []).find(t => t.id === route.params.id)

  if (!team) {
    return (
      <View style={[styles.screen, { backgroundColor: c.background }]}>
        <Text style={{ color: c.mutedForeground, textAlign: 'center', marginTop: 40 }}>Team not found</Text>
      </View>
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
    <ScrollView style={[styles.screen, { backgroundColor: c.background }]} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <View style={[styles.hero, { backgroundColor: c.card, borderColor: c.border }]}>
        <FlagIcon name={team.name} size={56} />
        <Text style={[styles.teamName, { color: c.foreground }]}>{team.name}</Text>
        <Text style={[styles.teamMeta, { color: c.mutedForeground }]}>
          {team.code} · Group {team.group} · {team.confederation}
        </Text>
      </View>

      {standing && (
        <View style={[styles.statsRow, { backgroundColor: c.card, borderColor: c.border }]}>
          {[
            { l: 'P', v: standing.p },
            { l: 'W', v: standing.w },
            { l: 'D', v: standing.d },
            { l: 'L', v: standing.l },
            { l: 'GF', v: standing.gf },
            { l: 'GA', v: standing.ga },
            { l: 'Pts', v: standing.pts },
          ].map(s => (
            <View key={s.l} style={styles.statItem}>
              <Text style={[styles.statValue, { color: c.foreground }]}>{s.v}</Text>
              <Text style={[styles.statLabel, { color: c.mutedForeground }]}>{s.l}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={[styles.sectionTitle, { color: c.foreground }]}>Matches</Text>
      {teamMatches.map(m => (
        <MatchCard key={m.id} match={m} onPress={() => {}} />
      ))}
      {teamMatches.length === 0 && (
        <Text style={[styles.emptyText, { color: c.mutedForeground }]}>No matches yet</Text>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  hero: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  teamName: { fontSize: 22, fontWeight: '700', marginTop: 8 },
  teamMeta: { fontSize: 13, marginTop: 4 },
  statsRow: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
  },
  statValue: { fontSize: 16, fontWeight: '700' },
  statLabel: { fontSize: 10, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  emptyText: { textAlign: 'center', paddingVertical: 24, fontSize: 13 },
})
