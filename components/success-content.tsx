"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2, Download, Home, Loader2, Copy, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { AnimatedSection } from "@/components/ui/animated-section"

interface TeamData {
  registrationId: string
  teamName: string
  department: string
  leaderEmail: string
  status: string
  createdAt: string
  members: {
    name: string
    email: string
    rollNo: string
    year: string
    isLeader: boolean
  }[]
}

export function SuccessContent() {
  const searchParams = useSearchParams()
  const registrationId = searchParams.get("id")
  const { toast } = useToast()
  
  const [team, setTeam] = useState<TeamData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (registrationId) {
      fetchTeamData()
    } else {
      setError("No registration ID provided")
      setLoading(false)
    }
  }, [registrationId])

  const fetchTeamData = async () => {
    try {
      const response = await fetch(`/api/register?id=${registrationId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch team data")
      }

      setTeam(data.team)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (team?.registrationId) {
      await navigator.clipboard.writeText(team.registrationId)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Registration ID copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const [downloading, setDownloading] = useState(false)

  const downloadConfirmation = async () => {
    if (!team) return

    setDownloading(true)
    try {
      const response = await fetch(`/api/register/receipt?id=${team.registrationId}`)
      if (!response.ok) {
        throw new Error('Failed to generate receipt')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `MathFlowAI-Receipt-${team.registrationId}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Downloaded!",
        description: "PDF receipt has been downloaded",
      })
    } catch (err) {
      toast({
        title: "Download Failed",
        description: "Could not download the receipt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-muted-foreground">Loading your registration...</p>
      </div>
    )
  }

  if (error || !team) {
    return (
      <div className="container py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold">Registration Not Found</h1>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <Button asChild className="mt-6">
            <Link href="/register">Register Now</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 sm:py-10 md:py-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <AnimatedSection variant="scale-up" duration={600}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/logo.png" alt="MATH for AI Club" width={64} height={64} className="rounded-xl" />
          </div>
          <div className="h-20 w-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold md:text-4xl">Registration Successful!</h1>
          <p className="mt-2 text-muted-foreground">
            Your team has been registered for MathFlow AI
          </p>
        </div>
        </AnimatedSection>

        {/* Registration ID Card */}
        <AnimatedSection variant="fade-up" delay={200}>
        <Card className="mb-6 border-2 border-primary/20 bg-primary/5">
          <CardContent className="py-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Your Registration ID</p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <code className="text-xl sm:text-2xl md:text-3xl font-mono font-bold text-primary break-all">
                  {team.registrationId}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyToClipboard}
                  className="h-8 w-8"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Save this ID! You&apos;ll need it on the event day.
              </p>
            </div>
          </CardContent>
        </Card>
        </AnimatedSection>

        {/* Team Details */}
        <AnimatedSection variant="fade-up" delay={300}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Team Details</CardTitle>
            <CardDescription>Your registered team information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 text-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b gap-1">
                <span className="text-muted-foreground">Team Name</span>
                <span className="font-medium break-all">{team.teamName}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b gap-1">
                <span className="text-muted-foreground">Department</span>
                <span className="font-medium">{team.department}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b gap-1">
                <span className="text-muted-foreground">Contact Email</span>
                <span className="font-medium break-all">{team.leaderEmail}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b gap-1">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={team.status === "APPROVED" ? "success" : "secondary"}>
                  {team.status}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 gap-1">
                <span className="text-muted-foreground">Registered On</span>
                <span className="font-medium">
                  {new Date(team.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}{' '}
                  <span className="text-muted-foreground text-xs">
                    {new Date(team.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit', minute: '2-digit', hour12: true,
                    })}
                  </span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        </AnimatedSection>

        {/* Team Members */}
        <AnimatedSection variant="fade-up" delay={400}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Team Members ({team.members.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {team.members.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                    {member.isLeader ? "★" : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {member.name}
                      {member.isLeader && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Leader
                        </Badge>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {member.rollNo} • {member.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </AnimatedSection>

        {/* Important Notice */}
        <AnimatedSection variant="fade-up" delay={500}>
        <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/20">
          <CardContent className="py-4">
            <h4 className="font-semibold mb-2">📌 Important Information</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Event Date: <strong>February 21, 2026</strong></li>
              <li>• Venue: <strong>Seminar Hall 2nd Floor, CSPIT-A6 Building, CHARUSAT</strong></li>
              <li>• Reporting Time: <strong>8:30 AM</strong></li>
              <li>• All team members must carry valid college ID cards</li>
              <li>• A confirmation email has been sent to the team leader</li>
            </ul>
          </CardContent>
        </Card>
        </AnimatedSection>

        {/* Action Buttons */}
        <AnimatedSection variant="fade-up" delay={600}>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={downloadConfirmation} disabled={downloading} className="flex-1 hover-lift">
            {downloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Receipt (PDF)
              </>
            )}
          </Button>
          <Button asChild variant="outline" className="flex-1 hover-lift">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
