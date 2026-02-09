"use client"

import { useState } from "react"

export interface TeamMember {
  name: string
  role: string
  avatar: string
}

export interface TeamCategoryData {
  title: string
  members: TeamMember[]
}

function MemberAvatar({ member }: { member: TeamMember }) {
  const [imgError, setImgError] = useState(false)
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const showImage = member.avatar && !imgError

  return (
    <div className="bg-background size-20 rounded-full border p-0.5 shadow shadow-zinc-950/5">
      {showImage ? (
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

export default function TeamSection({
  title = "Our team",
  categories,
}: {
  title?: string
  categories: TeamCategoryData[]
}) {
  return (
    <section className="py-12 md:py-32">
      <div className="mx-auto max-w-3xl px-8 lg:px-0">
        <h2 className="mb-8 text-4xl font-bold md:mb-16 lg:text-5xl">
          {title}
        </h2>

        {categories.map((category, index) => (
          <div key={index} className={index > 0 ? "mt-6" : undefined}>
            <h3 className="mb-6 text-lg font-medium">{category.title}</h3>
            <div className="grid grid-cols-2 gap-4 border-t py-6 md:grid-cols-4">
              {category.members.map((member, mIndex) => (
                <div key={mIndex}>
                  <MemberAvatar member={member} />
                  <span className="mt-2 block text-sm">{member.name}</span>
                  <span className="text-muted-foreground block text-xs">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
