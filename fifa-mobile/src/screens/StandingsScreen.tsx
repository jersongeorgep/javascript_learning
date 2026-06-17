import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { fetchStandings } from '../lib/api'
import { StandingsTable } from '../components/StandingsTable'
import { colors } from '../lib/theme'
import { useColorScheme } from 'react-native'
import { useState } from 'react'

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export default function StandingsScreen() {
  const scheme = useColorScheme()
  const c = scheme === 'dark' ? colors.dark : colors.light
  const { data: standings, isLoading } = useQuery({ queryKey: ['standings'], queryFn: fetchStandings })
  const [selected, setSelected] = useState('all')

  if (isLoading) {
    return (
      <View style={[styles.screen, { backgroundColor: c.background }]}>
        <Text style={{ color: c.mutedForeground, textAlign: 'center', marginTop: 40 }}>Loading...</Text>
      </View>
    )
  }

  const filtered = selected === 'all'
    ? standings || []
    : (standings || []).filter(g => g.group === selected)

  return (
    <View style={[styles.screen, { backgroundColor: c.background }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterContent}>
        {['all', ...GROUPS].map(g => (
          <TouchableOpacity
            key={g}
            onPress={() => setSelected(g)}
            style={[styles.filterBtn, selected === g && { backgroundColor: c.primary }]}
          >
            <Text style={[styles.filterText, { color: selected === g ? '#fff' : c.mutedForeground }]}>
              {g === 'all' ? 'All' : `Group ${g}`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map(g => (
          <View key={g.group} style={[styles.groupBox, { backgroundColor: c.card, borderColor: c.border }]}>
            <Text style={[styles.groupTitle, { color: c.foreground }]}>Group {g.group}</Text>
            <StandingsTable entries={g.teams} />
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
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
})
