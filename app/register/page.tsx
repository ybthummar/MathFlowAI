import { Metadata } from "next"
import { RegistrationForm } from "@/components/forms/registration-form"
import { AnimatedSection } from "@/components/ui/animated-section"

export const metadata: Metadata = {
  title: "Register Your Team | MathFlow AI",
  description: "Register your team for the MathFlow AI event by MATH for AI.",
}

export default function RegisterPage() {
  return (
    <div className="container py-10 md:py-16">
      <div className="mx-auto max-w-3xl">
        <AnimatedSection variant="fade-down" duration={600}>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold md:text-4xl">Team Registration</h1>
            <p className="mt-2 text-muted-foreground">
              Register your team for MathFlow AI. Fill in all the details carefully.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection variant="fade-up" delay={200}>
          <RegistrationForm />
        </AnimatedSection>
      </div>
    </div>
  )
}
