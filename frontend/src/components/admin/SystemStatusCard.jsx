import { Activity, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { SYSTEM_STATUS } from '@/mock/systemStatusData'

const statusIcons = {
  operational: CheckCircle2,
  degraded: AlertTriangle,
}

export function SystemStatusCard({ services = SYSTEM_STATUS, className }) {
  return (
    <Card className={className ?? 'border-border/70 bg-card/60'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-primary" aria-hidden="true" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {services.map((service) => {
          const Icon = statusIcons[service.status] ?? Activity
          return (
            <div key={service.id} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium">{service.label}</p>
                  <p className="text-xs text-muted-foreground">{service.latency} · {service.uptime} uptime</p>
                </div>
              </div>
              <StatusBadge status={service.status} />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
