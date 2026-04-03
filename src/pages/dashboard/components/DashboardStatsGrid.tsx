import { Link } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DashboardStatDisplay } from "@/pages/dashboard/dashboardStatConfig"

interface DashboardStatsGridProps {
  stats: DashboardStatDisplay[]
}

export const DashboardStatsGrid = ({ stats }: DashboardStatsGridProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.rowKey}
            className="p-0 shadow-sm transition-shadow hover:shadow-md"
          >
            <Link
              to={stat.href}
              aria-label={`${stat.title}: ${stat.count}. Open related page.`}
              className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div
                  className={`rounded-lg p-2 ${stat.iconBgClass}`}
                  aria-hidden
                >
                  <Icon className={`h-4 w-4 ${stat.iconClass}`} />
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="text-3xl font-bold tabular-nums">
                  {stat.count}
                </div>
              </CardContent>
            </Link>
          </Card>
        )
      })}
    </div>
  )
}
