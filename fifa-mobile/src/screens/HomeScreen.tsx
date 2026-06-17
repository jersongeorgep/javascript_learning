import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { fetchMatches, fetchStandings } from '../lib/api'
import { MatchCard } from '../components/MatchCard'
import { StandingsTable } from '../components/StandingsTable'
import { colors } from '../lib/theme'
import { useColorScheme } from 'react-native'
type Props = {
  navigation: any
}

export default function HomeScreen({ navigation }: Props) {
  const scheme = useColorScheme()
  const c = scheme === 'dark' ? colors.dark : colors.light

  const { data: matches } = useQuery({ queryKey: ['matches'], queryFn: fetchMatches })
  const { data: standings } = useQuery({ queryKey: ['standings'], queryFn: fetchStandings })

  const upcoming = (matches || [])
    .filter(m => m.status !== 'finished')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  const live = (matches || []).filter(m => m.status === 'live')

  return (
    <ScrollView style={[styles.screen, { backgroundColor: c.background }]} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: c.primary }]}>
        <Text style={styles.heroTitle}>FIFA World Cup 2026</Text>
        <Text style={styles.heroSub}>
          Follow all 104 matches, 48 teams across USA, Mexico & Canada
        </Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Teams', value: '48' },
          { label: 'Groups', value: '12' },
          { label: 'Matches', value: '104' },
          { label: 'Stadiums', value: '16' },
        ].map(s => (
          <View key={s.label} style={[styles.statBox, { backgroundColor: c.card, borderColor: c.border }]}>
            <Text style={[styles.statValue, { color: c.foreground }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: c.mutedForeground }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Live */}
      {live.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.liveDot} />
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Live Now</Text>
          </View>
          {live.map(m => (
            <MatchCard key={m.id} match={m} onPress={() => navigation.navigate('MatchDetail', { id: m.id })} />
          ))}
        </View>
      )}

      {/* Upcoming */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: c.foreground }]}>Upcoming Matches</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MatchesTab')}>
            <Text style={[styles.viewAll, { color: c.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>
        {upcoming.map(m => (
          <MatchCard key={m.id} match={m} onPress={() => navigation.navigate('MatchDetail', { id: m.id })} />
        ))}
        {upcoming.length === 0 && (
          <Text style={[styles.emptyText, { color: c.mutedForeground }]}>No upcoming matches</Text>
        )}
      </View>

      {/* Standings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: c.foreground }]}>Group Standings</Text>
          <TouchableOpacity onPress={() => navigation.navigate('StandingsTab')}>
            <Text style={[styles.viewAll, { color: c.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>
        {(standings || []).slice(0, 3).map(g => (
          <View key={g.group} style={[styles.groupBox, { backgroundColor: c.card, borderColor: c.border }]}>
            <Text style={[styles.groupTitle, { color: c.foreground }]}>Group {g.group}</Text>
            <StandingsTable entries={g.teams} />
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingBottom: 32 },
  hero: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 28,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  heroSub: {
    fontSize: 13,
    color: '#dcfce7',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  statBox: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 12,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  viewAll: {
    fontSize: 13,
    fontWeight: '500',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginRight: 6,
  },
  groupBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 24,
    fontSize: 13,
  },
})
