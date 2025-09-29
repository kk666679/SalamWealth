"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"

interface MarketDataPoint {
  date: string
  value: number
}

export function MarketInsights() {
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<MarketDataPoint[]>([])
  const [sukukYield, setSukukYield] = useState<number | null>(null)
  const [marketTrend, setMarketTrend] = useState<string>("")

  useEffect(() => {
    setMounted(true)
    // Fetch live market data from API
    const fetchMarketData = async () => {
      try {
        const response = await fetch("/api/investment/asb/market-data")
        const json = await response.json()
        if (json && Array.isArray(json.data)) {
          setData(json.data)
          // Example: set sukuk yield and market trend from API response
          setSukukYield(json.sukukYield || null)
          setMarketTrend(json.marketTrend || "")
        }
      } catch (error) {
        console.error("Failed to fetch market data", error)
      }
    }
    fetchMarketData()
  }, [])

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Market Insights</CardTitle>
            <Badge variant="outline" className="bg-green-50">Live</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.length > 0 ? data : [{ date: "Loading", value: 0 }]}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: "#10B981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Sukuk Yield</p>
              <p className="text-lg font-semibold text-green-600">{sukukYield !== null ? `${sukukYield}%` : "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Market Trend</p>
              <p className="text-lg font-semibold text-green-600">{marketTrend || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
