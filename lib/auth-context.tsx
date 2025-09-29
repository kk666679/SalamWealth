"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  mykadId: string
  isBumiputera: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for testing
const DEMO_USERS: User[] = [
  {
    id: "1",
    name: "Ahmad bin Abdullah",
    email: "ahmad@example.com",
    mykadId: "850123-14-5678",
    isBumiputera: true,
  },
  {
    id: "2",
    name: "Siti binti Rahman",
    email: "siti@example.com",
    mykadId: "920456-03-1234",
    isBumiputera: true,
  },
]

// Safe localStorage access for SSR
const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null
  
  try {
    const savedUser = localStorage.getItem("salamwealth_user")
    return savedUser ? JSON.parse(savedUser) : null
  } catch (error) {
    console.error("Error parsing saved user:", error)
    if (typeof window !== "undefined") {
      localStorage.removeItem("salamwealth_user")
    }
    return null
  }
}

const setStoredUser = (user: User | null): void => {
  if (typeof window === "undefined") return
  
  if (user) {
    localStorage.setItem("salamwealth_user", JSON.stringify(user))
  } else {
    localStorage.removeItem("salamwealth_user")
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check for existing session on mount
    const savedUser = getStoredUser()
    if (savedUser) {
      setUser(savedUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check demo credentials
      const demoUser = DEMO_USERS.find((u) => u.email === email)
      if (demoUser && password === "password123") {
        setUser(demoUser)
        setStoredUser(demoUser)
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setStoredUser(null)
  }

  // Don't render children until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
