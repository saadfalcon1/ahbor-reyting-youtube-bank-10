"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import type { insuranceData } from "@/lib/data"

interface BanksListProps {
  data: typeof insuranceData
  onBankClick: (bank: (typeof insuranceData)[0]) => void
}

type SortKey = "subscribers" | "avg_likes_per_post" | "avg_views_per_post" | "company_name"

export function BanksList({ data, onBankClick }: BanksListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("subscribers")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // 🔍 Qidiruv
  const filteredData = data.filter(
    (bank) =>
      bank.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 🔽 Saralash
  const sortedData = [...filteredData].sort((a, b) => {
    const valA = a[sortKey] ?? 0
    const valB = b[sortKey] ?? 0
    if (typeof valA === "string" && typeof valB === "string") {
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA)
    }
    return sortOrder === "asc" ? valA - valB : valB - valA
  })

  // 📊 Ustunni bosganda saralash funksiyasi
  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("desc")
    }
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Bank nomi yoki foydalanuvchi nomi orqali qidirish..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
      />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th
                onClick={() => handleSort("company_name")}
                className="text-left py-3 px-4 text-slate-400 font-semibold cursor-pointer hover:text-white"
              >
                Bank nomi {sortKey === "company_name" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Foydalanuvchi nomi</th>
              <th
                onClick={() => handleSort("subscribers")}
                className="text-right py-3 px-4 text-slate-400 font-semibold cursor-pointer hover:text-white"
              >
                Obunachilar soni {sortKey === "subscribers" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("avg_likes_per_post")}
                className="text-right py-3 px-4 text-slate-400 font-semibold cursor-pointer hover:text-white"
              >
                O‘rtacha layklar {sortKey === "avg_likes_per_post" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("avg_views_per_post")}
                className="text-right py-3 px-4 text-slate-400 font-semibold cursor-pointer hover:text-white"
              >
                O‘rtacha ko‘rishlar {sortKey === "avg_views_per_post" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="text-center py-3 px-4 text-slate-400 font-semibold">Batafsil</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((bank) => (
              <tr
                key={bank.username}
                className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer"
                onClick={() => onBankClick(bank)}
              >
                <td className="py-3 px-4 text-white font-medium">{bank.company_name}</td>
                <td className="py-3 px-4 text-slate-400">{bank.username}</td>
                <td className="py-3 px-4 text-right text-white">{(bank.subscribers ?? 0).toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-slate-300">{(bank.avg_likes_per_post ?? 0).toFixed(1)}</td>
                <td className="py-3 px-4 text-right text-slate-300">{(bank.avg_views_per_post ?? 0).toFixed(0)}</td>
                <td className="py-3 px-4 text-center">
                  <button className="text-blue-400 hover:text-blue-300 font-medium text-xs">Ko'rish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
