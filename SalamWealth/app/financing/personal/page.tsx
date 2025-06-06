"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Calculator, Shield, Clock, TrendingDown, FileText, Info } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { submitFinancingApplication } from "@/app/actions/financing-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function PersonalFinancingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    amount: "",
    termMonths: "",
    purpose: "",
    monthlyIncome: "",
    employmentType: "",
    existingCommitments: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const calculateMonthlyPayment = () => {
    const amount = Number.parseFloat(formData.amount) || 0
    const months = Number.parseInt(formData.termMonths) || 12
    const profitRate = 6.5 / 100 / 12 // 6.5% annual profit rate

    if (amount > 0 && months > 0) {
      const monthlyPayment =
        (amount * profitRate * Math.pow(1 + profitRate, months)) / (Math.pow(1 + profitRate, months) - 1)
      return monthlyPayment
    }
    return 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (status !== "authenticated") {
      toast.error("Please sign in to apply for financing")
      router.push("/auth/signin")
      return
    }

    setLoading(true)

    try {
      const formDataObj = new FormData()
      formDataObj.append("financingType", "personal")
      formDataObj.append("amount", formData.amount)
      formDataObj.append("termMonths", formData.termMonths)
      formDataObj.append("profitRate", "6.5")
      formDataObj.append("purpose", formData.purpose)
      formDataObj.append("shariahContractType", "qardh_hasan")
      formDataObj.append("takafulIncluded", "true")

      const result = await submitFinancingApplication(formDataObj)

      if (result.success) {
        toast.success("Application submitted successfully!")
        router.push(`/financing/application/${result.applicationId}`)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("An error occurred while submitting your application")
    } finally {
      setLoading(false)
    }
  }

  const monthlyPayment = calculateMonthlyPayment()
  const totalPayment = monthlyPayment * (Number.parseInt(formData.termMonths) || 12)
  const totalProfit = totalPayment - (Number.parseFloat(formData.amount) || 0)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Personal Financing</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get up to RM100,000 with our Shariah-compliant personal financing solutions
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <Badge className="bg-emerald-100 text-emerald-800">
                <Shield className="w-3 h-3 mr-1" />
                JAKIM Certified
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                BNM Compliant
              </Badge>
              <Badge className="bg-purple-100 text-purple-800">
                <TrendingDown className="w-3 h-3 mr-1" />
                No Compounding Interest
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="apply" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="apply">Apply Now</TabsTrigger>
              <TabsTrigger value="features">Features & Benefits</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
            </TabsList>

            <TabsContent value="apply">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Application Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Financing Application</CardTitle>
                    <CardDescription>Complete the form below to apply for personal financing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Step 1: Financing Details */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Financing Details</h3>

                        <div>
                          <Label htmlFor="amount">Financing Amount (RM)</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="10000"
                            min="1000"
                            max="100000"
                            value={formData.amount}
                            onChange={(e) => handleInputChange("amount", e.target.value)}
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">Minimum: RM1,000 | Maximum: RM100,000</p>
                        </div>

                        <div>
                          <Label htmlFor="termMonths">Financing Term</Label>
                          <Select
                            value={formData.termMonths}
                            onValueChange={(value) => handleInputChange("termMonths", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select term" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="12">12 months</SelectItem>
                              <SelectItem value="24">24 months</SelectItem>
                              <SelectItem value="36">36 months</SelectItem>
                              <SelectItem value="48">48 months</SelectItem>
                              <SelectItem value="60">60 months</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="purpose">Purpose of Financing</Label>
                          <Select
                            value={formData.purpose}
                            onValueChange={(value) => handleInputChange("purpose", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select purpose" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="debt_consolidation">Debt Consolidation</SelectItem>
                              <SelectItem value="home_improvement">Home Improvement</SelectItem>
                              <SelectItem value="medical_expenses">Medical Expenses</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="wedding">Wedding</SelectItem>
                              <SelectItem value="business_capital">Business Capital</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Step 2: Personal Information */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Personal Information</h3>

                        <div>
                          <Label htmlFor="monthlyIncome">Monthly Income (RM)</Label>
                          <Input
                            id="monthlyIncome"
                            type="number"
                            placeholder="5000"
                            value={formData.monthlyIncome}
                            onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="employmentType">Employment Type</Label>
                          <Select
                            value={formData.employmentType}
                            onValueChange={(value) => handleInputChange("employmentType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select employment type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="permanent">Permanent Employee</SelectItem>
                              <SelectItem value="contract">Contract Employee</SelectItem>
                              <SelectItem value="self_employed">Self Employed</SelectItem>
                              <SelectItem value="business_owner">Business Owner</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="existingCommitments">Existing Monthly Commitments (RM)</Label>
                          <Input
                            id="existingCommitments"
                            type="number"
                            placeholder="1500"
                            value={formData.existingCommitments}
                            onChange={(e) => handleInputChange("existingCommitments", e.target.value)}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Include all existing loans and credit card payments
                          </p>
                        </div>
                      </div>

                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Shariah Compliance</AlertTitle>
                        <AlertDescription>
                          This financing is structured based on Qardh Hasan principles with no riba (interest). The
                          profit rate is fixed and transparent.
                        </AlertDescription>
                      </Alert>

                      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                        {loading ? "Submitting Application..." : "Submit Application"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Calculation Summary */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calculator className="w-5 h-5 mr-2" />
                        Payment Calculation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-emerald-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Monthly Payment</span>
                          <Badge className="bg-emerald-100 text-emerald-800">6.5% p.a.</Badge>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">RM {monthlyPayment.toFixed(2)}</p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Financing Amount:</span>
                          <span>RM {Number.parseFloat(formData.amount || "0").toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Payment:</span>
                          <span>RM {totalPayment.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Profit:</span>
                          <span className="text-emerald-600">RM {totalProfit.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Financing Term:</span>
                          <span>{formData.termMonths || 0} months</span>
                        </div>
                      </div>

                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Takaful Protection Included</AlertTitle>
                        <AlertDescription>
                          Your financing includes Takaful coverage for added protection.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Application Process</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-emerald-100 p-2 rounded-full">
                            <FileText className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium">1. Submit Application</p>
                            <p className="text-sm text-gray-600">Complete the online form</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Shield className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">2. Credit Assessment</p>
                            <p className="text-sm text-gray-600">CTOS/CCRIS verification</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="bg-purple-100 p-2 rounded-full">
                            <CheckCircle className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">3. Approval & Disbursement</p>
                            <p className="text-sm text-gray-600">Funds transferred within 24 hours</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-emerald-600" />
                      Shariah Compliant
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        JAKIM certified structure
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        No riba (interest) involved
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Transparent profit rates
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-blue-600" />
                      Quick Processing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Online application
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        24-hour approval
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Instant disbursement
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingDown className="w-5 h-5 mr-2 text-purple-600" />
                      Competitive Rates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        From 6.5% profit rate
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        No hidden charges
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Flexible repayment terms
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="requirements">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Eligibility Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Malaysian Citizen</p>
                          <p className="text-sm text-gray-600">Valid MyKad required</p>
                        </div>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Age 21-65 years</p>
                          <p className="text-sm text-gray-600">At application time</p>
                        </div>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Minimum Income RM2,000</p>
                          <p className="text-sm text-gray-600">Monthly gross income</p>
                        </div>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Good Credit Standing</p>
                          <p className="text-sm text-gray-600">CTOS/CCRIS verification</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Required Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-3">
                        <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium">MyKad (Front & Back)</p>
                          <p className="text-sm text-gray-600">Clear copy required</p>
                        </div>
                      </li>
                      <li className="flex items-start space-x-3">
                        <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Latest Payslip</p>
                          <p className="text-sm text-gray-600">3 months for employees</p>
                        </div>
                      </li>
                      <li className="flex items-start space-x-3">
                        <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Bank Statement</p>
                          <p className="text-sm text-gray-600">6 months transaction history</p>
                        </div>
                      </li>
                      <li className="flex items-start space-x-3">
                        <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium">EPF Statement</p>
                          <p className="text-sm text-gray-600">Latest contribution record</p>
                        </div>
                      </li>
                    </ul>
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
