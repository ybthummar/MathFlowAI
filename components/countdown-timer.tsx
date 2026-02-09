"use client"

import { useEffect, useState } from "react"
import { getTimeRemaining } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  })

  useEffect(() => {
    const deadline = process.env.NEXT_PUBLIC_REGISTRATION_DEADLINE || "2026-02-19T23:00:00"
    
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(deadline)
      setTimeLeft(remaining)
      
      if (remaining.expired) {
        clearInterval(timer)
      }
    }, 1000)

    // Initial calculation
    setTimeLeft(getTimeRemaining(deadline))

    return () => clearInterval(timer)
  }, [])

  if (timeLeft.expired) {
    return (
      <Card className="border-2 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20">
        <CardContent className="py-4">
          <p className="text-red-600 dark:text-red-400 font-semibold">
            Registration has closed
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Registration closes in:</p>
      <div className="flex justify-center gap-4">
        {[
          { value: timeLeft.days, label: "Days" },
          { value: timeLeft.hours, label: "Hours" },
          { value: timeLeft.minutes, label: "Minutes" },
          { value: timeLeft.seconds, label: "Seconds" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center"
          >
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg">
              <span className="text-2xl sm:text-3xl font-bold">
                {String(item.value).padStart(2, "0")}
              </span>
            </div>
            <span className="mt-2 text-xs sm:text-sm text-muted-foreground">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
