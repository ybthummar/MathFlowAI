import Link from "next/link"
import { ArrowRight, Brain, Clock, MapPin, Users, Zap, Trophy, Target, Puzzle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CountdownTimer } from "@/components/countdown-timer"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-violet-950/20 dark:via-background dark:to-blue-950/20" />
        
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-violet-200/50 blur-3xl dark:bg-violet-900/20" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-200/50 blur-3xl dark:bg-blue-900/20" />
        </div>

        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              🎯 Upcoming Events
            </Badge>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="gradient-text">MathFlow AI</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              A flagship event by <strong>MATH for AI</strong> — Unlock the power of 
              mathematics and artificial intelligence in this thrilling escape room 
              competition. Form your team, solve puzzles, and conquer the challenge!
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="gradient-bg text-white hover:opacity-90">
                <Link href="/register">
                  Register Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#event-flow">
                  Learn More
                </a>
              </Button>
            </div>

            {/* Countdown Timer */}
            <div className="mt-12">
              <CountdownTimer />
            </div>
          </div>
        </div>
      </section>

      {/* Event Info Cards */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-2 hover:border-violet-300 transition-colors">
              <CardHeader>
                <Clock className="h-10 w-10 text-violet-600" />
                <CardTitle>Event Date</CardTitle>
                <CardDescription>February 21, 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  9:00 AM - 5:00 PM IST
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader>
                <MapPin className="h-10 w-10 text-blue-600" />
                <CardTitle>Venue</CardTitle>
                <CardDescription>Main Auditorium</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Tech Campus, Innovation Block
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-300 transition-colors">
              <CardHeader>
                <Users className="h-10 w-10 text-green-600" />
                <CardTitle>Team Size</CardTitle>
                <CardDescription>3-5 Members</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Form your dream team and compete!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Event Flow Section */}
      <section id="event-flow" className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold md:text-4xl">Event Flow</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Two exciting rounds await you. Show your problem-solving skills and AI knowledge!
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Round 1 */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/20 to-transparent rounded-bl-full" />
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-bg text-white">
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
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-violet-600 mt-0.5" />
                    <span>Mathematical puzzle-based challenges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-violet-600 mt-0.5" />
                    <span>Team collaboration required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-violet-600 mt-0.5" />
                    <span>Time-bound escape scenarios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-violet-600 mt-0.5" />
                    <span>Logical reasoning & pattern recognition</span>
                  </li>
                </ul>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Duration:</strong> 90 minutes
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Round 2 */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full" />
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
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
                  <li className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>AI & Machine Learning tasks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Prompt engineering challenges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Problem-solving with AI tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Innovation & creativity scoring</span>
                  </li>
                </ul>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Duration:</strong> 120 minutes
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Prizes Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold md:text-4xl">Prizes & Rewards</h2>
            <p className="mt-4 text-muted-foreground">
              Total Prize Pool: <strong className="text-primary">₹10,000</strong>
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <Card className="text-center border-2 border-yellow-400/50 bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-950/20 dark:to-background">
              <CardHeader>
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
                <CardTitle className="text-2xl">1st Place</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold gradient-text">₹5,000</p>
                <p className="text-sm text-muted-foreground mt-2">+ Certificates & Swag</p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-gray-400/50 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950/20 dark:to-background">
              <CardHeader>
                <Trophy className="h-14 w-14 text-gray-400 mx-auto" />
                <CardTitle className="text-xl">2nd Place</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₹3,000</p>
                <p className="text-sm text-muted-foreground mt-2">+ Certificates</p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-orange-400/50 bg-gradient-to-b from-orange-50 to-white dark:from-orange-950/20 dark:to-background">
              <CardHeader>
                <Trophy className="h-12 w-12 text-orange-600 mx-auto" />
                <CardTitle className="text-xl">3rd Place</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₹2,000</p>
                <p className="text-sm text-muted-foreground mt-2">+ Certificates</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold md:text-4xl">Rules & Guidelines</h2>
            </div>

            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  {[
                    "Teams must have 3-5 members from the same institution",
                    "All team members must carry valid college ID cards",
                    "One person cannot be part of multiple teams",
                    "Use of external help or internet during rounds is prohibited",
                    "Decisions of the judges will be final and binding",
                    "Teams arriving late may be disqualified",
                    "Maintain decorum and respect fellow participants",
                    "Electronic devices must be submitted before rounds begin",
                  ].map((rule, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full gradient-bg text-white text-xs">
                        {i + 1}
                      </span>
                      <span className="text-sm">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <Card className="gradient-bg text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <CardContent className="relative py-12 text-center">
              <h2 className="text-3xl font-bold md:text-4xl">Ready to Take the Challenge?</h2>
              <p className="mt-4 text-white/80 max-w-xl mx-auto">
                Join MATH for AI&apos;s flagship event! Form your team, register now, 
                and embark on an exciting journey of mathematics and artificial intelligence!
              </p>
              <Button
                asChild
                size="lg"
                className="mt-8 bg-white text-violet-700 hover:bg-white/90"
              >
                <Link href="/register">
                  Register Your Team
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
