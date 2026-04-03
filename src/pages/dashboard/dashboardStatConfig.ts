import type { LucideIcon } from "lucide-react"
import {
  Banknote,
  CheckCircle,
  ClipboardList,
  Clock,
  LayoutList,
  Scissors,
  Users,
} from "lucide-react"

import type { DashboardStatFromApi } from "@/services/dashboardServices"

export interface DashboardStatDisplay extends DashboardStatFromApi {
  /** Resolved key used for React list keys and config lookup. */
  rowKey: string
  icon: LucideIcon
  href?: string
  iconBgClass: string
  iconClass: string
}

interface StatUi {
  icon: LucideIcon
  href?: string
  iconBgClass: string
  iconClass: string
  title?: string
}

const DEFAULT_STAT_UI: StatUi = {
  icon: LayoutList,
  href: "/dashboard",
  iconBgClass: "bg-muted",
  iconClass: "text-muted-foreground",
}

/** Keys: camelCase (preferred) + snake_case aliases where APIs differ. */
const STAT_UI_BY_KEY: Record<string, StatUi> = {
  "Total Orders": {
    icon: ClipboardList,
    title: "Total Orders",
    href: "/orders/pending",
    iconBgClass: "bg-primary/10",
    iconClass: "text-primary",
  },
  "Pending Payments": {
    icon: Clock,
    title: "Pending Payments",
    // href: "/orders/pending",
    iconBgClass: "bg-amber-500/10",
    iconClass: "text-amber-800",
  },
  "Total Revenue": {
    icon: Banknote,
    title: "Total Revenue",
    // href: "/orders/completed",
    iconBgClass: "bg-primary/10",
    iconClass: "text-primary",
  },
  "Pending Orders": {
    icon: ClipboardList,
    title: "Pending Orders",
    href: "/orders/pending",
    iconBgClass: "bg-primary/10",
    iconClass: "text-primary",
  },
  "Assigned Orders": {
    icon: ClipboardList,
    title: "Assigned Orders",
    href: "/orders/assigned",
    iconBgClass: "bg-primary/10",
    iconClass: "text-primary",
  },
  "Total Assigned Orders": {
    icon: ClipboardList,
    title: "Total Assigned Orders",
    href: "/orders/assigned",
    iconBgClass: "bg-primary/10",
    iconClass: "text-primary",
  },
  "Completed Orders": {
    icon: CheckCircle,
    title: "Completed Orders",
    href: "/orders/completed",
    iconBgClass: "bg-primary/10",
    iconClass: "text-primary",
  },
  "Total Completed Orders": {
    icon: CheckCircle,
    title: "Total Completed Orders",
    href: "/orders/completed",
    iconBgClass: "bg-primary/10",
    iconClass: "text-primary",
  },
  "Total Professionals": {
    icon: Users,
    title: "Total Professionals",
    href: "/professionals",
    iconBgClass: "bg-primary/10",
    iconClass: "text-primary",
  },

  "Total Services": {
    icon: Scissors,
    title: "Total Services",
    href: "/services",
    iconBgClass: "bg-primary/10",
    iconClass: "text-primary",
  },
}

function resolveLookupKey(stat: DashboardStatFromApi): string {
  const fromKey = stat.key?.trim()
  if (fromKey) {
    return fromKey
  }
  return stat.title.trim()
}

export function enrichDashboardStats(
  stats: DashboardStatFromApi[]
): DashboardStatDisplay[] {
  return stats.map((stat, index) => {
    const lookupKey = resolveLookupKey(stat)
    const ui = STAT_UI_BY_KEY[lookupKey] ?? DEFAULT_STAT_UI
    const rowKey = stat.key?.trim() || `${lookupKey}-${index}`
    return {
      ...stat,
      rowKey,
      icon: ui.icon,
      href: ui.href,
      iconBgClass: ui.iconBgClass,
      iconClass: ui.iconClass,
    }
  })
}
