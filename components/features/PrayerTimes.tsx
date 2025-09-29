"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Moon, Sun, Sunrise } from "lucide-react"

interface PrayerTime {
  name: string
  time: string
  icon: React.ReactNode
}

export function PrayerTimes() {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([])

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Fetch prayer times from API or calculate based on location
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch("/api/prayer-times")
        const data = await response.json()
        if (data && Array.isArray(data.times)) {
          const mappedTimes = data.times.map((pt: any) => ({
            name: pt.name,
            time: pt.time,
            icon: getIconForPrayer(pt.name),
          }))
          setPrayerTimes(mappedTimes)
        } else {
          setPrayerTimes(getDefaultPrayerTimes())
        }
      } catch (error) {
        setPrayerTimes(getDefaultPrayerTimes())
      }
    }
    fetchPrayerTimes()
  }, [])

  const getIconForPrayer = (name: string): React.ReactNode => {
    switch (name.toLowerCase()) {
      case "fajr":
        return <Sunrise className="h-4 w-4 text-orange-600" />
      case "dhuhr":
        return <Sun className="h-4 w-4 text-yellow-600" />
      case "asr":
        return <Sun className="h-4 w-4 text-orange-600" />
      case "maghrib":
        return <Moon className="h-4 w-4 text-blue-600" />
      case "isha":
        return <Moon className="h-4 w-4 text-indigo-600" />
      default:
        return null
    }
  }

  const getDefaultPrayerTimes = (): PrayerTime[] => [
    { name: "Fajr", time: "5:45 AM", icon: <Sunrise className="h-4 w-4 text-orange-600" /> },
    { name: "Dhuhr", time: "1:15 PM", icon: <Sun className="h-4 w-4 text-yellow-600" /> },
    { name: "Asr", time: "4:30 PM", icon: <Sun className="h-4 w-4 text-orange-600" /> },
    { name: "Maghrib", time: "7:15 PM", icon: <Moon className="h-4 w-4 text-blue-600" /> },
    { name: "Isha", time: "8:45 PM", icon: <Moon className="h-4 w-4 text-indigo-600" /> },
  ]

  const getCurrentPrayer = () => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes()
    const times = prayerTimes.map(pt => {
      const [time, modifier] = pt.time.split(" ")
      let [hours, minutes] = time.split(":").map(Number)
      if (modifier.toLowerCase() === "pm" && hours !== 12) hours += 12
      if (modifier.toLowerCase() === "am" && hours === 12) hours = 0
      return hours * 60 + minutes
    })
    for (let i = times.length - 1; i >= 0; i--) {
      if (now >= times[i]) return i
    }
    return times.length - 1
  }

  const currentPrayerIndex = getCurrentPrayer()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Prayer Times</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {prayerTimes.map((prayer, index) => (
              <div
                key={prayer.name}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  index === currentPrayerIndex ? "bg-green-50" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {prayer.icon}
                  <span className="text-sm font-medium">{prayer.name}</span>
                </div>
                <span className="text-sm text-gray-600">{prayer.time}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            {currentTime.toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
