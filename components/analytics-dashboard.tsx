"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FollowersChart } from "./charts/followers-chart"
import { EngagementChart } from "./charts/engagement-chart"
import { PostingFrequencyChart } from "./charts/posting-frequency-chart"
import { BanksList } from "./banks-list"
import { INSURANCE_BY_MONTH } from "@/lib/monthly-data"

// Bank ma'lumotlari qanday bo'lishini aniq tip qilib beramiz
export interface Bank {
  company_name: string
  subscribers?: number        // YouTube obunachilar
  followers?: number          // Agar ishlatilsa (Instagram uchun)
  avg_views_per_post?: number
  avg_likes_per_post?: number
  avg_likes?: number          // Instagram strukturasida bo'lsa
  // kerak bo'lsa boshqa fieldlarni ham qo'shib chiqarsan
}

type MonthKey = keyof typeof INSURANCE_BY_MONTH
type MonthData = Bank[]

interface AnalyticsDashboardProps {
  onBankClick: (bank: Bank) => void
}

const MONTHS: { key: MonthKey; label: string }[] = [
  { key: "nov", label: "Noyabr" },
  { key: "dec", label: "Dekabr" },
  { key: "jan", label: "Yanvar" },
]

export function AnalyticsDashboard({ onBankClick }: AnalyticsDashboardProps) {
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>("jan")

  const currentMonthData: MonthData = (INSURANCE_BY_MONTH[selectedMonth] ?? []) as MonthData

  const stats = useMemo(() => {
    if (!currentMonthData.length) {
      return {
        totalFollowers: 0,
        avgEngagementRate: "0.00",
        avgLikes: "0.0",
        topBank: null as Bank | null,
        followersDiff: 0,
      }
    }

    // subscribers bo'lsa o'shani, bo'lmasa followers ni olamiz
    const totalFollowers = currentMonthData.reduce((sum, bank) => {
      const subs = bank.subscribers ?? bank.followers ?? 0
      return sum + subs
    }, 0)

    const engagementRates = currentMonthData.map((b) => {
      const views = b.avg_views_per_post ?? 0
      const likes = b.avg_likes_per_post ?? 0
      return views > 0 ? (likes / views) * 100 : 0
    })

    const avgEngagementRate = (
      engagementRates.reduce((a, b) => a + b, 0) / (engagementRates.length || 1)
    ).toFixed(2)

    const avgLikes = (
      currentMonthData.reduce(
        (sum, bank) => sum + (bank.avg_likes_per_post ?? bank.avg_likes ?? 0),
        0,
      ) / (currentMonthData.length || 1)
    ).toFixed(1)

    const topBank = currentMonthData.reduce((prev, current) => {
      const prevSubs = prev.subscribers ?? prev.followers ?? 0
      const currSubs = current.subscribers ?? current.followers ?? 0
      return currSubs > prevSubs ? current : prev
    })

    // Obunachilar o'sishini hisoblash - tanlangan oyga qarab
    let followersDiff = 0

    if (selectedMonth === "dec") {
      // Dekabr tanlangan bo'lsa: Dekabr - Noyabr
      const novData = (INSURANCE_BY_MONTH["nov"] ?? []) as MonthData
      const novTotalFollowers = novData.reduce((sum, bank) => {
        const subs = bank.subscribers ?? bank.followers ?? 0
        return sum + subs
      }, 0)
      followersDiff = totalFollowers - novTotalFollowers
    } else if (selectedMonth === "jan") {
      // Yanvar tanlangan bo'lsa: Yanvar - Dekabr
      const decData = (INSURANCE_BY_MONTH["dec"] ?? []) as MonthData
      const decTotalFollowers = decData.reduce((sum, bank) => {
        const subs = bank.subscribers ?? bank.followers ?? 0
        return sum + subs
      }, 0)
      followersDiff = totalFollowers - decTotalFollowers
    }
    // Noyabr uchun followersDiff = 0 (oldingi oy ma'lumoti yo'q)

    return { totalFollowers, avgEngagementRate, avgLikes, topBank, followersDiff }
  }, [currentMonthData, selectedMonth])

  // @ts-ignore
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2 md:gap-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"
                alt="YouTube"
                className="h-8 md:h-12 w-auto flex-shrink-0"
              />
              <h1 className="text-xl md:text-4xl font-bold text-white break-words">
                Banklarning YouTubedagi faoliyati va ko&apos;rsatkichlari
              </h1>
              <img
                src="/Ahborlogo.png"
                alt="Ahbor logo"
                className="h-6 md:h-0 w-auto object-contain flex-shrink-0 md:hidden"
              />
            </div>

            <img
              src="/Ahborlogo.png"
              alt="Ahbor logo"
              className="hidden md:block h-20 w-auto object-contain max-w-[160px] flex-shrink-0"
            />
          </div>

          <p className="text-slate-400 text-sm md:text-base mt-3"></p>
        </div>

        {/* 🔘 OY FILTERI — SARLAVHADAN PASTDA */}
        <div className="flex gap-2 mb-6">
          {MONTHS.map((month) => (
            <button
              key={month.key}
              onClick={() => setSelectedMonth(month.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition
                ${
                  selectedMonth === month.key
                    ? "bg-red-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
            >
              {month.label}
            </button>
          ))}
        </div>

        {/* ASOSIY KO'RSATKICHLAR */}
        {stats.topBank && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
              label="Jami obunachilar"
              value={stats.totalFollowers.toLocaleString()}
              icon="📈"
            />
            <MetricCard
              label="Obunachilar o'sishi"
              value={stats.followersDiff.toLocaleString()}
              icon="📊"
            />
            <MetricCard
              label="Har bir nashr uchun o&apos;rtacha yoqtirishlar soni"
              value={stats.avgLikes}
              icon="❤️"
            />
            <MetricCard
              label="Eng ko&apos;p obunachilarga ega bank"
              value={stats.topBank.company_name}
              icon="🏆"
              subtitle={`${(stats.topBank.subscribers ?? stats.topBank.followers ?? 0).toLocaleString()} obunachi`}
            />
          </div>
        )}

        {/* DIAGRAMMALAR */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">
                Eng ko&apos;p obunachilarga ega top-10 banklar
              </CardTitle>
              <CardDescription>YouTubeda eng katta auditoriyaga ega banklar</CardDescription>
            </CardHeader>
            <CardContent>
              <FollowersChart data={currentMonthData} onBankClick={onBankClick} />
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">O&apos;rtacha yoqtirishlar soni</CardTitle>
              <CardDescription>Har bir nashr uchun o&apos;rtacha yoqtirishlar soni</CardDescription>
            </CardHeader>
            <CardContent>
              <EngagementChart data={currentMonthData} onBankClick={onBankClick} />
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">O&apos;rtacha nashrlar soni</CardTitle>
              <CardDescription>
                Har bir bank tomonidan bir oyda joylashtirilgan nashrlar soni
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PostingFrequencyChart data={currentMonthData} onBankClick={onBankClick} />
            </CardContent>
          </Card>
        </div>

        {/* RO'YXAT */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Barcha bank kanallari</CardTitle>
            <CardDescription>Kanal ma&apos;lumotlari ro&apos;yxat ko&apos;rinishida</CardDescription>
          </CardHeader>
          <CardContent>
            <BanksList data={currentMonthData} onBankClick={onBankClick} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface MetricCardProps {
  label: string
  value: string
  icon: string
  subtitle?: string
}

function MetricCard({ label, value, icon, subtitle }: MetricCardProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  )
}