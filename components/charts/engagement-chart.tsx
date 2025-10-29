"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { insuranceData } from "@/lib/data"

interface EngagementChartProps {
  data: typeof insuranceData
  onBankClick: (bank: (typeof insuranceData)[0]) => void
}

export function EngagementChart({ data, onBankClick }: EngagementChartProps) {
  const topBanks = [...data]
    .sort((a, b) => (b.avg_likes_per_post ?? 0) - (a.avg_likes_per_post ?? 0))
    .slice(0, 8)

  const chartData = topBanks.map((bank) => ({
    name: bank.company_name.substring(0, 12),
    likes: bank.avg_likes_per_post ?? 0,
    bank,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
        <YAxis stroke="#94a3b8" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "1px solid #475569",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#f1f5f9" }}
          cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
        />
        <Legend wrapperStyle={{ color: "#cbd5e1" }} />
        <Bar dataKey="likes" fill="#06b6d4" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
