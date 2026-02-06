"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Download,
  Filter,
  Loader2,
  LogOut,
  QrCode,
  RefreshCw,
  Search,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { DEPARTMENTS } from "@/lib/validators"

interface Member {
  name: string
  email: string
  rollNo: string
  year: string
  isLeader: boolean
}

interface Team {
  id: string
  registrationId: string
  teamName: string
  department: string
  leaderEmail: string
  leaderPhone: string
  status: "PENDING" | "APPROVED" | "REJECTED" | "WAITLIST"
  createdAt: string
  members: Member[]
}

interface AdminDashboardProps {
  admin: { id: string; email: string; name: string }
  onLogout: () => void
}

export function AdminDashboard({ admin, onLogout }: AdminDashboardProps) {
  const { toast } = useToast()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>({})
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 })

  // Filters
  const [search, setSearch] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Modal state
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [qrLoading, setQrLoading] = useState(false)

  const fetchTeams = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: "20",
      })

      if (search) params.set("search", search)
      if (departmentFilter !== "all") params.set("department", departmentFilter)
      if (statusFilter !== "all") params.set("status", statusFilter)

      const response = await fetch(`/api/admin?${params}`)
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setTeams(data.teams)
      setStats(data.stats)
      setPagination(data.pagination)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch teams",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [pagination.page, search, departmentFilter, statusFilter, toast])

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  const updateStatus = async (teamId: string, status: string) => {
    try {
      const response = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, status }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      toast({
        title: "Status Updated",
        description: `Team status changed to ${status}`,
      })

      fetchTeams()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update team status",
        variant: "destructive",
      })
    }
  }

  const generateQRCode = async (team: Team) => {
    setSelectedTeam(team)
    setQrModalOpen(true)
    setQrLoading(true)

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: team.id }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setQrCode(data.qrCode)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      })
    } finally {
      setQrLoading(false)
    }
  }

  const exportCSV = async () => {
    try {
      const params = new URLSearchParams()
      if (departmentFilter !== "all") params.set("department", departmentFilter)
      if (statusFilter !== "all") params.set("status", statusFilter)

      const response = await fetch(`/api/admin/export?${params}`)
      
      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `registrations-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: "CSV file has been downloaded",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export data",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      PENDING: { variant: "secondary", icon: Clock },
      APPROVED: { variant: "success", icon: CheckCircle },
      REJECTED: { variant: "destructive", icon: XCircle },
      WAITLIST: { variant: "warning", icon: AlertTriangle },
    }

    const { variant, icon: Icon } = variants[status] || variants.PENDING

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {admin.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="ghost" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byStatus?.PENDING || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byStatus?.APPROVED || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Waitlist</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byStatus?.WAITLIST || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teams..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="WAITLIST">Waitlist</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={fetchTeams}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Teams Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Teams</CardTitle>
          <CardDescription>
            Showing {teams.length} of {pagination.total} teams
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No teams found
            </div>
          ) : (
            <div className="space-y-4">
              {teams.map((team) => (
                <Card key={team.id} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{team.teamName}</h3>
                          {getStatusBadge(team.status)}
                        </div>
                        <div className="grid gap-1 text-sm text-muted-foreground">
                          <p>
                            <span className="font-medium text-foreground">ID:</span>{" "}
                            <code className="bg-muted px-1 rounded">{team.registrationId}</code>
                          </p>
                          <p>
                            <span className="font-medium text-foreground">Department:</span>{" "}
                            {team.department}
                          </p>
                          <p>
                            <span className="font-medium text-foreground">Leader:</span>{" "}
                            {team.leaderEmail} | {team.leaderPhone}
                          </p>
                          <p>
                            <span className="font-medium text-foreground">Members:</span>{" "}
                            {team.members.length}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Select
                          value={team.status}
                          onValueChange={(value) => updateStatus(team.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="APPROVED">Approve</SelectItem>
                            <SelectItem value="REJECTED">Reject</SelectItem>
                            <SelectItem value="WAITLIST">Waitlist</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => generateQRCode(team)}
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Members Expandable */}
                    <Separator className="my-4" />
                    <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-5">
                      {team.members.map((member, idx) => (
                        <div
                          key={idx}
                          className="text-sm p-2 rounded bg-muted/50"
                        >
                          <p className="font-medium flex items-center gap-1">
                            {member.name}
                            {member.isLeader && (
                              <Badge variant="outline" className="text-xs">★</Badge>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {member.rollNo}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    disabled={pagination.page <= 1}
                    onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR Code Modal */}
      <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Team Badge QR Code</DialogTitle>
            <DialogDescription>
              {selectedTeam?.teamName} - {selectedTeam?.registrationId}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-4">
            {qrLoading ? (
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            ) : qrCode ? (
              <>
                <img src={qrCode} alt="QR Code" className="w-64 h-64" />
                <p className="text-sm text-muted-foreground mt-2">
                  Scan to verify team registration
                </p>
                <Button
                  className="mt-4"
                  onClick={() => {
                    const link = document.createElement("a")
                    link.download = `badge-${selectedTeam?.registrationId}.png`
                    link.href = qrCode
                    link.click()
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Badge
                </Button>
              </>
            ) : (
              <p className="text-muted-foreground">Failed to generate QR code</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
