"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true)
  const [videoEnded, setVideoEnded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Check if splash was already shown this session
    const hasShown = sessionStorage.getItem("splash-shown")
    if (hasShown) {
      setShowSplash(false)
      return
    }
  }, [])

  useEffect(() => {
    if (videoEnded) {
      const timer = setTimeout(() => {
        setShowSplash(false)
        sessionStorage.setItem("splash-shown", "1")
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [videoEnded])

  // Fallback: if video doesn't load, dismiss after 5s
  useEffect(() => {
    if (!showSplash) return
    const fallback = setTimeout(() => {
      setVideoEnded(true)
    }, 8000)
    return () => clearTimeout(fallback)
  }, [showSplash])

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {/* Club logo */}
            <motion.div
              className="flex items-center justify-center mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Image
                src="/logo.png"
                alt="MATH for AI Club"
                width={72}
                height={72}
                className="rounded-xl shadow-2xl"
                priority
              />
            </motion.div>

            {/* Club name */}
            <motion.h1
              className="text-xl sm:text-2xl font-bold text-white mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              MATH for AI Club
            </motion.h1>

            <motion.p
              className="text-xs sm:text-sm text-white/60 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              CSPIT · CHARUSAT University
            </motion.p>

            {/* Intro video */}
            <motion.div
              className="w-full max-w-md px-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <video
                ref={videoRef}
                src="/intro.mp4"
                className="w-full rounded-xl shadow-2xl"
                autoPlay
                muted
                playsInline
                onEnded={() => setVideoEnded(true)}
                onError={() => setVideoEnded(true)}
              />
            </motion.div>

            {/* Presents text */}
            <motion.p
              className="mt-6 text-lg sm:text-xl font-semibold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              presents MathFlow AI
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
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
