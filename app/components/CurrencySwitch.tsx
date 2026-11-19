'use client'

import { useCurrency, CurrencyCode } from '@/lib/currency/CurrencyContext'

const CURRENCIES: { code: CurrencyCode; label: string }[] = [
  { code: 'EUR', label: 'EUR' },
  { code: 'USD', label: 'USD' },
  { code: 'TND', label: 'TND' },
]

export default function CurrencySwitch() {
  const { currency, setCurrency } = useCurrency()

  return (
    <div className="flex items-center bg-black/40 rounded-lg border border-white/10 p-0.5">
      {CURRENCIES.map((c) => (
        <button
          key={c.code}
          onClick={() => setCurrency(c.code)}
          className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
            currency === c.code
              ? 'bg-amber-500 text-black'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}