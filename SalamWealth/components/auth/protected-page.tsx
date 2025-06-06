"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { Skeleton } from "@/components/ui/skeleton"

interface ProtectedPageProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedPage({ children, fallback }: ProtectedPageProps) {
  const { isLoading, isAuthenticated } = useAuth(true)

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="space-y-4 w-full max-w-md">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      )
    )
  }

  if (!isAuthenticated) {
    return null // useAuth hook will handle redirect
  }

  return <>{children}</>
}
