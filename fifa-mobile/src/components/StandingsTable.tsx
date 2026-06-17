import { View, Text, StyleSheet } from 'react-native'
import { FlagIcon } from './FlagIcon'
import { colors } from '../lib/theme'
import type { StandingsEntry } from '../lib/types'
import { useColorScheme } from 'react-native'

export function StandingsTable({ entries }: { entries: StandingsEntry[] }) {
  const scheme = useColorScheme()
  const c = scheme === 'dark' ? colors.dark : colors.light

  const sorted = [...entries].sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)

  return (
    <View style={styles.container}>
      <View style={[styles.headerRow, { borderBottomColor: c.border }]}>
        <Text style={[styles.headerCell, styles.posCell]}>#</Text>
        <Text style={[styles.headerCell, styles.teamCell]}>Team</Text>
        <Text style={styles.headerCell}>P</Text>
        <Text style={styles.headerCell}>W</Text>
        <Text style={styles.headerCell}>D</Text>
        <Text style={styles.headerCell}>L</Text>
        <Text style={styles.headerCell}>GF</Text>
        <Text style={styles.headerCell}>GA</Text>
        <Text style={styles.headerCell}>GD</Text>
        <Text style={[styles.headerCell, styles.ptsCell]}>Pts</Text>
      </View>

      {sorted.map((entry, i) => {
        const isQual = i < 2
        return (
          <View
            key={entry.team}
            style={[
              styles.row,
              { borderBottomColor: c.border },
              isQual && { backgroundColor: c.greenBg },
            ]}
          >
            <Text style={[styles.cell, styles.posCell, { color: c.mutedForeground }]}>{i + 1}</Text>
            <View style={[styles.cell, styles.teamCell, styles.teamFlex]}>
              <FlagIcon name={entry.team} size={18} />
              <Text style={[styles.teamText, { color: c.foreground }]} numberOfLines={1}>
                {entry.team}
              </Text>
            </View>
            <Text style={styles.cell}>{entry.p}</Text>
            <Text style={styles.cell}>{entry.w}</Text>
            <Text style={styles.cell}>{entry.d}</Text>
            <Text style={styles.cell}>{entry.l}</Text>
            <Text style={styles.cell}>{entry.gf}</Text>
            <Text style={styles.cell}>{entry.ga}</Text>
            <Text
              style={[
                styles.cell,
                entry.gd > 0 && { color: '#16a34a' },
                entry.gd < 0 && { color: '#ef4444' },
              ]}
            >
              {entry.gd > 0 ? `+${entry.gd}` : entry.gd}
            </Text>
            <Text style={[styles.cell, styles.ptsCell, { fontWeight: '700' }]}>{entry.pts}</Text>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  headerCell: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#71717a',
    textAlign: 'center',
    width: 24,
  },
  posCell: { width: 20, textAlign: 'left' },
  teamCell: { flex: 1, textAlign: 'left' },
  ptsCell: { width: 28, textAlign: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
  },
  cell: {
    fontSize: 13,
    textAlign: 'center',
    width: 24,
    color: '#111',
  },
  teamFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  teamText: {
    fontSize: 13,
    fontWeight: '500',
    flexShrink: 1,
  },
})
