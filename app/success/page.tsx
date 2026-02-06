import { Suspense } from "react"
import { SuccessContent } from "@/components/success-content"

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <SuccessContent />
    </Suspense>
  )
}

function SuccessLoading() {
  return (
    <div className="container py-16 text-center">
      <div className="animate-pulse space-y-4">
        <div className="h-16 w-16 bg-muted rounded-full mx-auto" />
        <div className="h-8 w-64 bg-muted rounded mx-auto" />
        <div className="h-4 w-48 bg-muted rounded mx-auto" />
      </div>
    </div>
  )
}
