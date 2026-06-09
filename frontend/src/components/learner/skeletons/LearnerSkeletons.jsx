import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function MentorCardSkeleton() {
  return (
    <Card className="border-border/70">
      <CardHeader className="space-y-4">
        <div className="flex gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-14" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </CardContent>
    </Card>
  )
}

export function SessionCardSkeleton() {
  return (
    <Card className="border-border/70">
      <CardContent className="space-y-3 p-6">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardWidgetSkeleton() {
  return (
    <Card className="border-border/70">
      <CardHeader>
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </CardContent>
    </Card>
  )
}

export function RecommendationCardSkeleton() {
  return (
    <Card className="border-border/70">
      <CardContent className="space-y-4 p-6">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  )
}
