"use client"

import { useState } from "react"
import {
  Crown,
  Shield,
  Code2,
  Globe,
  Megaphone,
  Palette,
  Camera,
  Users,
  Sparkles,
  Mail,
  Linkedin,
  Instagram,
  Github,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AnimatedSection } from "@/components/ui/animated-section"
import { cn } from "@/lib/utils"

// ─────────────────────────── TEAM DATA ───────────────────────────
// Replace placeholder images with real photos.
// Use /team/name.jpg in /public/team/ or any external URL.

interface TeamMember {
  name: string
  role: string
  photo: string // path in /public/team/ or URL
  department?: string
  year?: string
  socials?: {
    email?: string
    linkedin?: string
    instagram?: string
    github?: string
  }
}

interface TeamCategory {
  title: string
  subtitle: string
  icon: React.ElementType
  gradient: string
  badgeColor: string
  members: TeamMember[]
}

const TEAM_CATEGORIES: TeamCategory[] = [
  {
    title: "Core Leadership",
    subtitle: "The visionaries leading MATH for AI",
    icon: Crown,
    gradient: "from-amber-500 to-orange-600",
    badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    members: [
      {
        name: "President Name",
        role: "President",
        photo: "/team/president.jpg",
        department: "CSPIT",
        year: "3rd Year",
        socials: {
          email: "president@charusat.edu.in",
          linkedin: "#",
          instagram: "#",
        },
      },
      {
        name: "Vice President Name",
        role: "Vice President",
        photo: "/team/vice-president.jpg",
        department: "CSPIT",
        year: "3rd Year",
        socials: {
          email: "vp@charusat.edu.in",
          linkedin: "#",
          instagram: "#",
        },
      },
    ],
  },
  {
    title: "Tech Team",
    subtitle: "Building the digital backbone of our events",
    icon: Code2,
    gradient: "from-violet-500 to-purple-600",
    badgeColor: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
    members: [
      {
        name: "Tech Lead Name",
        role: "Tech Lead",
        photo: "/team/tech-lead.jpg",
        department: "CSPIT",
        year: "2nd Year",
        socials: { github: "#", linkedin: "#" },
      },
      {
        name: "Tech Member 1",
        role: "Developer",
        photo: "/team/tech-1.jpg",
        department: "DEPSTAR",
        year: "2nd Year",
        socials: { github: "#" },
      },
      {
        name: "Tech Member 2",
        role: "Developer",
        photo: "/team/tech-2.jpg",
        department: "CSPIT",
        year: "1st Year",
        socials: { github: "#" },
      },
    ],
  },
  {
    title: "Website Team",
    subtitle: "Crafting the online experience you see right now",
    icon: Globe,
    gradient: "from-blue-500 to-cyan-600",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    members: [
      {
        name: "Web Lead Name",
        role: "Web Lead",
        photo: "/team/web-lead.jpg",
        department: "CSPIT",
        year: "2nd Year",
        socials: { github: "#", linkedin: "#" },
      },
      {
        name: "Web Member 1",
        role: "Frontend Dev",
        photo: "/team/web-1.jpg",
        department: "CSPIT",
        year: "2nd Year",
        socials: { github: "#" },
      },
    ],
  },
  {
    title: "Event Management",
    subtitle: "Making sure everything runs perfectly on the big day",
    icon: Megaphone,
    gradient: "from-emerald-500 to-teal-600",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    members: [
      {
        name: "Event Head Name",
        role: "Event Head",
        photo: "/team/event-head.jpg",
        department: "DEPSTAR",
        year: "2nd Year",
        socials: { instagram: "#" },
      },
      {
        name: "Event Member 1",
        role: "Coordinator",
        photo: "/team/event-1.jpg",
        department: "CSPIT",
        year: "1st Year",
      },
      {
        name: "Event Member 2",
        role: "Coordinator",
        photo: "/team/event-2.jpg",
        department: "PDPIAS",
        year: "1st Year",
      },
    ],
  },
  {
    title: "Design & Creative",
    subtitle: "The artists behind our visual identity",
    icon: Palette,
    gradient: "from-pink-500 to-rose-600",
    badgeColor: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    members: [
      {
        name: "Design Lead Name",
        role: "Design Lead",
        photo: "/team/design-lead.jpg",
        department: "CSPIT",
        year: "2nd Year",
        socials: { instagram: "#" },
      },
      {
        name: "Design Member 1",
        role: "Graphic Designer",
        photo: "/team/design-1.jpg",
        department: "CSPIT",
        year: "1st Year",
      },
    ],
  },
  {
    title: "PR & Media",
    subtitle: "Spreading the word and capturing memories",
    icon: Camera,
    gradient: "from-sky-500 to-indigo-600",
    badgeColor: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
    members: [
      {
        name: "PR Lead Name",
        role: "PR Lead",
        photo: "/team/pr-lead.jpg",
        department: "DEPSTAR",
        year: "2nd Year",
        socials: { instagram: "#", linkedin: "#" },
      },
      {
        name: "Media Member 1",
        role: "Photographer",
        photo: "/team/media-1.jpg",
        department: "CSPIT",
        year: "1st Year",
      },
    ],
  },
]

