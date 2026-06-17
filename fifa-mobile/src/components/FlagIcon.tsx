import { Image, StyleSheet } from 'react-native'
import { getFlagUrl } from '../lib/api'

export function FlagIcon({ name, size = 24 }: { name: string; size?: number }) {
  const src = getFlagUrl(name)
  if (!src) return null
  return (
    <Image
      source={{ uri: src }}
      style={[styles.flag, { width: size, height: size }]}
    />
  )
}

const styles = StyleSheet.create({
  flag: {
    borderRadius: 999,
  },
})
