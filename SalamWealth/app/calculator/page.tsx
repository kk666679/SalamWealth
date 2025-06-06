"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calculator, TrendingUp, Wallet, Info, CheckCircle, ChurchIcon as Mosque, Star } from "lucide-react"
import { Navigation } from "@/components/navigation"
import Link from "next/link"

export default function CalculatorPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("en")

  // Zakat Calculator State
  const [cash, setCash] = useState("")
  const [savings, setSavings] = useState("")
  const [investments, setInvestments] = useState("")
  const [gold, setGold] = useState("")
  const [debts, setDebts] = useState("")

  // Investment Calculator State
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [investmentPeriod, setInvestmentPeriod] = useState("")
  const [expectedReturn, setExpectedReturn] = useState("5.5")

  // Financing Calculator State
  const [loanAmount, setLoanAmount] = useState("")
  const [loanTerm, setLoanTerm] = useState("")
  const [profitRate, setProfitRate] = useState("6.5")

  const calculateZakat = () => {
    const totalWealth =
      (Number.parseFloat(cash) || 0) +
      (Number.parseFloat(savings) || 0) +
      (Number.parseFloat(investments) || 0) +
      (Number.parseFloat(gold) || 0) -
      (Number.parseFloat(debts) || 0)

    const nisab = 4000 // Current nisab value in RM

    if (totalWealth >= nisab) {
      return (totalWealth * 0.025).toFixed(2)
    }
    return "0.00"
  }

  const calculateInvestment = () => {
    const principal = Number.parseFloat(investmentAmount) || 0
    const rate = Number.parseFloat(expectedReturn) / 100
    const years = Number.parseFloat(investmentPeriod) || 0

    const futureValue = principal * Math.pow(1 + rate, years)
    return {
      futureValue: futureValue.toFixed(2),
      totalReturn: (futureValue - principal).toFixed(2),
    }
  }

  const calculateFinancing = () => {
    const principal = Number.parseFloat(loanAmount) || 0
    const rate = Number.parseFloat(profitRate) / 100 / 12
    const months = Number.parseFloat(loanTerm) * 12

    const monthlyPayment = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
    const totalPayment = monthlyPayment * months

    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalProfit: (totalPayment - principal).toFixed(2),
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Islamic Financial Calculators</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate your Zakat obligations, plan your halal investments, and estimate Shariah-compliant financing
            options
          </p>
        </div>

        <Tabs defaultValue="zakat" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="zakat" className="flex items-center">
              <Calculator className="w-4 h-4 mr-2" />
              Zakat Calculator
            </TabsTrigger>
            <TabsTrigger value="investment" className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Investment Planner
            </TabsTrigger>
            <TabsTrigger value="financing" className="flex items-center">
              <Wallet className="w-4 h-4 mr-2" />
              Financing Calculator
            </TabsTrigger>
          </TabsList>

          {/* Zakat Calculator */}
          <TabsContent value="zakat">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mosque className="w-5 h-5 mr-2 text-emerald-600" />
                    Zakat Calculator
                  </CardTitle>
                  <CardDescription>Calculate your annual Zakat obligation based on Islamic principles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cash">Cash in Hand/Bank (RM)</Label>
                    <Input
                      id="cash"
                      type="number"
                      placeholder="0.00"
                      value={cash}
                      onChange={(e) => setCash(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="savings">Savings & Fixed Deposits (RM)</Label>
                    <Input
                      id="savings"
                      type="number"
                      placeholder="0.00"
                      value={savings}
                      onChange={(e) => setSavings(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="investments">Investments (ASB, Shares, etc.) (RM)</Label>
                    <Input
                      id="investments"
                      type="number"
                      placeholder="0.00"
                      value={investments}
                      onChange={(e) => setInvestments(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="gold">Gold & Silver (RM)</Label>
                    <Input
                      id="gold"
                      type="number"
                      placeholder="0.00"
                      value={gold}
                      onChange={(e) => setGold(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="debts">Outstanding Debts (RM)</Label>
                    <Input
                      id="debts"
                      type="number"
                      placeholder="0.00"
                      value={debts}
                      onChange={(e) => setDebts(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Zakat Calculation Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Your Zakat Amount</span>
                        <Badge className="bg-emerald-100 text-emerald-800">2.5%</Badge>
                      </div>
                      <p className="text-3xl font-bold text-emerald-600">RM {calculateZakat()}</p>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Wealth:</span>
                        <span>
                          RM{" "}
                          {(
                            (Number.parseFloat(cash) || 0) +
                            (Number.parseFloat(savings) || 0) +
                            (Number.parseFloat(investments) || 0) +
                            (Number.parseFloat(gold) || 0) -
                            (Number.parseFloat(debts) || 0)
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nisab Threshold:</span>
                        <span>RM 4,000.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zakat Rate:</span>
                        <span>2.5%</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="text-xs text-blue-800">
                          <p className="font-medium mb-1">Integrated with Tabung Haji</p>
                          <p>
                            You can pay your Zakat directly through our platform to Tabung Haji or other approved
                            institutions.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Pay Zakat via Tabung Haji</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Investment Calculator */}
          <TabsContent value="investment">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    Halal Investment Planner
                  </CardTitle>
                  <CardDescription>Plan your Shariah-compliant investment journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="investmentAmount">Initial Investment Amount (RM)</Label>
                    <Input
                      id="investmentAmount"
                      type="number"
                      placeholder="1000"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="investmentPeriod">Investment Period (Years)</Label>
                    <Input
                      id="investmentPeriod"
                      type="number"
                      placeholder="5"
                      value={investmentPeriod}
                      onChange={(e) => setInvestmentPeriod(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                    <Input
                      id="expectedReturn"
                      type="number"
                      step="0.1"
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">ASB average: 5.5% | Government Sukuk: 4.25%</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Popular Halal Investment Options:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={() => setExpectedReturn("5.5")}>
                        <Star className="w-3 h-3 mr-1" />
                        ASB (5.5%)
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setExpectedReturn("4.25")}>
                        Sukuk (4.25%)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Investment Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Future Value</span>
                        <Badge className="bg-blue-100 text-blue-800">{expectedReturn}% p.a.</Badge>
                      </div>
                      <p className="text-3xl font-bold text-blue-600">RM {calculateInvestment().futureValue}</p>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Initial Investment:</span>
                        <span>RM {Number.parseFloat(investmentAmount || "0").toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Returns:</span>
                        <span className="text-green-600">+RM {calculateInvestment().totalReturn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Investment Period:</span>
                        <span>{investmentPeriod || 0} years</span>
                      </div>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        <div className="text-xs text-green-800">
                          <p className="font-medium mb-1">JAKIM Certified Investments</p>
                          <p>All investment options are Shariah-compliant and halal certified.</p>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Start Investing Today</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financing Calculator */}
          <TabsContent value="financing">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wallet className="w-5 h-5 mr-2 text-purple-600" />
                    Islamic Financing Calculator
                  </CardTitle>
                  <CardDescription>Calculate your Shariah-compliant financing options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="loanAmount">Financing Amount (RM)</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      placeholder="50000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="loanTerm">Financing Term (Years)</Label>
                    <Input
                      id="loanTerm"
                      type="number"
                      placeholder="5"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="profitRate">Profit Rate (% p.a.)</Label>
                    <Input
                      id="profitRate"
                      type="number"
                      step="0.1"
                      value={profitRate}
                      onChange={(e) => setProfitRate(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">BNM approved rates. No compounding interest.</p>
                  </div>

                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <div className="text-xs text-emerald-800">
                        <p className="font-medium mb-1">Shariah-Compliant Structure</p>
                        <p>Based on Qardh Hasan and Bai Al-Inah principles. No riba (interest) involved.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financing Calculation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Monthly Payment</span>
                        <Badge className="bg-purple-100 text-purple-800">{profitRate}% p.a.</Badge>
                      </div>
                      <p className="text-3xl font-bold text-purple-600">RM {calculateFinancing().monthlyPayment}</p>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Financing Amount:</span>
                        <span>RM {Number.parseFloat(loanAmount || "0").toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Payment:</span>
                        <span>RM {calculateFinancing().totalPayment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Profit:</span>
                        <span className="text-purple-600">RM {calculateFinancing().totalProfit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Financing Term:</span>
                        <span>{loanTerm || 0} years</span>
                      </div>
                    </div>

                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Info className="w-4 h-4 text-orange-600 mt-0.5" />
                        <div className="text-xs text-orange-800">
                          <p className="font-medium mb-1">BNM Compliant</p>
                          <p>Maximum 5% late payment fee. Takaful insurance included for your protection.</p>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-purple-600 hover:bg-purple-700">Apply for Financing</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Additional Information */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Regulatory Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge className="bg-emerald-100 text-emerald-800">BNM Licensed</Badge>
                <Badge className="bg-blue-100 text-blue-800">SC Approved</Badge>
                <Badge className="bg-green-100 text-green-800">JAKIM Certified</Badge>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                All calculations are based on approved regulatory guidelines and Shariah principles.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Our Islamic finance experts are here to guide you through your financial journey.
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Get Started</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Ready to apply for financing or start investing? Create your account today.
              </p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Link href="/dashboard">Open Account</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
