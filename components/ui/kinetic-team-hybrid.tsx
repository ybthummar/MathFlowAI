'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import { ArrowUpRight, Minus, Plus } from 'lucide-react';
import Image from 'next/image';

/* ---------- Types ---------- */

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

/* ---------- Data ---------- */

const TEAM: TeamMember[] = [
  {
    id: '01',
    name: 'Mukti Patel',
    role: 'Faculty Coordinator',
    image: 'https://cspit.charusat.ac.in/CSPIT_Faculty/AIML/MUKTI_PATEL.webp',
  },
  {
    id: '02',
    name: 'Bhargav Shobhana',
    role: 'Faculty Coordinator',
    image: 'https://cspit.charusat.ac.in/CSPIT_Faculty/AIML/BHARGAV.webp',
  },
  {
    id: '03',
    name: 'Yash Davda',
    role: 'President',
    image: 'https://drive.google.com/thumbnail?id=1Q4ceFbsGKfFAwPo9czfo8NwhyKWpQIWX&sz=w800',
  },
  {
    id: '04',
    name: 'Dhwani Navadia',
    role: 'Vice President',
    image: 'https://drive.google.com/thumbnail?id=1fDC6wrBcmYpg_ggWtxawGeFumlfpYDc8&sz=w800',
  },
  {
    id: '05',
    name: 'Yug Thummar',
    role: 'Website Developer',
    image: 'https://drive.google.com/thumbnail?id=11wehUK0wOS-0Xn2ktS14Y5eJUhRmmeLk&sz=w800',
  },
  {
    id: '06',
    name: 'Krish Singh',
    role: 'Secretary',
    image: 'https://drive.google.com/thumbnail?id=1mDF6K89s18798e_qy3v1lWyQ70W2YbC3&sz=w800',
  },
  {
    id: '07',
    name: 'Hasti Bhalodiya',
    role: 'Treasurer',
    image: 'https://drive.google.com/thumbnail?id=1d8YZXTkd3zpotopY-WqX__q7yUPWIRA-&sz=w800',
  },
  {
    id: '08',
    name: 'Tirthkumar Kachhadiya',
    role: 'Promotion & Campaign',
    image: 'https://drive.google.com/thumbnail?id=1yd1-ruub6QB20IfQF9ZmmPfX-G5LWuA7&sz=w800',
  },
  {
    id: '09',
    name: 'Himay Thummar',
    role: 'Promotion & Campaign',
    image: 'https://drive.google.com/thumbnail?id=10ZbRIVUKgkCUmFb0PDAyysOQLw2S0znM&sz=w800',
  },
  {
    id: '10',
    name: 'Hetvi Patoliya',
    role: 'Promotion & Campaign',
    image: 'https://drive.google.com/thumbnail?id=1gT3XcancML1HR9MtzCfoGhYj9UUL07n_&sz=w800',
  },
  {
    id: '11',
    name: 'Ayushi Hirpara',
    role: 'Design & Creative',
    image: 'https://drive.google.com/thumbnail?id=1nfOryLDfD2IlPGw_Gyzqmqf196CthtZH&sz=w800',
  },
  {
    id: '12',
    name: 'Mahi Savani',
    role: 'Design & Creative',
    image: 'https://drive.google.com/thumbnail?id=1njIvpzYerSeSrTrRLs-5y7jh8B3cjbgZ&sz=w800',
  },
  {
    id: '13',
    name: 'Hitarth Khatiwala',
    role: 'Technical Team',
    image: 'https://drive.google.com/thumbnail?id=1ER4GL8eUXYXjWMaKL5bymWjhp4KtEQ4j&sz=w800',
  },
  {
    id: '14',
    name: 'Devang Dhandhukiya',
    role: 'Technical Team',
    image: 'https://drive.google.com/thumbnail?id=1qghqzkIAltBwwUVJuPCevQaXgtssWRwt&sz=w800',
  },
  {
    id: '15',
    name: 'Priyansh Vadukiya',
    role: 'Event Management',
    image: 'https://drive.google.com/thumbnail?id=171mTS5ROvMKkMb7Cekva9JC-ltFemM1a&sz=w800',
  },
  {
    id: '16',
    name: 'Dhriti Patel',
    role: 'Event Management',
    image: 'https://drive.google.com/thumbnail?id=1-p7gNK2esXkceK3hhnwQs0HgJG3OL_Yh&sz=w800',
  },
];