// ─────────────────────────── COMPONENTS ───────────────────────────

function MemberCard({
  member,
  gradient,
  badgeColor,
  index,
}: {
  member: TeamMember
  gradient: string
  badgeColor: string
  index: number
}) {
  const [imgError, setImgError] = useState(false)
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <AnimatedSection variant="scale-up" delay={index * 120} duration={600}>
      <Card className="group relative overflow-hidden border-2 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
        {/* Decorative top gradient bar */}
        <div className={cn("h-1.5 w-full bg-gradient-to-r", gradient)} />

        <CardContent className="pt-6 pb-5 text-center">
          {/* Photo / Avatar */}
          <div className="relative mx-auto mb-4 h-28 w-28">
            <div
              className={cn(
                "absolute inset-0 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md",
                gradient
              )}
            />
            <div className="relative h-28 w-28 rounded-full overflow-hidden border-4 border-background shadow-lg ring-2 ring-muted group-hover:ring-primary/30 transition-all duration-500">
              {!imgError ? (
                <img
                  src={member.photo}
                  alt={member.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div
                  className={cn(
                    "h-full w-full flex items-center justify-center bg-gradient-to-br text-white text-2xl font-bold",
                    gradient
                  )}
                >
                  {initials}
                </div>
              )}
            </div>
          </div>

          {/* Name & Role */}
          <h3 className="font-semibold text-lg leading-tight">{member.name}</h3>
          <Badge className={cn("mt-2 text-xs font-medium", badgeColor)}>
            {member.role}
          </Badge>

          {/* Department & Year */}
          {(member.department || member.year) && (
            <p className="mt-2 text-xs text-muted-foreground">
              {[member.department, member.year].filter(Boolean).join(" • ")}
            </p>
          )}

          {/* Social Links */}
          {member.socials && (
            <div className="mt-3 flex justify-center gap-2">
              {member.socials.email && (
                <a
                  href={`mailto:${member.socials.email}`}
                  className="rounded-full p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label={`Email ${member.name}`}
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
              {member.socials.linkedin && (
                <a
                  href={member.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-1.5 text-muted-foreground hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  aria-label={`LinkedIn ${member.name}`}
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {member.socials.instagram && (
                <a
                  href={member.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-1.5 text-muted-foreground hover:text-pink-600 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
                  aria-label={`Instagram ${member.name}`}
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {member.socials.github && (
                <a
                  href={member.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label={`GitHub ${member.name}`}
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </AnimatedSection>
  )
}

function CategorySection({
  category,
  categoryIndex,
}: {
  category: TeamCategory
  categoryIndex: number
}) {
  const Icon = category.icon

  return (
    <section className="relative">
      {/* Section Header */}
      <AnimatedSection variant="fade-up" delay={categoryIndex * 80}>
        <div className="flex items-center gap-4 mb-8">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg",
              category.gradient
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{category.title}</h2>
            <p className="text-sm text-muted-foreground">{category.subtitle}</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Members Grid */}
      <div
        className={cn(
          "grid gap-6",
          category.members.length === 1
            ? "max-w-xs mx-auto"
            : category.members.length === 2
            ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {category.members.map((member, memberIdx) => (
          <MemberCard
            key={member.name}
            member={member}
            gradient={category.gradient}
            badgeColor={category.badgeColor}
            index={memberIdx}
          />
        ))}
      </div>
    </section>
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
            <Badge variant="secondary" className="mb-4 animate-bounce-subtle">
              <Sparkles className="mr-1 h-3 w-3" /> Meet the Crew
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Our <span className="gradient-text">Amazing Team</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              The passionate minds behind <strong>MATH for AI</strong> who make
              MathFlow AI possible. From leadership to logistics, design to code —
              meet the people who bring it all together.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 text-sm text-muted-foreground">
              <Users className="h-5 w-5 text-primary" />
              <span>
                {TEAM_CATEGORIES.reduce((sum, cat) => sum + cat.members.length, 0)} team members across{" "}
                {TEAM_CATEGORIES.length} divisions
              </span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Team Categories */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="space-y-20">
            {TEAM_CATEGORIES.map((category, idx) => (
              <div key={category.title}>
                <CategorySection category={category} categoryIndex={idx} />
                {idx < TEAM_CATEGORIES.length - 1 && (
                  <Separator className="mt-16" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <AnimatedSection variant="scale-up">
            <Card className="gradient-bg text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
              <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
              <CardContent className="relative py-12 text-center">
                <Sparkles className="h-10 w-10 mx-auto mb-4 animate-pulse-slow" />
                <h2 className="text-3xl font-bold md:text-4xl">
                  Want to Join MATH for AI?
                </h2>
                <p className="mt-4 text-white/80 max-w-xl mx-auto">
                  We&apos;re always looking for enthusiastic students passionate
                  about mathematics and artificial intelligence. Reach out to any
                  team member or contact us at{" "}
                  <strong>mathforai@charusat.edu.in</strong>
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
