import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { fetchTeams, fetchMatches } from '../lib/api'
import { FlagIcon } from '../components/FlagIcon'
import { colors } from '../lib/theme'
import { useColorScheme } from 'react-native'
import { useState } from 'react'
type Props = {
  navigation: any
}

export default function TeamsScreen({ navigation }: Props) {
  const scheme = useColorScheme()
  const c = scheme === 'dark' ? colors.dark : colors.light
  const { data: teams, isLoading } = useQuery({ queryKey: ['teams'], queryFn: fetchTeams })
  const { data: matches } = useQuery({ queryKey: ['matches'], queryFn: fetchMatches })
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('')

  if (isLoading) {
    return (
      <View style={[styles.screen, { backgroundColor: c.background }]}>
        <Text style={{ color: c.mutedForeground, textAlign: 'center', marginTop: 40 }}>Loading...</Text>
      </View>
    )
  }

  const all = teams || []
  const groups = [...new Set(all.map(t => t.group))].sort()

  let filtered = all
  if (group) filtered = filtered.filter(t => t.group === group)
  if (query) filtered = filtered.filter(t => t.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <View style={[styles.screen, { backgroundColor: c.background }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterContent}>
        <TouchableOpacity
          onPress={() => setGroup('')}
          style={[styles.filterBtn, !group && { backgroundColor: c.primary }]}
        >
          <Text style={[styles.filterText, { color: !group ? '#fff' : c.mutedForeground }]}>All</Text>
        </TouchableOpacity>
        {groups.map(g => (
          <TouchableOpacity
            key={g}
            onPress={() => setGroup(g)}
            style={[styles.filterBtn, group === g && { backgroundColor: c.primary }]}
          >
            <Text style={[styles.filterText, { color: group === g ? '#fff' : c.mutedForeground }]}>Group {g}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search teams..."
          placeholderTextColor={c.mutedForeground}
          value={query}
          onChangeText={setQuery}
          style={[styles.searchInput, { backgroundColor: c.muted, color: c.foreground, borderColor: c.border }]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map(team => {
          const teamMatches = (matches || []).filter(m => m.team1 === team.name || m.team2 === team.name)
          return (
            <TouchableOpacity
              key={team.id}
              onPress={() => navigation.navigate('TeamDetail', { id: team.id })}
              activeOpacity={0.7}
              style={[styles.teamCard, { backgroundColor: c.card, borderColor: c.border }]}
            >
              <FlagIcon name={team.name} size={36} />
              <View style={styles.teamInfo}>
                <Text style={[styles.teamName, { color: c.foreground }]}>{team.name}</Text>
                <Text style={[styles.teamMeta, { color: c.mutedForeground }]}>
                  {team.code} · Group {team.group} · {team.confederation}
                </Text>
              </View>
              <View style={styles.matchCount}>
                <Text style={[styles.matchNum, { color: c.foreground }]}>{teamMatches.length}</Text>
                <Text style={[styles.matchLabel, { color: c.mutedForeground }]}>Matches</Text>
              </View>
            </TouchableOpacity>
          )
        })}
        {filtered.length === 0 && (
          <Text style={[styles.emptyText, { color: c.mutedForeground }]}>No teams found</Text>
        )}
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
  searchBar: { paddingHorizontal: 12, paddingVertical: 8 },
  searchInput: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  list: { padding: 12, paddingBottom: 32 },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  teamInfo: { flex: 1, marginLeft: 12 },
  teamName: { fontSize: 14, fontWeight: '600' },
  teamMeta: { fontSize: 11, marginTop: 2 },
  matchCount: { alignItems: 'center' },
  matchNum: { fontSize: 18, fontWeight: '700' },
  matchLabel: { fontSize: 9 },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 13 },
})
