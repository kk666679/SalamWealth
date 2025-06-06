"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Calculator, CreditCard, PiggyBank, Wallet } from "lucide-react"
import Link from "next/link"

interface QuickActionProps {
  icon: React.ReactNode
  label: string
  href: string
  color: string
}

function QuickAction({ icon, label, href, color }: QuickActionProps) {
  return (
    <Link href={href}>
      <Button
        variant="outline"
        className={`w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-${color}-50 transition-colors duration-200`}
      >
        <div className={`text-${color}-600`}>{icon}</div>
        <span className="text-sm font-medium">{label}</span>
      </Button>
    </Link>
  )
}

export function QuickActions() {
  const [mounted, setMounted] = useState(false)
  const [actions, setActions] = useState<QuickActionProps[]>([])

  useEffect(() => {
    setMounted(true)
    // Fetch or define actions dynamically if needed
    setActions([
      {
        icon: <Calculator className="h-6 w-6" />,
        label: "Zakat Calculator",
        href: "/calculator",
        color: "green",
      },
      {
        icon: <CreditCard className="h-6 w-6" />,
        label: "Apply Financing",
        href: "/financing/personal",
        color: "blue",
      },
      {
        icon: <PiggyBank className="h-6 w-6" />,
        label: "ASB Investment",
        href: "/investment/asb",
        color: "purple",
      },
      {
        icon: <Wallet className="h-6 w-6" />,
        label: "My Portfolio",
        href: "/dashboard",
        color: "orange",
      },
    ])
  }, [])

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {actions.map((action, index) => (
              <QuickAction key={index} {...action} />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
