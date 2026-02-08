"use client"

import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface TeamMember {
  name: string
  role: string
  avatar: string
  link?: string
}

interface TeamCategoryProps {
  title: string
  members: TeamMember[]
  variant?: "grid" | "compact"
}

function MemberAvatar({ member }: { member: TeamMember }) {
  const [imgError, setImgError] = useState(false)
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="bg-background size-20 rounded-full border p-0.5 shadow shadow-zinc-950/5">
      {!imgError ? (
        <img
          className="aspect-square rounded-full object-cover"
          src={member.avatar}
          alt={member.name}
          height="460"
          width="460"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="aspect-square rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold">
          {initials}
        </div>
      )}
    </div>
  )
}

export function TeamCategory({ title, members, variant = "compact" }: TeamCategoryProps) {
  if (variant === "grid") {
    return (
      <div className="mt-12 md:mt-24">
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <div key={index} className="group overflow-hidden">
              <div className="relative h-96 w-full rounded-md overflow-hidden">
                <MemberGridImage member={member} />
              </div>
              <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                <div className="flex justify-between">
                  <h3 className="text-base font-medium transition-all duration-500 group-hover:tracking-wider">
                    {member.name}
                  </h3>
                  <span className="text-muted-foreground text-xs">
                    _0{index + 1}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-muted-foreground inline-block translate-y-6 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {member.role}
                  </span>
                  {member.link && (
                    <Link
                      href={member.link}
                      className="group-hover:text-primary inline-block translate-y-8 text-sm tracking-wide opacity-0 transition-all duration-500 hover:underline group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      Profile
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <h3 className="mb-6 text-lg font-medium">{title}</h3>
      <div className="grid grid-cols-2 gap-4 border-t py-6 md:grid-cols-4">
        {members.map((member, index) => (
          <div key={index}>
            <MemberAvatar member={member} />
            <span className="mt-2 block text-sm">{member.name}</span>
            <span className="text-muted-foreground block text-xs">{member.role}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MemberGridImage({ member }: { member: TeamMember }) {
  const [imgError, setImgError] = useState(false)
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  if (imgError) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold transition-all duration-500 group-hover:rounded-xl">
        {initials}
      </div>
    )
  }

  return (
    <img
      className="h-96 w-full rounded-md object-cover object-top grayscale transition-all duration-500 hover:grayscale-0 group-hover:h-[22.5rem] group-hover:rounded-xl"
      src={member.avatar}
      alt={member.name}
      width="826"
      height="1239"
      loading="lazy"
      onError={() => setImgError(true)}
    />
  )
}

export default function TeamSection({
  title = "Our team",
  description,
  categories,
}: {
  title?: string
  description?: string
  categories: { title: string; members: TeamMember[] }[]
}) {
  return (
    <section className="py-12 md:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-0 border-t">
        <span className="text-muted-foreground -ml-6 -mt-3.5 block w-max bg-background px-6 text-sm">
          Team
        </span>
        <div className="mt-12 gap-4 sm:grid sm:grid-cols-2 md:mt-24">
          <div className="sm:w-4/5">
            <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
          </div>
          {description && (
            <div className="mt-6 sm:mt-0">
              <p className="text-muted-foreground">{description}</p>
            </div>
          )}
        </div>

        {categories.map((category, index) => (
          <TeamCategory
            key={index}
            title={category.title}
            members={category.members}
            variant="compact"
          />
        ))}
      </div>
    </section>
  )
}

export type { TeamMember, TeamCategoryProps }
