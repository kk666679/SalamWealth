"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [mounted, setMounted] = useState(false)

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/auth/signin")
    }
  }

  const handleServiceClick = (href: string, requiresAuth = false) => {
    if (requiresAuth && !user) {
      toast.error("Please sign in to access this service")
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(href)}`)
      return
    }
    router.push(href)
  }

  const content = {
    en: {
      title: "SalamWealth Connect",
      subtitle: "Malaysian Digital Financing & Investment Platform",
      description: "Shariah-compliant financing and halal investment solutions for Malaysian families and businesses",
      getStarted: user ? "Go to Dashboard" : "Get Started",
      learnMore: "Learn More",
      financing: "Islamic Financing",
      investment: "Halal Investment",
      features: "Key Features",
      compliance: "Regulatory Compliance",
    },
    ms: {
      title: "SalamWealth Connect",
      subtitle: "Platform Pembiayaan & Pelaburan Digital Malaysia",
      description: "Penyelesaian pembiayaan patuh Syariah dan pelaburan halal untuk keluarga dan perniagaan Malaysia",
      getStarted: user ? "Pergi ke Dashboard" : "Mula Sekarang",
      learnMore: "Ketahui Lebih Lanjut",
      financing: "Pembiayaan Islam",
      investment: "Pelaburan Halal",
      features: "Ciri Utama",
      compliance: "Pematuhan Peraturan",
    },
  }

  const t = content[selectedLanguage as keyof typeof content]

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="h-16 border-b bg-white/95"></div>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-80 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full max-w-2xl mx-auto mb-8"></div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="h-12 bg-gray-200 rounded w-32"></div>
                <div className="h-12 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Trusted Partner for <span className="text-green-600">Shariah-Compliant</span> Financial Solutions
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover halal financing options, Islamic investments, and comprehensive financial planning designed
            specifically for Malaysian Muslims.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={handleGetStarted}>
              {t.getStarted}
            </Button>
            <Link href="/calculator">
              <Button size="lg" variant="outline">
                Try Our Calculator
              </Button>
            </Link>
          </div>
          {user && (
            <div className="mt-6 p-4 bg-white/80 backdrop-blur rounded-lg border max-w-md mx-auto">
              <p className="text-sm text-gray-600">
                Welcome back, <span className="font-semibold">{user.name}</span>!
              </p>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">🏦 Islamic Financing</CardTitle>
              <CardDescription>Shariah-compliant personal and business financing solutions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Access halal financing options for your home, car, education, and business needs with competitive rates
                and flexible terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">📈 Halal Investments</CardTitle>
              <CardDescription>Grow your wealth through Shariah-compliant investment opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Invest in ASB, sukuk, Islamic unit trusts, and gold with our curated halal investment platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">🕌 Zakat Management</CardTitle>
              <CardDescription>Simplified zakat calculation and distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Calculate your zakat obligations accurately and distribute to verified recipients with our automated
                system.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Credentials Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-16">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Demo Credentials for Testing</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded border">
              <h4 className="font-medium text-gray-900">Ahmad bin Abdullah</h4>
              <p className="text-sm text-gray-600">Email: ahmad@example.com</p>
              <p className="text-sm text-gray-600">Password: password123</p>
            </div>
            <div className="bg-white p-4 rounded border">
              <h4 className="font-medium text-gray-900">Siti binti Rahman</h4>
              <p className="text-sm text-gray-600">Email: siti@example.com</p>
              <p className="text-sm text-gray-600">Password: password123</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