/* ---------- Main Component ---------- */

export default function KineticTeamHybrid() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    mouseX.set(e.clientX + 20);
    mouseY.set(e.clientY + 20);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full cursor-default bg-neutral-950 px-4 py-16 text-neutral-200 sm:px-6 md:px-12 md:py-24"
    >
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)]" />

      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col gap-4 md:mb-20 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <h1 className="text-4xl font-light tracking-tighter text-white sm:text-6xl md:text-8xl">
              Our <span className="text-neutral-600">Team</span>
            </h1>
          </div>
          <div className="mx-8 hidden h-px flex-1 bg-neutral-900 md:block" />
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
            Math for AI Club
          </p>
        </motion.header>

        {/* The List */}
        <div className="flex flex-col">
          {TEAM.map((member, index) => (
            <TeamRow
              key={member.id}
              data={member}
              index={index}
              isActive={activeId === member.id}
              setActiveId={setActiveId}
              isMobile={isMobile}
              isAnyActive={activeId !== null}
            />
          ))}
        </div>
      </div>

      {/* DESKTOP: Floating Cursor Image */}
      {!isMobile && (
        <motion.div
          style={{ x: cursorX, y: cursorY }}
          className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
        >
          <AnimatePresence mode="wait">
            {activeId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="relative h-72 w-56 overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-2xl"
              >
                <Image
                  src={TEAM.find((t) => t.id === activeId)?.image ?? ''}
                  alt="Preview"
                  fill
                  className="object-cover object-top"
                  unoptimized
                />
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                    <span className="text-[10px] uppercase tracking-widest text-white/80">
                      Active
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

/* ---------- Row Component ---------- */

function TeamRow({
  data,
  index,
  isActive,
  setActiveId,
  isMobile,
  isAnyActive,
}: {
  data: TeamMember;
  index: number;
  isActive: boolean;
  setActiveId: (id: string | null) => void;
  isMobile: boolean;
  isAnyActive: boolean;
}) {
  const isDimmed = isAnyActive && !isActive;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isDimmed ? 0.3 : 1,
        y: 0,
        backgroundColor:
          isActive && isMobile ? 'rgba(255,255,255,0.03)' : 'transparent',
      }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => !isMobile && setActiveId(data.id)}
      onMouseLeave={() => !isMobile && setActiveId(null)}
      onClick={() => isMobile && setActiveId(isActive ? null : data.id)}
      className={`group relative border-t border-neutral-900 transition-colors duration-500 last:border-b ${
        isMobile ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      <div className="relative z-10 flex flex-col py-5 md:flex-row md:items-center md:justify-between md:py-12">
        {/* Name & Index */}
        <div className="flex items-baseline gap-4 pl-2 transition-transform duration-500 group-hover:translate-x-4 md:gap-12 md:pl-0">
          <span className="font-mono text-xs text-neutral-600">
            {data.id}
          </span>
          <h2 className="text-2xl font-medium tracking-tight text-neutral-400 transition-colors duration-300 group-hover:text-white sm:text-3xl md:text-6xl">
            {data.name}
          </h2>
        </div>

        {/* Role & Icon */}
        <div className="mt-2 flex items-center justify-between pl-8 pr-2 md:mt-0 md:justify-end md:gap-12 md:pl-0 md:pr-0">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-600 transition-colors group-hover:text-neutral-400 sm:text-xs">
            {data.role}
          </span>

          {/* Mobile Toggle */}
          <div className="block text-neutral-500 md:hidden">
            {isActive ? <Minus size={18} /> : <Plus size={18} />}
          </div>

          {/* Desktop Arrow */}
          <motion.div
            animate={{ x: isActive ? 0 : -10, opacity: isActive ? 1 : 0 }}
            className="hidden text-white md:block"
          >
            <ArrowUpRight size={28} strokeWidth={1.5} />
          </motion.div>
        </div>
      </div>

      {/* MOBILE: Accordion — two photos side by side */}
      <AnimatePresence>
        {isMobile && isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden bg-neutral-900/50"
          >
            <div className="p-3">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
                <Image
                  src={data.image}
                  alt={data.name}
                  fill
                  className="object-cover object-top"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <p className="text-sm font-medium text-white">{data.name}</p>
                  <p className="text-xs uppercase tracking-widest text-white/70">
                    {data.role}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
