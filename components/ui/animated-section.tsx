"use client"

import { cn } from "@/lib/utils"
import { useAnimateOnScroll } from "@/hooks/use-animate-on-scroll"
import type { ReactNode, HTMLAttributes } from "react"

type AnimationVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "fade-in"
  | "scale-up"
  | "scale-down"
  | "blur-in"
  | "slide-up"
  | "slide-down"
  | "flip-up"

interface AnimatedSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: AnimationVariant
  delay?: number
  duration?: number
  className?: string
  as?: "div" | "section" | "article" | "aside" | "header" | "footer"
}

const variantClasses: Record<AnimationVariant, { hidden: string; visible: string }> = {
  "fade-up": {
    hidden: "opacity-0 translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  "fade-down": {
    hidden: "opacity-0 -translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  "fade-left": {
    hidden: "opacity-0 translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  "fade-right": {
    hidden: "opacity-0 -translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  "fade-in": {
    hidden: "opacity-0",
    visible: "opacity-100",
  },
  "scale-up": {
    hidden: "opacity-0 scale-95",
    visible: "opacity-100 scale-100",
  },
  "scale-down": {
    hidden: "opacity-0 scale-105",
    visible: "opacity-100 scale-100",
  },
  "blur-in": {
    hidden: "opacity-0 blur-sm",
    visible: "opacity-100 blur-0",
  },
  "slide-up": {
    hidden: "opacity-0 translate-y-12",
    visible: "opacity-100 translate-y-0",
  },
  "slide-down": {
    hidden: "opacity-0 -translate-y-12",
    visible: "opacity-100 translate-y-0",
  },
  "flip-up": {
    hidden: "opacity-0 rotateX-12 translate-y-4",
    visible: "opacity-100 rotateX-0 translate-y-0",
  },
}

export function AnimatedSection({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 700,
  className,
  as: Component = "div",
  ...props
}: AnimatedSectionProps) {
  const [ref, isVisible] = useAnimateOnScroll<HTMLDivElement>()
  const { hidden, visible } = variantClasses[variant]

  return (
    <Component
      ref={ref}
      className={cn(
        "transition-all will-change-transform",
        isVisible ? visible : hidden,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      {...props}
    >
      {children}
    </Component>
  )
}
