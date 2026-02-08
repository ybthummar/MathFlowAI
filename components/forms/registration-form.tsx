"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, Trash2, Users, User, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"

import { registrationSchema, RegistrationInput, DEPARTMENTS, YEARS } from "@/lib/validators"
import { cn } from "@/lib/utils"

const STEPS = [
  { id: 1, title: "Team Info", icon: Users },
  { id: 2, title: "Team Members", icon: User },
  { id: 3, title: "Review & Submit", icon: CheckCircle2 },
]

export function RegistrationForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      teamName: "",
      department: "",
      leaderEmail: "",
      leaderPhone: "",
      members: [
        { name: "", email: "", phone: "", rollNo: "", year: "", isLeader: true },
        { name: "", email: "", phone: "", rollNo: "", year: "", isLeader: false },
        { name: "", email: "", phone: "", rollNo: "", year: "", isLeader: false },
      ],
      agreedToRules: false,
    },
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  })

  const watchMembers = form.watch("members")

  const addMember = () => {
    if (fields.length < 5) {
      append({ name: "", email: "", phone: "", rollNo: "", year: "", isLeader: false })
    }
  }

  const removeMember = (index: number) => {
    if (fields.length > 3 && index > 0) {
      remove(index)
    }
  }

  const validateStep1 = async () => {
    const result = await form.trigger(["teamName", "department", "leaderEmail", "leaderPhone"])
    return result
  }

  const validateStep2 = async () => {
    const result = await form.trigger("members")
    return result
  }

  const nextStep = async () => {
    let isValid = false
    
    if (currentStep === 1) {
      isValid = await validateStep1()
    } else if (currentStep === 2) {
      isValid = await validateStep2()
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const onSubmit = async (data: RegistrationInput) => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Registration failed")
      }

      toast({
        title: "Registration Successful!",
        description: "Your team has been registered successfully.",
        variant: "success",
      })

      // Redirect to success page with registration data
      router.push(`/success?id=${result.registrationId}`)
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-2 md:space-x-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center rounded-full transition-colors",
                  currentStep >= step.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                  "h-10 w-10 md:h-12 md:w-12"
                )}
              >
                <step.icon className="h-5 w-5" />
              </div>
              <span
                className={cn(
                  "ml-2 hidden sm:block text-sm font-medium",
                  currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-2 md:mx-4 h-1 w-8 md:w-16 rounded-full",
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Step 1: Team Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Team Information</CardTitle>
              <CardDescription>
                Enter your team details. The team name must be unique.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="teamName">Team Name *</Label>
                <Input
                  id="teamName"
                  placeholder="Enter your unique team name"
                  {...form.register("teamName")}
                />
                {form.formState.errors.teamName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.teamName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={form.watch("department")}
                  onValueChange={(value) => form.setValue("department", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.department && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.department.message}
                  </p>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Team Leader Contact</h4>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="leaderEmail">Email *</Label>
                    <Input
                      id="leaderEmail"
                      type="email"
                      placeholder="24aimlXYZ@charusat.edu.in"
                      {...form.register("leaderEmail")}
                    />
                    {form.formState.errors.leaderEmail && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.leaderEmail.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="leaderPhone">Phone *</Label>
                    <Input
                      id="leaderPhone"
                      placeholder="9876543210"
                      {...form.register("leaderPhone")}
                    />
                    {form.formState.errors.leaderPhone && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.leaderPhone.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Team Members */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Team Members ({fields.length}/5)</CardTitle>
              <CardDescription>
                Add 3-5 team members. At least 1 must be from 1st year. The first member is the team leader.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={cn(
                    "rounded-lg border p-4 space-y-4",
                    index === 0 && "border-primary bg-primary/5"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      {index === 0 ? (
                        <>
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                            ★
                          </span>
                          Team Leader
                        </>
                      ) : (
                        <>
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                            {index + 1}
                          </span>
                          Member {index + 1}
                        </>
                      )}
                    </h4>
                    {index > 0 && fields.length > 3 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMember(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Full Name *</Label>
                      <Input
                        placeholder="Enter full name"
                        {...form.register(`members.${index}.name`)}
                      />
                      {form.formState.errors.members?.[index]?.name && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.members[index]?.name?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        placeholder="24AIMLxyz@charusat.edu.in"
                        {...form.register(`members.${index}.email`)}
                      />
                      {form.formState.errors.members?.[index]?.email && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.members[index]?.email?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Phone *</Label>
                      <Input
                        placeholder="9876543210"
                        {...form.register(`members.${index}.phone`)}
                      />
                      {form.formState.errors.members?.[index]?.phone && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.members[index]?.phone?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Roll No *</Label>
                      <Input
                        placeholder="Enter roll number"
                        {...form.register(`members.${index}.rollNo`)}
                      />
                      {form.formState.errors.members?.[index]?.rollNo && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.members[index]?.rollNo?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label>Year *</Label>
                      <Select
                        value={watchMembers[index]?.year || ""}
                        onValueChange={(value) => form.setValue(`members.${index}.year`, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {YEARS.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.members?.[index]?.year && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.members[index]?.year?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {fields.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addMember}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Member ({fields.length}/5)
                </Button>
              )}

              {form.formState.errors.members && !Array.isArray(form.formState.errors.members) && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.members.message}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Review & Submit */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
              <CardDescription>
                Please review your registration details before submitting.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Team Info Summary */}
              <div className="rounded-lg border p-3 sm:p-4 space-y-3">
                <h4 className="font-semibold">Team Information</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-muted-foreground">Team Name:</span>
                    <span className="font-medium break-all">{form.watch("teamName")}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-muted-foreground">Department:</span>
                    <span className="font-medium">{form.watch("department")}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-muted-foreground">Leader Email:</span>
                    <span className="font-medium break-all">{form.watch("leaderEmail")}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-muted-foreground">Leader Phone:</span>
                    <span className="font-medium">{form.watch("leaderPhone")}</span>
                  </div>
                </div>
              </div>

              {/* Members Summary */}
              <div className="rounded-lg border p-4 space-y-3">
                <h4 className="font-semibold">Team Members ({watchMembers.length})</h4>
                <div className="space-y-2">
                  {watchMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm p-2 rounded bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                          {index + 1}
                        </span>
                        <span className="font-medium">{member.name || "—"}</span>
                        {index === 0 && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                            Leader
                          </span>
                        )}
                      </div>
                      <span className="text-muted-foreground">{member.rollNo || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agreement */}
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/20 p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreedToRules"
                    checked={form.watch("agreedToRules")}
                    onCheckedChange={(checked) =>
                      form.setValue("agreedToRules", checked as boolean)
                    }
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="agreedToRules"
                      className="text-sm font-medium cursor-pointer"
                    >
                      I agree to the Rules & Code of Conduct *
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      By checking this box, you confirm that all team members have read and
                      agree to follow the event rules and maintain proper conduct throughout
                      the competition.
                    </p>
                  </div>
                </div>
                {form.formState.errors.agreedToRules && (
                  <p className="text-sm text-destructive mt-2">
                    {form.formState.errors.agreedToRules.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep < 3 ? (
            <Button type="button" onClick={nextStep}>
              Next Step
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting || !form.watch("agreedToRules")}
              className="gradient-bg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Registration"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
