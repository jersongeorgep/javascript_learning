import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { fetchMatches } from '../lib/api'
import { FlagIcon } from '../components/FlagIcon'
import { colors } from '../lib/theme'
import { useColorScheme } from 'react-native'
import type { Match } from '../lib/types'

function BracketMatch({ match }: { match?: Match }) {
  const scheme = useColorScheme()
  const c = scheme === 'dark' ? colors.dark : colors.light
  if (!match) return null

  return (
    <View style={[styles.bracketCard, { backgroundColor: c.card, borderColor: c.border }]}>
      <View style={styles.bracketTeam}>
        <FlagIcon name={match.team1} size={16} />
        <Text style={[styles.bracketTeamText, { color: c.foreground }]} numberOfLines={1}>{match.team1}</Text>
        {match.score && <Text style={[styles.bracketScore, { color: c.foreground }]}>{match.score.ft[0]}</Text>}
      </View>
      <View style={styles.bracketTeam}>
        <FlagIcon name={match.team2} size={16} />
        <Text style={[styles.bracketTeamText, { color: c.foreground }]} numberOfLines={1}>{match.team2}</Text>
        {match.score && <Text style={[styles.bracketScore, { color: c.foreground }]}>{match.score.ft[1]}</Text>}
      </View>
      {!match.score && <Text style={[styles.tbd, { color: c.mutedForeground }]}>TBD</Text>}
    </View>
  )
}

function BracketRound({ label, matches }: { label: string; matches: Match[] }) {
  const scheme = useColorScheme()
  const c = scheme === 'dark' ? colors.dark : colors.light
  if (matches.length === 0) return null
  return (
    <View style={styles.roundSection}>
      <Text style={[styles.roundLabel, { color: c.mutedForeground }]}>{label}</Text>
      {matches.map(m => (
        <BracketMatch key={m.id} match={m} />
      ))}
    </View>
  )
}

export default function BracketScreen() {
  const scheme = useColorScheme()
  const c = scheme === 'dark' ? colors.dark : colors.light
  const { data: matches, isLoading } = useQuery({ queryKey: ['matches'], queryFn: fetchMatches })

  if (isLoading) {
    return (
      <View style={[styles.screen, { backgroundColor: c.background }]}>
        <Text style={{ color: c.mutedForeground, textAlign: 'center', marginTop: 40 }}>Loading...</Text>
      </View>
    )
  }

  const r32 = (matches || []).filter(m => m.round?.toLowerCase().includes('round of 32'))
  const r16 = (matches || []).filter(m => m.round?.toLowerCase().includes('round of 16'))
  const qf = (matches || []).filter(m => m.round?.toLowerCase().includes('quarter'))
  const sf = (matches || []).filter(m => m.round?.toLowerCase().includes('semi'))
  const third = (matches || []).filter(m => m.round?.toLowerCase().includes('third'))
  const finalMatch = (matches || []).filter(m => m.round?.toLowerCase().includes('final'))

  return (
    <ScrollView style={[styles.screen, { backgroundColor: c.background }]} contentContainerStyle={{ padding: 12, paddingBottom: 32 }}>
      {r32.length > 0 && <BracketRound label="Round of 32" matches={r32} />}
      <BracketRound label="Round of 16" matches={r16} />
      <BracketRound label="Quarter-finals" matches={qf} />
      <BracketRound label="Semi-finals" matches={sf} />
      <BracketRound label="Third Place" matches={third} />
      <BracketRound label="Final" matches={finalMatch} />

      {r32.length === 0 && (
        <Text style={{ textAlign: 'center', marginTop: 40, color: c.mutedForeground }}>
          Knockout bracket available after group stage
        </Text>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  roundSection: { marginBottom: 16 },
  roundLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, textAlign: 'center' },
  bracketCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 8,
    marginBottom: 6,
  },
  bracketTeam: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  bracketTeamText: { fontSize: 12, fontWeight: '500', flex: 1 },
  bracketScore: { fontSize: 12, fontWeight: '700' },
  tbd: { fontSize: 10, textAlign: 'center', fontStyle: 'italic' },
})
