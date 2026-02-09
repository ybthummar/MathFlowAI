"use client"

import { useState } from "react"
import Image from "next/image"
import { Sparkles, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedSection } from "@/components/ui/animated-section"
import {
  ScrollAnimation,
  ScrollScale,
  ScrollTranslateX,
  ScrollTranslateY,
} from "@/components/ui/team-section"
import { cn } from "@/lib/utils"

// ─────────────────────────── TEAM DATA ───────────────────────────

interface TeamMember {
  name: string
  role: string
  avatar: string
}

const ALL_MEMBERS: TeamMember[] = [
  { name: "Mukti Patel", role: "Faculty Coordinator", avatar: "https://cspit.charusat.ac.in/CSPIT_Faculty/AIML/MUKTI_PATEL.webp" },
  { name: "Bhargav Shobhana", role: "Faculty Coordinator", avatar: "https://cspit.charusat.ac.in/CSPIT_Faculty/AIML/BHARGAV.webp" },
  { name: "Yash Davda", role: "President", avatar: "https://drive.google.com/thumbnail?id=1Q4ceFbsGKfFAwPo9czfo8NwhyKWpQIWX&sz=w800" },
  { name: "Dhwani Navadia", role: "Vice President", avatar: "https://drive.google.com/thumbnail?id=1fDC6wrBcmYpg_ggWtxawGeFumlfpYDc8&sz=w800" },
  { name: "Krish Singh", role: "Secretary", avatar: "https://drive.google.com/thumbnail?id=1mDF6K89s18798e_qy3v1lWyQ70W2YbC3&sz=w800" },
  { name: "Hasti Bhalodiya", role: "Treasurer", avatar: "https://drive.google.com/thumbnail?id=1d8YZXTkd3zpotopY-WqX__q7yUPWIRA-&sz=w800" },
  { name: "Tirthkumar Kachhadiya", role: "Promotion & Campaign", avatar: "https://drive.google.com/thumbnail?id=1yd1-ruub6QB20IfQF9ZmmPfX-G5LWuA7&sz=w800" },
  { name: "Himay Thummar", role: "Promotion & Campaign", avatar: "https://drive.google.com/thumbnail?id=10ZbRIVUKgkCUmFb0PDAyysOQLw2S0znM&sz=w800" },
  { name: "Hetvi Patoliya", role: "Promotion & Campaign", avatar: "https://drive.google.com/thumbnail?id=1gT3XcancML1HR9MtzCfoGhYj9UUL07n_&sz=w800" },
  { name: "Ayushi Hirpara", role: "Design & Creative", avatar: "https://drive.google.com/thumbnail?id=1nfOryLDfD2IlPGw_Gyzqmqf196CthtZH&sz=w800" },
  { name: "Mahi Savani", role: "Design & Creative", avatar: "https://drive.google.com/thumbnail?id=1njIvpzYerSeSrTrRLs-5y7jh8B3cjbgZ&sz=w800" },
  { name: "Hitarth Khatiwala", role: "Technical Team", avatar: "https://drive.google.com/thumbnail?id=1ER4GL8eUXYXjWMaKL5bymWjhp4KtEQ4j&sz=w800" },
  { name: "Devang Dhandhukiya", role: "Technical Team", avatar: "https://drive.google.com/thumbnail?id=1qghqzkIAltBwwUVJuPCevQaXgtssWRwt&sz=w800" },
  { name: "Priyansh Vadukiya", role: "Event Management", avatar: "https://drive.google.com/thumbnail?id=171mTS5ROvMKkMb7Cekva9JC-ltFemM1a&sz=w800" },
  { name: "Dhriti Patel", role: "Event Management", avatar: "https://drive.google.com/thumbnail?id=1-p7gNK2esXkceK3hhnwQs0HgJG3OL_Yh&sz=w800" },
  { name: "Yug Thummar", role: "Website Developer", avatar: "https://drive.google.com/thumbnail?id=11wehUK0wOS-0Xn2ktS14Y5eJUhRmmeLk&sz=w800" },
]

const ROW_ONE = ALL_MEMBERS.slice(0, 8)
const ROW_TWO = ALL_MEMBERS.slice(8)

// ─────────────────────────── TEAM CARD ───────────────────────────

