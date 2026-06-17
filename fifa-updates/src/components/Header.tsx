'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'
import { Button } from '@/components/ui/button'
import { Trophy, Sun, Moon, Menu, X, CalendarDays, Table2, Users, Shield } from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { href: '/', label: 'Home', icon: Trophy },
  { href: '/matches', label: 'Matches', icon: CalendarDays },
  { href: '/standings', label: 'Standings', icon: Table2 },
  { href: '/teams', label: 'Teams', icon: Users },
  { href: '/bracket', label: 'Bracket', icon: Shield },
]

export function Header() {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-6xl items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg mr-6">
          <Trophy className="size-5 text-yellow-500" />
          <span className="hidden sm:inline">World Cup 2026</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1">
          {NAV.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href}>
                <Button variant={active ? 'secondary' : 'ghost'} size="sm" className="gap-1.5">
                  <Icon className="size-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="icon" onClick={toggle}>
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t p-2 bg-background">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                  <Button variant={active ? 'secondary' : 'ghost'} size="sm" className="w-full justify-start gap-2">
                    <Icon className="size-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
