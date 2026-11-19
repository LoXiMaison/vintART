'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export type CurrencyCode = 'EUR' | 'USD' | 'TND'

export type ExchangeRate = {
  code: CurrencyCode
  rate: number
  symbol: string
}

type CurrencyContextType = {
  currency: CurrencyCode
  setCurrency: (c: CurrencyCode) => void
  rates: Record<CurrencyCode, ExchangeRate>
  format: (amount: number, from?: CurrencyCode) => string
  loading: boolean
}

const DEFAULT_RATES: Record<CurrencyCode, ExchangeRate> = {
  EUR: { code: 'EUR', rate: 1, symbol: '€' },
  USD: { code: 'USD', rate: 1.08, symbol: '$' },
  TND: { code: 'TND', rate: 3.35, symbol: 'DT' },
}

const CurrencyContext = createContext<CurrencyContextType | null>(null)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('EUR')
  const [rates, setRates] = useState<Record<CurrencyCode, ExchangeRate>>(DEFAULT_RATES)
  const [loading, setLoading] = useState(true)

  // Charge les taux depuis la DB
  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('exchange_rates').select('*')
      if (data && data.length > 0) {
        const map = { ...DEFAULT_RATES }
        data.forEach((r) => {
          if (r.code === 'EUR' || r.code === 'USD' || r.code === 'TND') {
            map[r.code as CurrencyCode] = {
              code: r.code as CurrencyCode,
              rate: Number(r.rate),
              symbol: r.symbol,
            }
          }
        })
        setRates(map)
      }
      setLoading(false)
    }
    load()

    // Charge la devise choisie depuis le localStorage
    const saved = localStorage.getItem('vintart_currency') as CurrencyCode | null
    if (saved && ['EUR', 'USD', 'TND'].includes(saved)) {
      setCurrencyState(saved)
    }
  }, [])

  function setCurrency(c: CurrencyCode) {
    setCurrencyState(c)
    localStorage.setItem('vintart_currency', c)
  }

function convert(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return amount
  // Tout passe par EUR comme pivot
  const eurRates = rates  // { EUR: 1, USD: 1.08, TND: 3.35 }
  const inEur = amount / eurRates[from].rate
  return inEur * eurRates[to].rate
}

function format(amount: number, from: CurrencyCode = 'EUR'): string {
  const r = rates[currency]
  const converted = convert(amount, from, currency)
  const rounded = currency === 'TND'
    ? Math.round(converted * 10) / 10
    : Math.round(converted * 100) / 100
  return `${rounded.toFixed(currency === 'TND' ? 1 : 2)} ${r.symbol}`
}

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, format, loading }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider')
  return ctx
}