import Image from 'next/image'
import { getFlagUrl } from '@/lib/api'

export function FlagIcon({ name, className = 'size-5' }: { name: string; className?: string }) {
  const src = getFlagUrl(name)
  if (!src) return null
  return (
    <Image
      src={src}
      alt={`${name} flag`}
      width={20}
      height={20}
      className={`${className} shrink-0 rounded-full object-cover`}
      unoptimized
    />
  )
}