function TeamCard({
  member,
  className,
  ...props
}: React.ComponentProps<"div"> & { member: TeamMember }) {
  const [imgError, setImgError] = useState(false)
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={cn("shrink-0", className)} {...props}>
      {member.avatar && !imgError ? (
        <img
          src={member.avatar}
          alt={member.name}
          width={200}
          height={200}
          className="aspect-square w-full object-cover"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="aspect-square w-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl font-bold">
          {initials}
        </div>
      )}
      <div className="space-y-0.5 py-2 px-2">
        <h3 className="text-[11px] sm:text-sm md:text-base font-semibold truncate">{member.name}</h3>
        <h4 className="text-[10px] sm:text-xs md:text-sm text-muted-foreground truncate">{member.role}</h4>
      </div>
    </div>
  )
}

// ─────────────────────────── MAIN PAGE ───────────────────────────

export function TeamPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-violet-950/20 dark:via-background dark:to-blue-950/20" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-900/20 animate-float" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-900/20 animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-pink-200/20 blur-3xl dark:bg-pink-900/10 animate-pulse-slow" />
        </div>

        <div className="container relative">
          <AnimatedSection variant="fade-up" className="mx-auto max-w-3xl text-center">
            <div className="flex items-center justify-center mb-4">
              <Image src="/logo.png" alt="MATH for AI Club" width={80} height={80} className="rounded-xl" />
            </div>
            <Badge variant="secondary" className="mb-4 animate-bounce-subtle">
              <Sparkles className="mr-1 h-3 w-3" /> Meet the Crew
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Our <span className="gradient-text">Amazing Team</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto px-2">
              The passionate minds behind <strong>MATH for AI Club</strong> who make
              MathFlow AI possible. From faculty coordinators to every team —
              meet the people who bring it all together.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 text-sm text-muted-foreground">
              <Users className="h-5 w-5 text-primary" />
              <span>{ALL_MEMBERS.length} team members of AI &amp; ML Department.</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Scroll-Animated Team Section */}
      <ScrollAnimation className="overflow-hidden">
        <ScrollTranslateY className="min-h-svh flex flex-col justify-center items-center gap-4 sm:gap-6 py-6 sm:py-8">
          {/* Row 1 — slides in from left */}
          <div className="w-full overflow-hidden">
            <ScrollTranslateX
              xRange={["-100%", "0%"]}
              inputRange={[0.3, 0.8]}
              className="origin-bottom flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 px-2 sm:px-4"
            >
              {ROW_ONE.map((member, index) => (
                <TeamCard
                  className="w-[calc(50%-0.5rem)] sm:w-[calc(25%-0.75rem)] md:w-[calc(12.5%-0.875rem)] bg-card border rounded-lg overflow-hidden"
                  key={index}
                  member={member}
                />
              ))}
            </ScrollTranslateX>
          </div>

          {/* Center heading — scales in */}
          <ScrollScale
            inputRange={[0, 0.5]}
            scaleRange={[1.4, 1]}
            className="w-10/12 flex flex-col justify-center text-center items-center mx-auto origin-center py-2 sm:py-4"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold">
              Compact team of{" "}
              <span className="gradient-text">innovators</span>
            </h2>
          </ScrollScale>

          {/* Row 2 — slides in from right */}
          <div className="w-full overflow-hidden">
            <ScrollTranslateX
              inputRange={[0.3, 0.8]}
              xRange={["100%", "0%"]}
              className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 px-2 sm:px-4"
            >
              {ROW_TWO.map((member, index) => (
                <TeamCard
                  className="w-[calc(50%-0.5rem)] sm:w-[calc(25%-0.75rem)] md:w-[calc(12.5%-0.875rem)] bg-card border rounded-lg overflow-hidden"
                  key={index}
                  member={member}
                />
              ))}
            </ScrollTranslateX>
          </div>
        </ScrollTranslateY>
      </ScrollAnimation>

      {/* Join CTA */}
      <section className="py-10 sm:py-16 md:py-24 bg-muted/50">
        <div className="container">
          <AnimatedSection variant="scale-up">
            <Card className="gradient-bg text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
              <div className="absolute -top-20 -right-20 h-40 w-40 sm:h-60 sm:w-60 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-40 w-40 sm:h-60 sm:w-60 rounded-full bg-white/10 blur-3xl" />
              <CardContent className="relative py-8 sm:py-12 text-center px-4 sm:px-6">
                <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-4 animate-pulse-slow" />
                <h2 className="text-2xl sm:text-3xl font-bold md:text-4xl">
                  Want to Join MATH for AI?
                </h2>
                <p className="mt-3 sm:mt-4 text-white/80 max-w-xl mx-auto text-sm sm:text-base">
                  We&apos;re always looking for enthusiastic students passionate
                  about mathematics and artificial intelligence. Reach out to any
                  team member or contact us at{" "}
                  <strong className="break-all">socialmedia.cspit.aiml@charusat.ac.in</strong>
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
