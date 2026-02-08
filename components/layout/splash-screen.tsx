"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Check if splash was already shown this session
    const hasShown = sessionStorage.getItem("splash-shown")
    if (hasShown) {
      setShowSplash(false)
      return
    }

    const timer = setTimeout(() => {
      setShowSplash(false)
      sessionStorage.setItem("splash-shown", "1")
    }, 2400)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Logo pulse in */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src="/logo.png"
                alt="MATH for AI Club"
                width={120}
                height={120}
                className="rounded-2xl shadow-2xl"
                priority
              />
            </motion.div>

            {/* Club name slides up */}
            <motion.h1
              className="mt-6 text-2xl sm:text-3xl font-bold gradient-text"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
            >
              MATH for AI Club
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="mt-2 text-sm text-muted-foreground"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5, ease: "easeOut" }}
            >
              Where Mathematics meets Artificial Intelligence
            </motion.p>

            {/* Loading bar */}
            <motion.div
              className="mt-8 h-1 rounded-full gradient-bg"
              initial={{ width: 0 }}
              animate={{ width: 160 }}
              transition={{ delay: 0.3, duration: 1.8, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content - always rendered, hidden until splash is done */}
      <motion.div
        initial={{ opacity: showSplash ? 0 : 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: showSplash ? 0.1 : 0 }}
      >
        {children}
      </motion.div>
    </>
  )
}
