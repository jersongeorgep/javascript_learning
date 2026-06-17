import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { fetchMatches } from '../lib/api'
import { MatchCard } from '../components/MatchCard'
import { colors } from '../lib/theme'
import { useColorScheme } from 'react-native'
import { useState } from 'react'
const FILTERS = ['all', 'group', 'r32', 'r16', 'qf', 'sf', 'third', 'final'] as const
const FILTER_LABELS: Record<string, string> = {
  all: 'All', group: 'Group', r32: 'R32', r16: 'R16', qf: 'QF', sf: 'SF', third: '3rd', final: 'Final',
}

type Props = {
  navigation: any
}

export default function MatchesScreen({ navigation }: Props) {
  const scheme = useColorScheme()
  const c = scheme === 'dark' ? colors.dark : colors.light
  const { data: matches, isLoading } = useQuery({ queryKey: ['matches'], queryFn: fetchMatches })
  const [filter, setFilter] = useState('all')
  const [showUpcoming, setShowUpcoming] = useState(false)

  if (isLoading) {
    return (
      <View style={[styles.screen, { backgroundColor: c.background }]}>
        <Text style={[styles.loadingText, { color: c.mutedForeground }]}>Loading...</Text>
      </View>
    )
  }

  let filtered = matches || []
  if (filter !== 'all') {
    filtered = filtered.filter(m => {
      const r = (m.round || '').toLowerCase()
      if (filter === 'group') return r.includes('matchday')
      return r.includes(filter)
    })
  }
  if (showUpcoming) filtered = filtered.filter(m => m.status !== 'finished')

  const sorted = [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <View style={[styles.screen, { backgroundColor: c.background }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterContent}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterBtn, filter === f && { backgroundColor: c.primary }]}
          >
            <Text style={[styles.filterText, { color: filter === f ? '#fff' : c.mutedForeground }]}>
              {FILTER_LABELS[f]}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => setShowUpcoming(!showUpcoming)}
          style={[styles.filterBtn, showUpcoming && { backgroundColor: c.primary }]}
        >
          <Text style={[styles.filterText, { color: showUpcoming ? '#fff' : c.mutedForeground }]}>
            Upcoming
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView contentContainerStyle={styles.list}>
        {sorted.map(m => (
          <MatchCard key={m.id} match={m} onPress={() => navigation.navigate('MatchDetail', { id: m.id })} />
        ))}
        {sorted.length === 0 && (
          <Text style={[styles.emptyText, { color: c.mutedForeground }]}>No matches found</Text>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  loadingText: { textAlign: 'center', marginTop: 40 },
  filterBar: { maxHeight: 44 },
  filterContent: { flexDirection: 'row', padding: 8, gap: 6 },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f4f4f5',
  },
  filterText: { fontSize: 12, fontWeight: '600' },
  list: { padding: 12, paddingBottom: 32 },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 13 },
})
