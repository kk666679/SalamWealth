"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { TrendingUp, Shield, Target } from "lucide-react"

export function FinancialHealth() {
  const [mounted, setMounted] = useState(false)
  const [score, setScore] = useState(0)
  const [emergencyFundMonths, setEmergencyFundMonths] = useState(0)
  const [debtToIncome, setDebtToIncome] = useState(0)
  const [zakatCompliance, setZakatCompliance] = useState("Unknown")

  useEffect(() => {
    setMounted(true)
    // Simulate fetching user financial data and calculating score
    const fetchFinancialData = async () => {
      // Replace with real data fetching logic
      const userData = {
        emergencyFundMonths: 4,
        debtToIncome: 30,
        zakatCompliance: false,
      }

      setEmergencyFundMonths(userData.emergencyFundMonths)
      setDebtToIncome(userData.debtToIncome)
      setZakatCompliance(userData.zakatCompliance ? "Up to date" : "Needs Attention")

      // Simple scoring logic
      let calculatedScore = 0
      if (userData.emergencyFundMonths >= 6) calculatedScore += 40
      else if (userData.emergencyFundMonths >= 3) calculatedScore += 20

      if (userData.debtToIncome <= 30) calculatedScore += 30
      else if (userData.debtToIncome <= 40) calculatedScore += 15

      if (userData.zakatCompliance) calculatedScore += 30

      setScore(calculatedScore)
    }

    fetchFinancialData()
  }, [])

  if (!mounted) return null

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Needs Improvement"
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-600" />
            Financial Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {getScoreLabel(score)}
            </div>
            <Progress value={score} className="mt-4" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm">Emergency Fund</span>
              </div>
              <span className={`text-sm font-medium ${emergencyFundMonths >= 6 ? "text-green-600" : emergencyFundMonths >= 3 ? "text-yellow-600" : "text-red-600"}`}>
                {emergencyFundMonths} months
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Debt-to-Income</span>
              </div>
              <span className={`text-sm font-medium ${debtToIncome <= 30 ? "text-green-600" : debtToIncome <= 40 ? "text-yellow-600" : "text-red-600"}`}>
                {debtToIncome}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Zakat Compliance</span>
              </div>
              <span className={`text-sm font-medium ${zakatCompliance === "Up to date" ? "text-green-600" : "text-red-600"}`}>
                {zakatCompliance}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
