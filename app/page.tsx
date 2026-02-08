"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Brain,
  Clock,
  MapPin,
  Users,
  Zap,
  Trophy,
  Target,
  Puzzle,
  Sparkles,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CountdownTimer } from "@/components/countdown-timer"
import { AnimatedSection } from "@/components/ui/animated-section"
import VaporizeTextCycle, { Tag } from "@/components/ui/vapour-text-effect"
import dynamic from "next/dynamic"

const AnimatedShaderBackground = dynamic(
  () => import("@/components/ui/animated-shader-background"),
  { ssr: false }
)

export default function HomePage() {
  const [fontSize, setFontSize] = useState("60px")

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth
      if (w < 400) setFontSize("28px")
      else if (w < 640) setFontSize("34px")
      else if (w < 768) setFontSize("44px")
      else setFontSize("60px")
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return (
    <div className="flex flex-col">
      {/* ──────── HERO SECTION ──────── */}
      <section className="relative overflow-hidden py-12 sm:py-20 md:py-32">
        {/* WebGL aurora shader background */}
        <AnimatedShaderBackground />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />

        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <AnimatedSection variant="fade-down" duration={600}>
              <div className="flex justify-center mb-4">
                <Image
                  src="/logo.png"
                  alt="MATH for AI Club"
                  width={80}
                  height={80}
                  className="rounded-xl shadow-lg"
                  priority
                />
              </div>
              <Badge variant="secondary" className="mb-4 animate-bounce-subtle">
                <Sparkles className="mr-1 h-3 w-3" /> Upcoming Events
              </Badge>
            </AnimatedSection>

            <AnimatedSection variant="blur-in" delay={200} duration={800}>
              <div className="h-16 sm:h-24 md:h-32 flex items-center justify-center">
                <VaporizeTextCycle
                  texts={["MathFlow AI", "Have you registered?"]}
                  font={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: fontSize,
                    fontWeight: 700
                  }}
                  color="rgb(139, 92, 246)"
                  spread={5}
                  density={6}
                  animation={{
                    vaporizeDuration: 2.5,
                    fadeInDuration: 1.2,
                    waitDuration: 1.5
                  }}
                  direction="left-to-right"
                  alignment="center"
                  tag={Tag.H1}
                />
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fade-up" delay={400}>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-white/80 md:text-xl px-2">
                A flagship event by <strong className="text-white">MATH for AI Club</strong> - Unlock the power of
                mathematics and artificial intelligence in this thrilling escape room
                competition. Form your team, solve puzzles, and conquer the challenge!
              </p>
            </AnimatedSection>

            <AnimatedSection variant="fade-up" delay={600}>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="gradient-bg text-white hover:opacity-90 hover-lift group">
                  <Link href="/register">
                    Register Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="hover-lift">
                  <a href="#event-flow">
                    Learn More
                    <ChevronDown className="ml-2 h-4 w-4 animate-bounce" />
                  </a>
                </Button>
              </div>
            </AnimatedSection>

            {/* Countdown Timer */}
            <AnimatedSection variant="scale-up" delay={800}>
              <div className="mt-12">
                <CountdownTimer />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ──────── EVENT INFO CARDS ──────── */}
      <section className="py-10 sm:py-16 md:py-24">
        <div className="container">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                icon: Clock,
                iconColor: "text-violet-600",
                borderHover: "hover:border-violet-300 hover-glow",
                title: "Event Date",
                desc: "February 21, 2026",
                detail: "9:00 AM - 5:00 PM IST",
              },
              {
                icon: MapPin,
                iconColor: "text-blue-600",
                borderHover: "hover:border-blue-300 hover-glow",
                title: "Venue",
                desc: "Seminar Hall, 2nd Floor",
                detail: "CSPIT-A6 Building, CHARUSAT",
              },
              {
                icon: Users,
                iconColor: "text-green-600",
                borderHover: "hover:border-green-300 hover-glow",
                title: "Team Size",
                desc: "Up to 3 Members",
                detail: "At least 1 from 1st year, others from 2nd year!",
              },
            ].map((card, i) => (
              <AnimatedSection key={card.title} variant="fade-up" delay={i * 150}>
                <Card className={`border-2 transition-all duration-300 hover-lift ${card.borderHover}`}>
                  <CardHeader>
                    <card.icon className={`h-10 w-10 ${card.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                    <CardTitle>{card.title}</CardTitle>
                    <CardDescription>{card.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{card.detail}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── EVENT FLOW ──────── */}
      <section id="event-flow" className="py-10 sm:py-16 md:py-24 bg-muted/50">
        <div className="container">
          <AnimatedSection variant="fade-up" className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold md:text-4xl">Event Flow</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Two exciting rounds await you. Show your problem-solving skills and AI knowledge!
            </p>
          </AnimatedSection>

          <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Round 1 */}
            <AnimatedSection variant="fade-right" delay={100}>
              <Card className="relative overflow-hidden group hover-lift hover-glow">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/20 to-transparent rounded-bl-full transition-all duration-500 group-hover:w-40 group-hover:h-40" />
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-bg text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <Puzzle className="h-6 w-6" />
                    </div>
                    <div>
                      <Badge variant="secondary">Round 1</Badge>
                      <CardTitle className="mt-1">Escape Room</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    {[
                      "Mathematical chain-based puzzles",
                      "Class 11-12 Maths & Engineering Maths 1 & 2",
                      "Logical reasoning & problem solving",
                      "Pen & paper only (No mobiles/laptops/internet)",
                    ].map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-violet-600 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      <strong>Duration:</strong> 60 minutes<br />
                      <strong>Outcome:</strong> Top 20 teams qualify for Round 2
                    </p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Round 2 */}
            <AnimatedSection variant="fade-left" delay={250}>
              <Card className="relative overflow-hidden group hover-lift hover-glow">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full transition-all duration-500 group-hover:w-40 group-hover:h-40" />
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                      <Brain className="h-6 w-6" />
                    </div>
                    <div>
                      <Badge variant="secondary">Round 2</Badge>
                      <CardTitle className="mt-1">AI Challenge</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    {[
                      "Dataset-based ML task",
                      "Data cleaning, feature engineering & modeling",
                      "Problem analysis and solution design",
                      "Use of internet, AI tools & resources allowed",
                    ].map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      <strong>Duration:</strong> 120 minutes<br />
                      <strong>Note:</strong> Presentation of approach & results
                    </p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ──────── PRIZES ──────── */}
      <section className="py-10 sm:py-16 md:py-24">
        <div className="container">
          <AnimatedSection variant="fade-up" className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold md:text-4xl">Prizes & Rewards</h2>
            <p className="mt-4 text-muted-foreground">
              Total Prize Pool: <strong className="text-primary">₹10,000</strong>
            </p>
          </AnimatedSection>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3 max-w-4xl mx-auto">
            {[
              {
                place: "1st Place",
                prize: "₹5,000",
                extra: "+ Certificates",
                trophySize: "h-16 w-16",
                trophyColor: "text-yellow-500",
                border: "border-yellow-400/50",
                bg: "bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-950/20 dark:to-background",
                textSize: "text-3xl",
                titleSize: "text-2xl",
                isGradient: true,
              },
              {
                place: "2nd Place",
                prize: "₹3,000",
                extra: "+ Certificates",
                trophySize: "h-14 w-14",
                trophyColor: "text-gray-400",
                border: "border-gray-400/50",
                bg: "bg-gradient-to-b from-gray-50 to-white dark:from-gray-950/20 dark:to-background",
                textSize: "text-2xl",
                titleSize: "text-xl",
                isGradient: false,
              },
              {
                place: "3rd Place",
                prize: "₹2,000",
                extra: "+ Certificates",
                trophySize: "h-12 w-12",
                trophyColor: "text-orange-600",
                border: "border-orange-400/50",
                bg: "bg-gradient-to-b from-orange-50 to-white dark:from-orange-950/20 dark:to-background",
                textSize: "text-2xl",
                titleSize: "text-xl",
                isGradient: false,
              },
            ].map((item, i) => (
              <AnimatedSection key={item.place} variant="scale-up" delay={i * 200}>
                <Card className={`text-center border-2 ${item.border} ${item.bg} hover-lift hover-glow group`}>
                  <CardHeader>
                    <Trophy
                      className={`${item.trophySize} ${item.trophyColor} mx-auto transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12`}
                    />
                    <CardTitle className={item.titleSize}>{item.place}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`${item.textSize} font-bold ${item.isGradient ? "gradient-text" : ""}`}>
                      {item.prize}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">{item.extra}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── RULES ──────── */}
      <section className="py-10 sm:py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection variant="fade-up" className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold md:text-4xl">Rules & Guidelines</h2>
            </AnimatedSection>

            <AnimatedSection variant="scale-up" delay={200}>
              <Card className="hover-glow">
                <CardContent className="pt-6">
                  <ul className="space-y-4">
                    {[
                      "Each team can have up to 3 members",
                      "At least 1 member must be from 1st year, others can be from 2nd year only",
                      "All team members must carry valid college ID cards",
                      "A participant can be part of only one team",
                      "Round 1: No mobile phones, laptops, or internet (pen & paper only)",
                      "Round 2: Internet, AI tools, and other resources are allowed",
                      "Any form of malpractice or unfair means will lead to disqualification",
                      "The decision of the judges will be final and binding",
                      "Teams must report on time. Late entries may be disqualified",
                      "Maintain discipline and respect towards coordinators and fellow participants",
                      "Electronic devices must be submitted before Round 1 begins",
                    ].map((rule, i) => (
                      <AnimatedSection key={i} variant="fade-right" delay={i * 80}>
                        <li className="flex items-start gap-3 group">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full gradient-bg text-white text-xs transition-transform duration-300 group-hover:scale-110">
                            {i + 1}
                          </span>
                          <span className="text-sm">{rule}</span>
                        </li>
                      </AnimatedSection>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ──────── CTA ──────── */}
      <section className="py-10 sm:py-16 md:py-24">
        <div className="container">
          <AnimatedSection variant="scale-up">
            <Card className="gradient-bg text-white overflow-hidden relative group">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
              <div className="absolute -top-20 -right-20 h-40 w-40 sm:h-60 sm:w-60 rounded-full bg-white/10 blur-3xl transition-all duration-700 group-hover:h-80 group-hover:w-80" />
              <div className="absolute -bottom-20 -left-20 h-40 w-40 sm:h-60 sm:w-60 rounded-full bg-white/10 blur-3xl transition-all duration-700 group-hover:h-80 group-hover:w-80" />
              <CardContent className="relative py-8 sm:py-12 text-center px-4 sm:px-6">
                <h2 className="text-2xl sm:text-3xl font-bold md:text-4xl">Ready to Take the Challenge?</h2>
                <p className="mt-3 sm:mt-4 text-white/80 max-w-xl mx-auto text-sm sm:text-base">
                  Join MATH for AI Club&apos;s flagship event! Form your team, register now,
                  and embark on an exciting journey of mathematics and artificial intelligence!
                </p>
                <Button
                  asChild
                  size="lg"
                  className="mt-8 bg-white text-violet-700 hover:bg-white/90 hover-lift group/btn"
                >
                  <Link href="/register">
                    Register Your Team
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
