"use client"

import { useEffect, useRef, useState, type RefObject } from "react"

interface UseAnimateOnScrollOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useAnimateOnScroll<T extends HTMLElement = HTMLDivElement>(
  options: UseAnimateOnScrollOptions = {}
): [RefObject<T | null>, boolean] {
  const { threshold = 0.1, rootMargin = "0px 0px -50px 0px", triggerOnce = true } = options
  const ref = useRef<T | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce])

  return [ref, isVisible]
}

export function useStaggerChildren(
  isVisible: boolean,
  count: number,
  baseDelay: number = 100
): boolean[] {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(count).fill(false))

  useEffect(() => {
    if (!isVisible) {
      setVisibleItems(new Array(count).fill(false))
      return
    }

    const timeouts: NodeJS.Timeout[] = []
    for (let i = 0; i < count; i++) {
      timeouts.push(
        setTimeout(() => {
          setVisibleItems((prev) => {
            const next = [...prev]
            next[i] = true
            return next
          })
        }, i * baseDelay)
      )
    }

    return () => timeouts.forEach(clearTimeout)
  }, [isVisible, count, baseDelay])

  return visibleItems
}
