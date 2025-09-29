"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, TrendingUp, Shield, CheckCircle, Info, Calculator, BarChart3, Award, Users, Clock } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { createInvestment } from "@/app/actions/investment-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function ASBInvestmentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [loading, setLoading] = useState(false)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [marketData, setMarketData] = useState({
    currentPrice: 1.0,
    dividend: 5.5,
    totalUnits: 12500000000,
    availableUnits: 2500000000,
    lastDividend: "2023",
    nextDividend: "2024",
  })

  useEffect(() => {
    // Fetch real-time ASB data
    fetchMarketData()
  }, [])

  const fetchMarketData = async () => {
    try {
      const response = await fetch("/api/investment/asb/market-data")
      if (response.ok) {
        const data = await response.json()
        setMarketData(data)
      }
    } catch (error) {
      console.error("Failed to fetch market data:", error)
    }
  }

  const calculateUnits = () => {
    const amount = Number.parseFloat(investmentAmount) || 0
    return amount / marketData.currentPrice
  }

  const calculateProjectedDividend = () => {
    const units = calculateUnits()
    return (units * marketData.dividend) / 100
  }

  const handleInvest = async () => {
    if (status !== "authenticated") {
      toast.error("Please sign in to start investing")
      router.push("/auth/signin")
      return
    }

    if (!investmentAmount || Number.parseFloat(investmentAmount) < 10) {
      toast.error("Minimum investment amount is RM10")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("investmentType", "asb")
      formData.append("amount", investmentAmount)

      const result = await createInvestment(formData)

      if (result.success) {
        toast.success("ASB investment successful!")
        router.push(`/investment/portfolio`)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("An error occurred while processing your investment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Star className="w-8 h-8 text-yellow-500" />
              <h1 className="text-3xl font-bold">Amanah Saham Bumiputera (ASB)</h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Malaysia's premier unit trust fund exclusively for Bumiputera investors with consistent dividend returns
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <Badge className="bg-green-100 text-green-800">
                <Shield className="w-3 h-3 mr-1" />
                Government Backed
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                <Award className="w-3 h-3 mr-1" />
                JAKIM Certified
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-800">
                <Star className="w-3 h-3 mr-1" />
                {marketData.dividend}% Dividend
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="invest" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="invest">Invest Now</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="dividends">Dividends</TabsTrigger>
              <TabsTrigger value="info">Fund Info</TabsTrigger>
            </TabsList>

            <TabsContent value="invest">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Investment Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Invest in ASB</CardTitle>
                    <CardDescription>Start your ASB investment journey today</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Current Unit Price</span>
                        <Badge className="bg-blue-100 text-blue-800">Live</Badge>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">RM {marketData.currentPrice.toFixed(4)}</p>
                      <p className="text-xs text-gray-500">Per unit</p>
                    </div>

                    <div>
                      <Label htmlFor="amount">Investment Amount (RM)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="100"
                        min="10"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum: RM10 | No maximum limit</p>
                    </div>

                    {investmentAmount && (
                      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-sm">Units to receive:</span>
                          <span className="font-medium">{calculateUnits().toFixed(4)} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Projected annual dividend:</span>
                          <span className="font-medium text-green-600">
                            RM {calculateProjectedDividend().toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Dividend rate:</span>
                          <span className="font-medium">{marketData.dividend}% per annum</span>
                        </div>
                      </div>
                    )}

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Investment Notice</AlertTitle>
                      <AlertDescription>
                        ASB is exclusively available to Malaysian Bumiputera citizens. Your MyKad will be verified
                        during the investment process.
                      </AlertDescription>
                    </Alert>

                    <Button
                      onClick={handleInvest}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={loading || !investmentAmount}
                    >
                      {loading ? "Processing Investment..." : "Invest Now"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Fund Overview */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Fund Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{marketData.dividend}%</p>
                          <p className="text-sm text-gray-600">Current Dividend</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">RM {marketData.currentPrice.toFixed(4)}</p>
                          <p className="text-sm text-gray-600">Unit Price</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Total Fund Size:</span>
                          <span className="font-medium">RM {(marketData.totalUnits / 1000000000).toFixed(1)}B</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Available Units:</span>
                          <span className="font-medium">
                            {(marketData.availableUnits / 1000000000).toFixed(1)}B units
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Last Dividend Year:</span>
                          <span className="font-medium">{marketData.lastDividend}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Next Dividend:</span>
                          <span className="font-medium">{marketData.nextDividend}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Fund Utilization</span>
                          <span>
                            {(
                              ((marketData.totalUnits - marketData.availableUnits) / marketData.totalUnits) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                        <Progress
                          value={((marketData.totalUnits - marketData.availableUnits) / marketData.totalUnits) * 100}
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        Why Choose ASB?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Government Guarantee</p>
                            <p className="text-sm text-gray-600">Backed by Malaysian government</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Consistent Returns</p>
                            <p className="text-sm text-gray-600">Reliable dividend payments since 1990</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">No Sales Charge</p>
                            <p className="text-sm text-gray-600">100% of your money is invested</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Shariah Compliant</p>
                            <p className="text-sm text-gray-600">JAKIM certified halal investment</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Historical Performance</CardTitle>
                    <CardDescription>ASB dividend history over the years</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { year: "2023", dividend: 5.5, bonus: 0.5 },
                        { year: "2022", dividend: 5.75, bonus: 0.25 },
                        { year: "2021", dividend: 5.0, bonus: 1.0 },
                        { year: "2020", dividend: 5.25, bonus: 0.75 },
                        { year: "2019", dividend: 6.0, bonus: 0.5 },
                      ].map((data) => (
                        <div key={data.year} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{data.year}</p>
                            <p className="text-sm text-gray-600">Annual dividend</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{data.dividend}%</p>
                            {data.bonus > 0 && <p className="text-xs text-blue-600">+{data.bonus}% bonus</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Investment Calculator</CardTitle>
                    <CardDescription>See how your investment could grow</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-lg font-bold text-blue-600">5 Years</p>
                          <p className="text-sm text-gray-600">Investment Period</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-lg font-bold text-green-600">5.5%</p>
                          <p className="text-sm text-gray-600">Average Return</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {[
                          { amount: 1000, years: 5, result: 1308 },
                          { amount: 5000, years: 5, result: 6540 },
                          { amount: 10000, years: 5, result: 13080 },
                          { amount: 20000, years: 5, result: 26160 },
                        ].map((calc) => (
                          <div key={calc.amount} className="flex justify-between items-center p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">RM {calc.amount.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">Initial investment</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">RM {calc.result.toLocaleString()}</p>
                              <p className="text-xs text-gray-600">After {calc.years} years</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Alert>
                        <Calculator className="h-4 w-4" />
                        <AlertTitle>Projection Disclaimer</AlertTitle>
                        <AlertDescription>
                          Past performance is not indicative of future results. Calculations are based on historical
                          average returns.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="dividends">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Dividend Information</CardTitle>
                    <CardDescription>How ASB dividends work</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Current Dividend Rate</h4>
                      <p className="text-2xl font-bold text-yellow-600">{marketData.dividend}% per annum</p>
                      <p className="text-sm text-gray-600 mt-1">Declared for {marketData.lastDividend}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Annual Declaration</p>
                          <p className="text-sm text-gray-600">Dividends are declared annually, usually in March</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Automatic Reinvestment</p>
                          <p className="text-sm text-gray-600">
                            Dividends are automatically reinvested to buy more units
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-purple-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Tax Benefits</p>
                          <p className="text-sm text-gray-600">Dividends are tax-exempt for individual investors</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Dividend History</CardTitle>
                    <CardDescription>Track record of consistent returns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { year: "2023", rate: 5.5, bonus: 0.5, total: 6.0 },
                        { year: "2022", rate: 5.75, bonus: 0.25, total: 6.0 },
                        { year: "2021", rate: 5.0, bonus: 1.0, total: 6.0 },
                        { year: "2020", rate: 5.25, bonus: 0.75, total: 6.0 },
                        { year: "2019", rate: 6.0, bonus: 0.5, total: 6.5 },
                        { year: "2018", rate: 6.25, bonus: 0.75, total: 7.0 },
                      ].map((dividend) => (
                        <div key={dividend.year} className="grid grid-cols-4 gap-2 p-3 border rounded-lg text-sm">
                          <div className="font-medium">{dividend.year}</div>
                          <div className="text-center">{dividend.rate}%</div>
                          <div className="text-center text-blue-600">+{dividend.bonus}%</div>
                          <div className="text-center font-bold text-green-600">{dividend.total}%</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-gray-600">
                        <div>Year</div>
                        <div className="text-center">Dividend</div>
                        <div className="text-center">Bonus</div>
                        <div className="text-center">Total</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="info">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Fund Details</CardTitle>
                    <CardDescription>Complete information about ASB</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Fund Type</p>
                        <p className="text-gray-600">Unit Trust</p>
                      </div>
                      <div>
                        <p className="font-medium">Launch Date</p>
                        <p className="text-gray-600">2 January 1990</p>
                      </div>
                      <div>
                        <p className="font-medium">Fund Manager</p>
                        <p className="text-gray-600">Permodalan Nasional Berhad</p>
                      </div>
                      <div>
                        <p className="font-medium">Trustee</p>
                        <p className="text-gray-600">Amanah Raya Berhad</p>
                      </div>
                      <div>
                        <p className="font-medium">Base Currency</p>
                        <p className="text-gray-600">Malaysian Ringgit (RM)</p>
                      </div>
                      <div>
                        <p className="font-medium">Minimum Investment</p>
                        <p className="text-gray-600">RM 10</p>
                      </div>
                      <div>
                        <p className="font-medium">Sales Charge</p>
                        <p className="text-gray-600">Nil</p>
                      </div>
                      <div>
                        <p className="font-medium">Management Fee</p>
                        <p className="text-gray-600">Nil</p>
                      </div>
                    </div>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Eligibility</AlertTitle>
                      <AlertDescription>
                        ASB is exclusively available to Malaysian Bumiputera citizens aged 18 and above.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Investment Objective</CardTitle>
                    <CardDescription>Fund's goals and strategy</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Primary Objective</h4>
                      <p className="text-sm text-gray-600">
                        To provide unit holders with stable income distribution and long-term capital growth through
                        investments in a diversified portfolio of Shariah-compliant securities.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Investment Strategy</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Diversified portfolio of Malaysian equities</li>
                        <li>• Focus on blue-chip and growth companies</li>
                        <li>• Shariah-compliant investment approach</li>
                        <li>• Professional fund management</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Risk Profile</h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`w-4 h-4 rounded ${level <= 2 ? "bg-green-500" : "bg-gray-200"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">Low to Moderate Risk</span>
                      </div>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-1">Government Guarantee</h4>
                      <p className="text-sm text-green-700">
                        ASB units are backed by the Malaysian government, providing additional security for investors.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
