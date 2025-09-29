"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/signin")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to sign-in
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <Button onClick={logout} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Welcome, {user.name}!</CardTitle>
              <CardDescription>
                MyKad ID: {user.mykadId} | Status: {user.isBumiputera ? "Bumiputera" : "Non-Bumiputera"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Welcome to your SalamWealth Connect dashboard. Here you can manage your Islamic financial products and
                services.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financing</CardTitle>
                <CardDescription>Apply for Shariah-compliant financing</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Apply Now</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investments</CardTitle>
                <CardDescription>Halal investment opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Explore</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Zakat Calculator</CardTitle>
                <CardDescription>Calculate your zakat obligations</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Calculate</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
