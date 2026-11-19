'use client'

import { useEffect, useState } from 'react'

type CountdownProps = {
  expiresAt: string | null
  onExpire?: () => void
}

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
}

const ZERO: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, expired: false }

function calculateTimeLeft(expiresAt: string | null): TimeLeft {
  if (!expiresAt) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  }

  const diff = new Date(expiresAt).getTime() - Date.now()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  }
}

export default function Countdown({ expiresAt, onExpire }: CountdownProps) {
  // On démarre toujours à ZERO (identique serveur + client)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(ZERO)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeLeft(calculateTimeLeft(expiresAt))

    const timer = setInterval(() => {
      const next = calculateTimeLeft(expiresAt)
      setTimeLeft(next)
      if (next.expired && onExpire) onExpire()
    }, 1000)

    return () => clearInterval(timer)
  }, [expiresAt, onExpire])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="bg-black/60 rounded-xl p-3 border border-white/5 text-center">
      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
        Disparition dans
      </p>
      <div className="grid grid-cols-4 gap-1 text-center font-mono">
        <div className="bg-white/5 rounded p-1">
          <span className="block text-base font-bold text-amber-300">
            {mounted ? pad(timeLeft.days) : '--'}
          </span>
          <span className="text-[8px] text-gray-400 uppercase">Jours</span>
        </div>
        <div className="bg-white/5 rounded p-1">
          <span className="block text-base font-bold text-amber-300">
            {mounted ? pad(timeLeft.hours) : '--'}
          </span>
          <span className="text-[8px] text-gray-400 uppercase">Heures</span>
        </div>
        <div className="bg-white/5 rounded p-1">
          <span className="block text-base font-bold text-amber-300">
            {mounted ? pad(timeLeft.minutes) : '--'}
          </span>
          <span className="text-[8px] text-gray-400 uppercase">Min</span>
        </div>
        <div className="bg-white/5 rounded p-1">
          <span className="block text-base font-bold text-amber-300">
            {mounted ? pad(timeLeft.seconds) : '--'}
          </span>
          <span className="text-[8px] text-gray-400 uppercase">Sec</span>
        </div>
      </div>
    </div>
  )
}