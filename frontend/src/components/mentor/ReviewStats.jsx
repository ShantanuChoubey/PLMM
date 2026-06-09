import { ResponsiveContainer, Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard } from '@/components/shared/MetricCard'
import { Star, MessageSquare } from 'lucide-react'

export function ReviewStats({ summary, trend }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard title="Average Rating" value={String(summary.averageRating)} icon={Star} description="Across all reviews" />
        <MetricCard title="Total Reviews" value={String(summary.totalReviews)} icon={MessageSquare} description="All time" />
      </div>
      <Card className="border-border/70">
        <CardHeader><CardTitle>Review Trends</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} domain={[4, 5]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
              <Line yAxisId="left" type="monotone" dataKey="rating" stroke="var(--primary)" strokeWidth={2} name="Avg Rating" />
              <Line yAxisId="right" type="monotone" dataKey="reviews" stroke="hsl(142 76% 36%)" strokeWidth={2} name="Reviews" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
