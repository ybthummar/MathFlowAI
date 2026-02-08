"use client"

import { Sparkles, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedSection } from "@/components/ui/animated-section"
import TeamSection, { TeamCategory } from "@/components/ui/team"
import type { TeamMember } from "@/components/ui/team"

// ─────────────────────────── TEAM DATA ───────────────────────────
// Replace placeholder images with real photos.
// Use /team/name.jpg in /public/team/ or any external URL.

const TEAM_CATEGORIES = [
  {
    title: "Core Leadership",
    members: [
      {
        name: "President Name",
        role: "President",
        avatar: "/team/president.jpg",
        link: "#",
      },
      {
        name: "Vice President Name",
        role: "Vice President",
        avatar: "/team/vice-president.jpg",
        link: "#",
      },
    ],
  },
  {
    title: "Tech Team",
    members: [
      {
        name: "Tech Lead Name",
        role: "Tech Lead",
        avatar: "/team/tech-lead.jpg",
        link: "#",
      },
      {
        name: "Tech Member 1",
        role: "Developer",
        avatar: "/team/tech-1.jpg",
        link: "#",
      },
      {
        name: "Tech Member 2",
        role: "Developer",
        avatar: "/team/tech-2.jpg",
        link: "#",
      },
    ],
  },
  {
    title: "Website Team",
    members: [
      {
        name: "Web Lead Name",
        role: "Web Lead",
        avatar: "/team/web-lead.jpg",
        link: "#",
      },
      {
        name: "Web Member 1",
        role: "Frontend Dev",
        avatar: "/team/web-1.jpg",
        link: "#",
      },
    ],
  },
  {
    title: "Event Management",
    members: [
      {
        name: "Event Head Name",
        role: "Event Head",
        avatar: "/team/event-head.jpg",
        link: "#",
      },
      {
        name: "Event Member 1",
        role: "Coordinator",
        avatar: "/team/event-1.jpg",
        link: "#",
      },
      {
        name: "Event Member 2",
        role: "Coordinator",
        avatar: "/team/event-2.jpg",
        link: "#",
      },
    ],
  },
  {
    title: "Design & Creative",
    members: [
      {
        name: "Design Lead Name",
        role: "Design Lead",
        avatar: "/team/design-lead.jpg",
        link: "#",
      },
      {
        name: "Design Member 1",
        role: "Graphic Designer",
        avatar: "/team/design-1.jpg",
        link: "#",
      },
    ],
  },
  {
    title: "PR & Media",
    members: [
      {
        name: "PR Lead Name",
        role: "PR Lead",
        avatar: "/team/pr-lead.jpg",
        link: "#",
      },
      {
        name: "Media Member 1",
        role: "Photographer",
        avatar: "/team/media-1.jpg",
        link: "#",
      },
    ],
  },
]

const totalMembers = TEAM_CATEGORIES.reduce((sum, cat) => sum + cat.members.length, 0)

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
            <Badge variant="secondary" className="mb-4 animate-bounce-subtle">
              <Sparkles className="mr-1 h-3 w-3" /> Meet the Crew
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Our <span className="gradient-text">Amazing Team</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto px-2">
              The passionate minds behind <strong>MATH for AI</strong> who make
              MathFlow AI possible. From leadership to logistics, design to code -
              meet the people who bring it all together.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 text-sm text-muted-foreground">
              <Users className="h-5 w-5 text-primary" />
              <span>
                {totalMembers} team members across {TEAM_CATEGORIES.length} divisions
              </span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Team Grid */}
      <AnimatedSection variant="fade-up" delay={200}>
        <TeamSection
          title="The team behind MathFlow AI"
          description="From leadership to logistics, design to code - our passionate team brings together their expertise to create an unforgettable experience for every participant."
          categories={TEAM_CATEGORIES}
        />
      </AnimatedSection>

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
